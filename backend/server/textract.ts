import {
  Block,
  GetDocumentAnalysisCommand,
  StartDocumentAnalysisCommand,
  TextractClient,
} from "@aws-sdk/client-textract";

import {
  ExtractedTransactionInput,
  categorizeTransaction,
  extractPayee,
  normalizeWhitespace,
  parseAmount,
  parseDate,
} from "./statement";
import { bucketName, textractRegion } from "./s3";

const textractClient = new TextractClient({ region: textractRegion });

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function collectRelationships(block: Block | undefined, blocksById: Map<string, Block>, relationshipType?: string) {
  if (!block?.Relationships) {
    return [];
  }

  return block.Relationships
    .filter((relationship) => !relationshipType || relationship.Type === relationshipType)
    .flatMap((relationship) => relationship.Ids ?? [])
    .map((id) => blocksById.get(id))
    .filter((item): item is Block => Boolean(item));
}

function getBlockText(block: Block | undefined, blocksById: Map<string, Block>) {
  if (!block) {
    return "";
  }

  if (block.BlockType === "WORD" && block.Text) {
    return block.Text;
  }

  if (block.BlockType === "SELECTION_ELEMENT") {
    return block.SelectionStatus === "SELECTED" ? "X" : "";
  }

  const children = collectRelationships(block, blocksById, "CHILD");
  const text = children
    .map((child) => getBlockText(child, blocksById))
    .filter(Boolean)
    .join(" ");

  return normalizeWhitespace(text);
}

function amountCandidates(value: string) {
  const matches = value.match(/(?:₹|Rs\.?|INR|\$|€|£)?\s*\(?-?\d[\d,]*(?:\.\d{2})?\)?/g) ?? [];
  return matches
    .map((entry) => parseAmount(entry))
    .filter((entry): entry is number => entry !== null);
}

function inferDirectionFromCells(cells: string[], amount: number, description: string) {
  const joined = `${cells.join(" ")} ${description}`.toLowerCase();

  if (/credit|cr|deposit|received|salary|refund/.test(joined)) {
    return "credit" as const;
  }

  if (/debit|dr|withdraw|purchase|payment|upi|atm|pos/.test(joined)) {
    return "debit" as const;
  }

  return amount < 0 ? ("debit" as const) : ("credit" as const);
}

function extractTransactionFromRow(cells: string[], confidence: number): ExtractedTransactionInput | null {
  const cleaned = cells.map((cell) => normalizeWhitespace(cell)).filter(Boolean);
  if (cleaned.length < 2) {
    return null;
  }

  const dateIndex = cleaned.findIndex((cell) => parseDate(cell));
  if (dateIndex === -1) {
    return null;
  }

  const transactionDate = parseDate(cleaned[dateIndex]);
  if (!transactionDate) {
    return null;
  }

  const numericCells = cleaned
    .map((cell, index) => ({ index, values: amountCandidates(cell), raw: cell }))
    .filter((entry) => entry.values.length > 0);

  if (numericCells.length === 0) {
    return null;
  }

  const balanceCandidate = numericCells[numericCells.length - 1];
  const amountCandidate = numericCells.length > 1 ? numericCells[numericCells.length - 2] : numericCells[0];
  const derivedAmount = Math.abs(amountCandidate.values[amountCandidate.values.length - 1]);
  if (!Number.isFinite(derivedAmount) || derivedAmount === 0) {
    return null;
  }

  const description = normalizeWhitespace(
    cleaned
      .filter((cell, index) => index !== dateIndex && index !== amountCandidate.index && index !== balanceCandidate.index)
      .join(" "),
  );

  if (!description || /^date$/i.test(description)) {
    return null;
  }

  const direction = inferDirectionFromCells(cleaned, amountCandidate.values[0], description);
  const balance =
    balanceCandidate.index !== amountCandidate.index
      ? Math.abs(balanceCandidate.values[balanceCandidate.values.length - 1])
      : null;

  return {
    transactionDate,
    description,
    payee: extractPayee(description),
    amount: derivedAmount,
    balance,
    direction,
    category: categorizeTransaction(description, direction),
    extractionConfidence: confidence,
    rawRow: { cells: cleaned },
  };
}

