import { Router } from "express";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import ExcelJS from "exceljs";
import { ResultSetHeader, RowDataPacket } from "mysql2";

import { AlertsResponse, AnalyticsResponse, DashboardResponse, DocumentRecord, TransactionRecord } from "@shared/api";
import { db, ensureSchema } from "../db";
import { bucketName, region, s3Client } from "../s3";
import {
  buildAlerts,
  buildCategoryBreakdown,
  buildMetrics,
  buildMonthlySeries,
  buildPayeeBreakdown,
  buildPayeeLedger,
  buildRecurringTransactions,
  categorizeTransaction,
  resolvePayeeName,
} from "../statement";
import { extractPdfTransactionsFromS3 } from "../textract";

export const usersRouter = Router();

interface DocumentRow extends RowDataPacket {
  id: number;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_key: string;
  public_url: string;
  uploaded_at: Date | string;
  extraction_status: "uploaded" | "processing" | "completed" | "failed";
  extraction_error: string | null;
  statement_start_date: Date | string | null;
  statement_end_date: Date | string | null;
  transaction_count: number;
}

interface TransactionRow extends RowDataPacket {
  id: number;
  document_id: number;
  transaction_date: Date | string;
  posted_date: Date | string | null;
  description: string;
  payee: string;
  reference_text: string | null;
  category: string;
  direction: "credit" | "debit";
  amount: number | string;
  balance: number | string | null;
  currency_code: string;
  extraction_confidence: number | string;
  created_at: Date | string;
  source_file: string;
}

function toIsoDate(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function toIsoTimestamp(value: Date | string | null | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function buildObjectKey(fileName: string, userId?: string) {
  const safeUserId = String(userId || "guest").replace(/[^a-zA-Z0-9_-]/g, "");
  const safeFileName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");
  return `users/${safeUserId}/documents/${Date.now()}_${safeFileName}`;
}

function mapDocumentRow(row: DocumentRow): DocumentRecord {
  return {
    id: row.id,
    userId: row.user_id,
    fileName: row.file_name,
    fileType: row.file_type,
    fileSize: Number(row.file_size ?? 0),
    s3Key: row.s3_key,
    publicUrl: row.public_url,
    uploadedAt: toIsoTimestamp(row.uploaded_at),
    extractionStatus: row.extraction_status,
    extractionError: row.extraction_error,
    statementStartDate: toIsoDate(row.statement_start_date),
    statementEndDate: toIsoDate(row.statement_end_date),
    transactionCount: Number(row.transaction_count ?? 0),
  };
}

function mapTransactionRow(row: TransactionRow): TransactionRecord {
  return {
    id: row.id,
    documentId: row.document_id,
    sourceFile: row.source_file,
    transactionDate: toIsoDate(row.transaction_date) ?? new Date().toISOString().slice(0, 10),
    postedDate: toIsoDate(row.posted_date),
    description: row.description,
    payee: resolvePayeeName(row.payee, row.description),
    reference: row.reference_text,
    category: row.category || categorizeTransaction(row.description, row.direction),
    direction: row.direction,
    amount: Number(row.amount),
    balance: row.balance === null || row.balance === undefined ? null : Number(row.balance),
    currencyCode: row.currency_code || "INR",
    extractionConfidence: Number(row.extraction_confidence ?? 0),
    createdAt: toIsoTimestamp(row.created_at),
  };
}

async function listDocuments(userId: string) {
  const [rows] = await db.query<DocumentRow[]>(
    `
      SELECT
        d.*,
        COUNT(t.id) AS transaction_count
      FROM documents d
      LEFT JOIN transactions t ON t.document_id = d.id
      WHERE d.user_id = ?
      GROUP BY d.id
      ORDER BY d.uploaded_at DESC
    `,
    [userId],
  );

  return rows.map(mapDocumentRow);
}

async function listTransactions(userId: string) {
  const [rows] = await db.query<TransactionRow[]>(
    `
      SELECT
        t.*,
        d.file_name AS source_file
      FROM transactions t
      INNER JOIN documents d ON d.id = t.document_id
      WHERE t.user_id = ?
      ORDER BY t.transaction_date DESC, t.id DESC
    `,
    [userId],
  );

  return rows.map(mapTransactionRow);
}

usersRouter.get("/documents", async (req, res) => {
  const userId = String(req.query.userId || "guest");

  try {
    await ensureSchema();
    const documents = await listDocuments(userId);
    return res.status(200).json({ documents });
  } catch (error) {
    console.error("Documents list error:", error);
    return res.status(500).json({ message: "Failed to load uploaded documents." });
  }
});

usersRouter.delete("/documents/:documentId", async (req, res) => {
  const userId = String(req.query.userId || "guest");
  const documentId = Number(req.params.documentId);

  if (!Number.isFinite(documentId) || documentId <= 0) {
    return res.status(400).json({ message: "A valid document id is required." });
  }

  try {
    await ensureSchema();

    const [documentRows] = await db.query<DocumentRow[]>(
      `
        SELECT *
        FROM documents
        WHERE id = ? AND user_id = ?
        LIMIT 1
      `,
      [documentId, userId],
    );

    const document = documentRows[0];
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: document.s3_key,
        }),
      );
    } catch (s3Error) {
      console.error("S3 delete error:", s3Error);
    }

    await db.query(`DELETE FROM documents WHERE id = ? AND user_id = ?`, [documentId, userId]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Document delete error:", error);
    return res.status(500).json({ message: "Failed to delete uploaded document." });
  }
});

