import { AlertRecord, CategoryBreakdown, DashboardMetric, MonthlyPoint, TransactionRecord } from "@shared/api";

export interface ExtractedTransactionInput {
  transactionDate: string;
  postedDate?: string | null;
  description: string;
  payee: string;
  reference?: string | null;
  category: string;
  amount: number;
  balance?: number | null;
  direction: "credit" | "debit";
  currencyCode?: string;
  extractionConfidence?: number;
  rawRow?: Record<string, unknown>;
}

export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function parseAmount(value: string) {
  const normalized = value.replace(/[,\s]/g, "");
  const cleaned = normalized.replace(/[^\d().-]/g, "");

  if (!cleaned) {
    return null;
  }

  const isNegative = cleaned.startsWith("(") && cleaned.endsWith(")");
  const numeric = Number(cleaned.replace(/[()]/g, ""));
  if (!Number.isFinite(numeric)) {
    return null;
  }

  return isNegative ? -numeric : numeric;
}

export function parseDate(value: string) {
  const normalized = normalizeWhitespace(value)
    .replace(/(\d)(st|nd|rd|th)\b/gi, "$1")
    .replace(/\./g, "/");

  const patterns = [
    /^\d{4}-\d{2}-\d{2}$/,
    /^\d{2}\/\d{2}\/\d{4}$/,
    /^\d{2}-\d{2}-\d{4}$/,
    /^\d{2} [A-Za-z]{3} \d{4}$/,
    /^\d{2} [A-Za-z]+ \d{4}$/,
    /^[A-Za-z]{3} \d{2}, \d{4}$/,
    /^[A-Za-z]+ \d{2}, \d{4}$/,
  ];

  const matched = patterns.some((pattern) => pattern.test(normalized));
  if (!matched) {
    return null;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

export function categorizeTransaction(description: string, direction: "credit" | "debit") {
  const value = description.toLowerCase();

  if (direction === "credit") {
    if (/salary|payroll|bonus|invoice|payout|deposit|refund|interest/.test(value)) {
      return "Income";
    }

    return "Credit";
  }

  if (/rent|lease|maintenance|electric|water|gas|internet|broadband|utility/.test(value)) {
    return "Rent & Utilities";
  }
  if (/swiggy|zomato|restaurant|cafe|coffee|food|dining|uber eats/.test(value)) {
    return "Food & Dining";
  }
  if (/netflix|spotify|prime|youtube|github|figma|adobe|notion|aws|google workspace|office 365|subscription/.test(value)) {
    return "Software Subs";
  }
  if (/uber|ola|fuel|petrol|diesel|flight|train|travel|hotel/.test(value)) {
    return "Travel";
  }
  if (/atm|cash/.test(value)) {
    return "Cash";
  }
  if (/insurance|tax|gst|emi|loan/.test(value)) {
    return "Financial Obligations";
  }
  if (/pharmacy|hospital|medical|health/.test(value)) {
    return "Health";
  }
  if (/amazon|flipkart|myntra|shopping|store/.test(value)) {
    return "Shopping";
  }

  return "Other";
}

export function extractPayee(description: string) {
  const normalized = normalizeWhitespace(description);
  const slashTokens = normalized
    .split("/")
    .map((part) => normalizeWhitespace(part))
    .filter(Boolean);

  const tokenCandidate = slashTokens.find((part) => isLikelyPayeeToken(part));
  if (tokenCandidate) {
    return normalizePayeeName(tokenCandidate);
  }

  const cleaned = normalized
    .replace(/[*#:_\\-]+/g, " ")
    .replace(/\b(?:upi|imps|neft|rtgs|card|pos|debit|credit|txn|ref|utr|transfer|payment|purchase|paid|to|by|via|from|bank|branch|atm|service|online|core|banking|data|centre)\b/gi, " ")
    .replace(/\b\d+\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return normalizePayeeName(description);
  }

  const preferredPatterns = [
    /(?:to|paid to|payment to)\s+([a-z][a-z0-9&.' ]{2,})/i,
    /(?:from|received from|transfer from)\s+([a-z][a-z0-9&.' ]{2,})/i,
    /(?:upi)\s+([a-z][a-z0-9&.' ]{2,})/i,
    /([a-z][a-z0-9&.' ]{2,})\s+(?:store|market|services|solutions|foods|restaurant|cafe|mart)\b/i,
  ];

  for (const pattern of preferredPatterns) {
    const matched = description.match(pattern)?.[1];
    if (matched) {
      return normalizePayeeName(matched);
    }
  }

  return normalizePayeeName(cleaned);
}

function isLikelyPayeeToken(value: string) {
  const compact = value.trim();
  if (compact.length < 3 || compact.length > 60) {
    return false;
  }

  if (!/[a-z]/i.test(compact)) {
    return false;
  }

  if (/@|^\d+$|[0-9]{4,}/.test(compact)) {
    return false;
  }

  if (/\b(?:upi|branch|atm|service|bank|payment|transfer|online|core|banking|data|centre|from phonepe|from gpay)\b/i.test(compact)) {
    return false;
  }

  return true;
}

function normalizePayeeName(value: string) {
  const compact = normalizeWhitespace(value)
    .replace(/\b(?:ltd|limited|pvt|private|inc|llp|co|company)\b/gi, "")
    .replace(/\b(?:mr|mrs|ms|miss|dr)\b\.?/gi, "")
    .replace(/[^\p{L}\p{N}&.' ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!compact) {
    return "Unknown Payee";
  }

  return compact
    .toLowerCase()
    .split(" ")
    .slice(0, 4)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function resolvePayeeName(payee: string | null | undefined, description: string) {
  const normalizedPayee = normalizeWhitespace(payee ?? "");
  if (normalizedPayee && !/^unknown payee$/i.test(normalizedPayee)) {
    return normalizePayeeName(normalizedPayee);
  }

  const extracted = extractPayee(description);
  if (!/^unknown payee$/i.test(extracted)) {
    return extracted;
  }

  return normalizePayeeName(description);
}

function monthLabel(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function buildMetrics(transactions: TransactionRecord[], documentsProcessed: number, pendingDocuments: number): DashboardMetric {
  const totalIncome = transactions
    .filter((entry) => entry.direction === "credit")
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  const totalExpenses = transactions
    .filter((entry) => entry.direction === "debit")
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  const latestBalance = [...transactions]
    .filter((entry) => entry.balance !== null && entry.balance !== undefined)
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())[0]?.balance ?? null;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    latestBalance,
    transactionCount: transactions.length,
    documentsProcessed,
    pendingDocuments,
  };
}

export function buildMonthlySeries(transactions: TransactionRecord[]) {
  const grouped = new Map<string, MonthlyPoint>();

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime(),
  );

  for (const transaction of sorted) {
    const key = transaction.transactionDate.slice(0, 7);
    const current = grouped.get(key) ?? {
      month: monthLabel(transaction.transactionDate),
      income: 0,
      expenses: 0,
      net: 0,
      closingBalance: null,
    };

    if (transaction.direction === "credit") {
      current.income += Number(transaction.amount);
    } else {
      current.expenses += Number(transaction.amount);
    }

    current.net = current.income - current.expenses;
    if (transaction.balance !== null && transaction.balance !== undefined) {
      current.closingBalance = Number(transaction.balance);
    }

    grouped.set(key, current);
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => value);
}

export function buildCategoryBreakdown(transactions: TransactionRecord[], direction: "credit" | "debit"): CategoryBreakdown[] {
  const relevant = transactions.filter((entry) => entry.direction === direction);
  const total = relevant.reduce((sum, entry) => sum + Number(entry.amount), 0);
  const grouped = new Map<string, number>();
  const monthlyCategoryTotals = new Map<string, Map<string, number>>();

  for (const transaction of relevant) {
    const amount = Number(transaction.amount);
    grouped.set(transaction.category, (grouped.get(transaction.category) ?? 0) + amount);

    const monthKey = transaction.transactionDate.slice(0, 7);
    const monthBucket = monthlyCategoryTotals.get(monthKey) ?? new Map<string, number>();
    monthBucket.set(transaction.category, (monthBucket.get(transaction.category) ?? 0) + amount);
    monthlyCategoryTotals.set(monthKey, monthBucket);
  }

  const monthKeys = Array.from(monthlyCategoryTotals.keys()).sort((left, right) => left.localeCompare(right));
  const latestMonthTotals = monthKeys.length > 0 ? monthlyCategoryTotals.get(monthKeys[monthKeys.length - 1]) ?? new Map<string, number>() : new Map<string, number>();
  const previousMonthTotals = monthKeys.length > 1 ? monthlyCategoryTotals.get(monthKeys[monthKeys.length - 2]) ?? new Map<string, number>() : new Map<string, number>();

  return Array.from(grouped.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      direction,
      trend: (() => {
        const latestAmount = latestMonthTotals.get(category) ?? 0;
        const previousAmount = previousMonthTotals.get(category) ?? 0;

        if (previousAmount > 0) {
          return ((latestAmount - previousAmount) / previousAmount) * 100;
        }

        if (latestAmount > 0) {
          return 100;
        }

        return 0;
      })(),
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildRecurringTransactions(transactions: TransactionRecord[]) {
  const grouped = new Map<
    string,
    { description: string; category: string; amounts: number[]; lastSeenAt: string }
  >();

  for (const transaction of transactions.filter((entry) => entry.direction === "debit")) {
    const key = `${transaction.description.toLowerCase()}::${transaction.category}`;
    const current = grouped.get(key) ?? {
      description: transaction.description,
      category: transaction.category,
      amounts: [],
      lastSeenAt: transaction.transactionDate,
    };

    current.amounts.push(Number(transaction.amount));
    if (transaction.transactionDate > current.lastSeenAt) {
      current.lastSeenAt = transaction.transactionDate;
    }

    grouped.set(key, current);
  }

  return Array.from(grouped.values())
    .filter((entry) => entry.amounts.length > 1)
    .map((entry) => ({
      description: entry.description,
      category: entry.category,
      occurrences: entry.amounts.length,
      averageAmount:
        entry.amounts.reduce((sum, value) => sum + value, 0) / Math.max(entry.amounts.length, 1),
      lastSeenAt: entry.lastSeenAt,
    }))
    .sort((a, b) => b.occurrences - a.occurrences || b.averageAmount - a.averageAmount);
}

export function buildPayeeBreakdown(transactions: TransactionRecord[]) {
  const grouped = new Map<
    string,
    { payee: string; debit: number; credit: number; total: number; net: number; transactions: number; lastPaidAt: string }
  >();

  for (const transaction of transactions) {
    const payee = resolvePayeeName(transaction.payee, transaction.description);
    const current = grouped.get(payee) ?? {
      payee,
      debit: 0,
      credit: 0,
      total: 0,
      net: 0,
      transactions: 0,
      lastPaidAt: transaction.transactionDate,
    };

    if (transaction.direction === "debit") {
      current.debit += Number(transaction.amount);
      if (transaction.transactionDate > current.lastPaidAt) {
        current.lastPaidAt = transaction.transactionDate;
      }
    } else {
      current.credit += Number(transaction.amount);
    }

    current.total = current.debit + current.credit;
    current.net = current.credit - current.debit;
    current.transactions += 1;
    grouped.set(payee, current);
  }

  return Array.from(grouped.values())
    .map((entry) => ({
      ...entry,
      averageDebit: entry.debit / Math.max(entry.transactions, 1),
    }))
    .sort((a, b) => b.total - a.total || Math.abs(b.net) - Math.abs(a.net));
}

export function buildPayeeLedger(transactions: TransactionRecord[]) {
  const grouped = new Map<
    string,
    { payee: string; debit: number; credit: number; total: number; net: number; transactions: number }
  >();

  for (const transaction of transactions) {
    const payee = resolvePayeeName(transaction.payee, transaction.description);
    const current = grouped.get(payee) ?? {
      payee,
      debit: 0,
      credit: 0,
      total: 0,
      net: 0,
      transactions: 0,
    };

    if (transaction.direction === "debit") {
      current.debit += Number(transaction.amount);
    } else {
      current.credit += Number(transaction.amount);
    }

    current.total = current.debit + current.credit;
    current.net = current.credit - current.debit;
    current.transactions += 1;
    grouped.set(payee, current);
  }

  return Array.from(grouped.values()).sort((a, b) => Math.abs(b.net) - Math.abs(a.net) || b.debit - a.debit);
}

export function buildAlerts(transactions: TransactionRecord[]): AlertRecord[] {
  const alerts: AlertRecord[] = [];
  const monthly = buildMonthlySeries(transactions);

  if (monthly.length >= 2) {
    const latest = monthly[monthly.length - 1];
    const previous = monthly[monthly.length - 2];
    if (previous.expenses > 0) {
      const change = ((latest.expenses - previous.expenses) / previous.expenses) * 100;
      if (change >= 25) {
        alerts.push({
          id: "expense-spike",
          severity: change >= 50 ? "high" : "medium",
          title: "Expense spike detected",
          reason: `Expenses increased by ${change.toFixed(1)}% in ${latest.month} compared with ${previous.month}.`,
          action: "Review the latest debits and confirm whether the higher outflow is expected.",
        });
      }
    }
  }

  const duplicates = new Map<string, TransactionRecord[]>();
  for (const transaction of transactions) {
    const key = [
      transaction.transactionDate,
      transaction.direction,
      transaction.amount.toFixed(2),
      transaction.description.toLowerCase(),
    ].join("::");

    const bucket = duplicates.get(key) ?? [];
    bucket.push(transaction);
    duplicates.set(key, bucket);
  }

  const duplicateGroup = Array.from(duplicates.values()).find((group) => group.length > 1);
  if (duplicateGroup) {
    const entry = duplicateGroup[0];
    alerts.push({
      id: "duplicate-transaction",
      severity: "medium",
      title: "Possible duplicate transaction",
      reason: `Multiple ${entry.direction} entries with the same amount and description were found on ${entry.transactionDate}.`,
      action: "Cross-check the statement and contact your bank if one of the charges should not be there.",
    });
  }

  const largestDebit = transactions
    .filter((entry) => entry.direction === "debit")
    .sort((a, b) => Number(b.amount) - Number(a.amount))[0];

  if (largestDebit) {
    alerts.push({
      id: "largest-debit",
      severity: "low",
      title: "Largest debit this period",
      reason: `${largestDebit.description} is the biggest debit at ${largestDebit.amount.toFixed(2)} on ${largestDebit.transactionDate}.`,
      action: "Use this as a quick review point when validating high-value expenses.",
    });
  }

  return alerts;
}