function extractTransactionsFromTables(blocks: Block[]) {
  const blocksById = new Map<string, Block>();
  for (const block of blocks) {
    if (block.Id) {
      blocksById.set(block.Id, block);
    }
  }

  const results: ExtractedTransactionInput[] = [];
  const tables = blocks.filter((block) => block.BlockType === "TABLE");

  for (const table of tables) {
    const cells = collectRelationships(table, blocksById, "CHILD").filter((block) => block.BlockType === "CELL");
    const rows = new Map<number, Array<{ column: number; text: string; confidence: number }>>();

    for (const cell of cells) {
      const rowIndex = cell.RowIndex ?? 0;
      const current = rows.get(rowIndex) ?? [];
      current.push({
        column: cell.ColumnIndex ?? 0,
        text: getBlockText(cell, blocksById),
        confidence: cell.Confidence ?? 0,
      });
      rows.set(rowIndex, current);
    }

    for (const [rowIndex, row] of rows.entries()) {
      if (rowIndex === 1) {
        continue;
      }

      const ordered = row.sort((left, right) => left.column - right.column);
      const extracted = extractTransactionFromRow(
        ordered.map((cell) => cell.text),
        ordered.reduce((sum, cell) => sum + cell.confidence, 0) / Math.max(ordered.length, 1),
      );

      if (extracted) {
        results.push(extracted);
      }
    }
  }

  return results;
}

function extractTransactionsFromLines(blocks: Block[]) {
  const lines = blocks.filter((block) => block.BlockType === "LINE" && block.Text);
  const results: ExtractedTransactionInput[] = [];

  for (const line of lines) {
    const text = normalizeWhitespace(line.Text ?? "");
    const parts = text.split(/\s{2,}/).filter(Boolean);
    if (parts.length < 3) {
      continue;
    }

    const transactionDate = parseDate(parts[0]);
    if (!transactionDate) {
      continue;
    }

    const candidates = amountCandidates(text);
    if (candidates.length === 0) {
      continue;
    }

    const amount = Math.abs(candidates[candidates.length - 1]);
    if (!Number.isFinite(amount) || amount === 0) {
      continue;
    }

    const balance = candidates.length > 1 ? Math.abs(candidates[candidates.length - 2]) : null;
    const description = normalizeWhitespace(
      parts.slice(1, Math.max(2, parts.length - Math.min(2, candidates.length))).join(" "),
    );

    if (!description) {
      continue;
    }

    const direction = inferDirectionFromCells(parts, candidates[0], description);
    results.push({
      transactionDate,
      description,
      payee: extractPayee(description),
      amount,
      balance,
      direction,
      category: categorizeTransaction(description, direction),
      extractionConfidence: line.Confidence ?? 0,
      rawRow: { line: text },
    });
  }

  return results;
}

function dedupeTransactions(rows: ExtractedTransactionInput[]) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = [
      row.transactionDate,
      row.description.toLowerCase(),
      row.amount.toFixed(2),
      row.direction,
      row.balance?.toFixed(2) ?? "",
    ].join("::");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function extractPdfTransactionsFromS3(s3Key: string) {
  const start = await textractClient.send(
    new StartDocumentAnalysisCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: bucketName,
          Name: s3Key,
        },
      },
      FeatureTypes: ["TABLES", "LAYOUT"],
    }),
  );

  if (!start.JobId) {
    throw new Error("Textract did not return a job id.");
  }

  const allBlocks: Block[] = [];
  let nextToken: string | undefined;
  let status = "IN_PROGRESS";

  while (status === "IN_PROGRESS") {
    await sleep(3000);

    nextToken = undefined;
    allBlocks.length = 0;

    do {
      const page = await textractClient.send(
        new GetDocumentAnalysisCommand({
          JobId: start.JobId,
          NextToken: nextToken,
        }),
      );

      status = page.JobStatus ?? "FAILED";
      if (status === "FAILED") {
        throw new Error(page.StatusMessage || "Textract analysis failed.");
      }

      if (status === "PARTIAL_SUCCESS") {
        throw new Error(page.StatusMessage || "Textract completed partially and could not be trusted.");
      }

      if (status === "SUCCEEDED") {
        allBlocks.push(...(page.Blocks ?? []));
      }

      nextToken = page.NextToken;
    } while (status === "SUCCEEDED" && nextToken);
  }

  const fromTables = extractTransactionsFromTables(allBlocks);
  const fromLines = fromTables.length > 0 ? [] : extractTransactionsFromLines(allBlocks);
  const extracted = dedupeTransactions(fromTables.length > 0 ? fromTables : fromLines)
    .filter((entry) => entry.description.length >= 3)
    .sort((left, right) => left.transactionDate.localeCompare(right.transactionDate));

  if (extracted.length === 0) {
    throw new Error("Textract finished, but no transaction rows could be recognized from the PDF.");
  }

  return extracted;
}