usersRouter.get("/documents/:documentId/export", async (req, res) => {
  const userId = String(req.query.userId || "guest");
  const documentId = Number(req.params.documentId);

  if (!Number.isFinite(documentId) || documentId <= 0) {
    return res.status(400).json({ message: "A valid document id is required." });
  }

  try {
    await ensureSchema();

    const [documentRows] = await db.query<DocumentRow[]>(
      `
        SELECT
          d.*, 
          COUNT(t.id) AS transaction_count
        FROM documents d
        LEFT JOIN transactions t ON t.document_id = d.id
        WHERE d.id = ? AND d.user_id = ?
        GROUP BY d.id
        LIMIT 1
      `,
      [documentId, userId],
    );

    const document = documentRows[0];
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    const [rows] = await db.query<TransactionRow[]>(
      `
        SELECT
          t.*, 
          d.file_name AS source_file
        FROM transactions t
        INNER JOIN documents d ON d.id = t.document_id
        WHERE t.user_id = ? AND t.document_id = ?
        ORDER BY t.transaction_date ASC, t.id ASC
      `,
      [userId, documentId],
    );

    const transactions = rows.map(mapTransactionRow);
    if (transactions.length === 0) {
      return res.status(404).json({ message: "No extracted transactions are available for this document yet." });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Agentica";
    workbook.company = "Agentica";
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.subject = "Structured statement export";
    workbook.title = `${document.file_name} structured export`;

    const incomeTotal = transactions
      .filter((transaction) => transaction.direction === "credit")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenseTotal = transactions
      .filter((transaction) => transaction.direction === "debit")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const netMovement = incomeTotal - expenseTotal;

    const summarySheet = workbook.addWorksheet("Summary", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    summarySheet.columns = [
      { header: "Metric", key: "metric", width: 28 },
      { header: "Value", key: "value", width: 24 },
    ];
    summarySheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    summarySheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F172A" },
    };
    summarySheet.addRows([
      { metric: "Source file", value: document.file_name },
      { metric: "Statement start date", value: document.statement_start_date ? toIsoDate(document.statement_start_date) : "" },
      { metric: "Statement end date", value: document.statement_end_date ? toIsoDate(document.statement_end_date) : "" },
      { metric: "Transactions extracted", value: transactions.length },
      { metric: "Total income", value: incomeTotal },
      { metric: "Total expense", value: expenseTotal },
      { metric: "Net movement", value: netMovement },
    ]);

    for (let rowIndex = 2; rowIndex <= summarySheet.rowCount; rowIndex += 1) {
      const valueCell = summarySheet.getCell(`B${rowIndex}`);
      if (typeof valueCell.value === "number") {
        valueCell.numFmt = "#,##0.00";
      }
    }

    const statementSheet = workbook.addWorksheet("Transactions", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    statementSheet.columns = [
      { header: "Transaction Date", key: "transactionDate", width: 16 },
      { header: "Posted Date", key: "postedDate", width: 16 },
      { header: "Description", key: "description", width: 38 },
      { header: "Payee", key: "payee", width: 28 },
      { header: "Reference", key: "reference", width: 22 },
      { header: "Category", key: "category", width: 18 },
      { header: "Direction", key: "direction", width: 14 },
      { header: "Amount", key: "amount", width: 16 },
      { header: "Balance", key: "balance", width: 16 },
      { header: "Currency", key: "currencyCode", width: 12 },
      { header: "Confidence", key: "extractionConfidence", width: 14 },
      { header: "Source File", key: "sourceFile", width: 28 },
    ];

    const headerRow = statementSheet.getRow(1);
    headerRow.height = 22;
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1D4ED8" },
    };
    headerRow.alignment = { vertical: "middle" };

    transactions.forEach((transaction) => {
      statementSheet.addRow({
        transactionDate: transaction.transactionDate,
        postedDate: transaction.postedDate ?? "",
        description: transaction.description,
        payee: transaction.payee,
        reference: transaction.reference ?? "",
        category: transaction.category,
        direction: transaction.direction,
        amount: transaction.amount,
        balance: transaction.balance ?? "",
        currencyCode: transaction.currencyCode,
        extractionConfidence: transaction.extractionConfidence / 100,
        sourceFile: transaction.sourceFile,
      });
    });

    statementSheet.getColumn("amount").numFmt = "#,##0.00";
    statementSheet.getColumn("balance").numFmt = "#,##0.00";
    statementSheet.getColumn("extractionConfidence").numFmt = "0.00%";
    statementSheet.autoFilter = {
      from: "A1",
      to: "L1",
    };

    statementSheet.eachRow((row, rowNumber) => {
      row.alignment = { vertical: "top", wrapText: true };

      if (rowNumber === 1) {
        return;
      }

      const directionCell = row.getCell("direction");
      const amountCell = row.getCell("amount");

      if (directionCell.value === "credit") {
        amountCell.font = { color: { argb: "FF047857" }, bold: true };
      } else if (directionCell.value === "debit") {
        amountCell.font = { color: { argb: "FFBE123C" }, bold: true };
      }
    });

    const downloadName = String(document.file_name || "statement")
      .replace(/\.pdf$/i, "")
      .replace(/[^\w.-]+/g, "_");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${downloadName}_structured.xlsx"`);
    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error("Document export error:", error);
    return res.status(500).json({ message: "Failed to export structured spreadsheet data." });
  }
});
usersRouter.get("/transactions", async (req, res) => {
  const userId = String(req.query.userId || "guest");

  try {
    await ensureSchema();
    const transactions = await listTransactions(userId);
    return res.status(200).json({ transactions });
  } catch (error) {
    console.error("Transactions list error:", error);
    return res.status(500).json({ message: "Failed to load transactions." });
  }
});

usersRouter.get("/dashboard", async (req, res) => {
  const userId = String(req.query.userId || "guest");

  try {
    await ensureSchema();
    const [documents, transactions] = await Promise.all([listDocuments(userId), listTransactions(userId)]);
    const metrics = buildMetrics(
      transactions,
      documents.filter((document) => document.extractionStatus === "completed").length,
      documents.filter((document) => document.extractionStatus === "processing").length,
    );

    const response: DashboardResponse = {
      metrics,
      monthlySeries: buildMonthlySeries(transactions),
      categoryBreakdown: buildCategoryBreakdown(transactions, "debit"),
      topPayees: buildPayeeBreakdown(transactions),
      payeeLedger: buildPayeeLedger(transactions),
      recentTransactions: transactions.slice(0, 8),
      upcomingRecurring: buildRecurringTransactions(transactions)
          .slice(0, 5)
          .map((item, index) => ({
          id: index + 1,
          documentId: 0,
          sourceFile: item.description,
          transactionDate: item.lastSeenAt,
          postedDate: null,
          description: item.description,
          payee: resolvePayeeName(item.description, item.description),
          reference: null,
          category: item.category,
          direction: "debit",
          amount: item.averageAmount,
          balance: null,
          currencyCode: "INR",
          extractionConfidence: 100,
          createdAt: new Date(item.lastSeenAt).toISOString(),
        })),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Dashboard load error:", error);
    return res.status(500).json({ message: "Failed to load dashboard data." });
  }
});

usersRouter.get("/analytics", async (req, res) => {
  const userId = String(req.query.userId || "guest");

  try {
    await ensureSchema();
    const [documents, transactions] = await Promise.all([listDocuments(userId), listTransactions(userId)]);
    const metrics = buildMetrics(
      transactions,
      documents.filter((document) => document.extractionStatus === "completed").length,
      documents.filter((document) => document.extractionStatus === "processing").length,
    );

    const documentComparison = documents.map((document) => {
      const documentTransactions = transactions.filter((transaction) => transaction.documentId === document.id);
      return {
        fileName: document.fileName,
        income: documentTransactions
          .filter((transaction) => transaction.direction === "credit")
          .reduce((sum, transaction) => sum + Number(transaction.amount), 0),
        expenses: documentTransactions
          .filter((transaction) => transaction.direction === "debit")
          .reduce((sum, transaction) => sum + Number(transaction.amount), 0),
        transactionCount: documentTransactions.length,
      };
    });

    const response: AnalyticsResponse = {
      metrics,
      monthlySeries: buildMonthlySeries(transactions),
      expenseCategories: buildCategoryBreakdown(transactions, "debit"),
      incomeCategories: buildCategoryBreakdown(transactions, "credit"),
      recurringTransactions: buildRecurringTransactions(transactions).slice(0, 10),
      payeeBreakdown: buildPayeeBreakdown(transactions),
      documentComparison,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Analytics load error:", error);
    return res.status(500).json({ message: "Failed to load analytics data." });
  }
});

usersRouter.get("/alerts", async (req, res) => {
  const userId = String(req.query.userId || "guest");

  try {
    await ensureSchema();
    const transactions = await listTransactions(userId);
    const response: AlertsResponse = {
      alerts: buildAlerts(transactions),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Alerts load error:", error);
    return res.status(500).json({ message: "Failed to load alerts." });
  }
});

usersRouter.post("/upload", async (req, res) => {
  const { fileName, fileType, userId, fileContentBase64, fileSize } = req.body;

  if (!fileName) {
    return res.status(400).json({ message: "File name is required." });
  }
  if (!fileContentBase64) {
    return res.status(400).json({ message: "File content is required." });
  }

  const safeUserId = String(userId || "guest");
  const normalizedType = String(fileType || "application/pdf");
  const extension = String(fileName).split(".").pop()?.toLowerCase() || "";

  if (normalizedType !== "application/pdf" && extension !== "pdf") {
    return res.status(400).json({ message: "Only PDF uploads are supported for Textract extraction." });
  }

  const key = buildObjectKey(String(fileName), safeUserId);

  try {
    await ensureSchema();

    const fileBuffer = Buffer.from(String(fileContentBase64), "base64");
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: normalizedType,
        Body: fileBuffer,
      }),
    );

    const encodedKey = key
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${encodedKey}`;

    const [documentInsert] = await db.query<ResultSetHeader>(
      `
        INSERT INTO documents (
          user_id,
          file_name,
          file_type,
          file_size,
          s3_key,
          public_url,
          extraction_status
        )
        VALUES (?, ?, ?, ?, ?, ?, 'processing')
      `,
      [safeUserId, String(fileName), normalizedType, Number(fileSize ?? fileBuffer.length), key, publicUrl],
    );

    const documentId = documentInsert.insertId;

    try {
      const extractedRows = await extractPdfTransactionsFromS3(key);

      if (extractedRows.length > 0) {
        const statementStartDate = extractedRows[0].transactionDate;
        const statementEndDate = extractedRows[extractedRows.length - 1].transactionDate;

        await db.query("DELETE FROM transactions WHERE document_id = ?", [documentId]);
        await db.query(
          `
            INSERT INTO transactions (
              document_id,
              user_id,
              transaction_date,
              posted_date,
              description,
              payee,
              reference_text,
              category,
              direction,
              amount,
              balance,
              currency_code,
              extraction_confidence,
              raw_row_json
            )
            VALUES ?
          `,
          [
            extractedRows.map((row) => [
              documentId,
              safeUserId,
              row.transactionDate,
              row.postedDate ?? null,
              row.description,
              row.payee,
              row.reference ?? null,
              row.category,
              row.direction,
              Number(row.amount),
              row.balance ?? null,
              row.currencyCode ?? "INR",
              Number(row.extractionConfidence ?? 0),
              JSON.stringify(row.rawRow ?? {}),
            ]),
          ],
        );

        await db.query(
          `
            UPDATE documents
            SET extraction_status = 'completed',
                extraction_error = NULL,
                statement_start_date = ?,
                statement_end_date = ?
            WHERE id = ?
          `,
          [statementStartDate, statementEndDate, documentId],
        );
      } else {
        throw new Error("No transactions were extracted from the uploaded PDF.");
      }
    } catch (textractError) {
      const message =
        textractError instanceof Error ? textractError.message : "Textract extraction failed unexpectedly.";

      await db.query(
        `
          UPDATE documents
          SET extraction_status = 'failed',
              extraction_error = ?
          WHERE id = ?
        `,
        [message, documentId],
      );

      return res.status(500).json({
        message,
        documentId,
        key,
        publicUrl,
      });
    }

    const documents = await listDocuments(safeUserId);
    const document = documents.find((entry) => entry.id === documentId) ?? null;

    return res.status(200).json({
      key,
      publicUrl,
      document,
    });
  } catch (error) {
    console.error("Upload pipeline error:", error);
    const detail = error instanceof Error ? error.message : "Failed to upload and extract PDF.";

    return res.status(500).json({
      message: detail,
      code: "UploadPipelineError",
    });
  }
});





