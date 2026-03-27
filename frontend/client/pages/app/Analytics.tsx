import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarRange,
  ChevronDown,
  CircleDollarSign,
  Filter,
  PiggyBank,
  PieChart as PieChartIcon,
  Search,
  Sparkles,
  Table2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AnalyticsResponse, CategoryBreakdown, DashboardMetric, MonthlyPoint, TransactionRecord } from "@shared/api";
import { fetchAnalytics, fetchTransactions, formatMoney } from "@/lib/finance-api";
const COLORS = ["#0f766e", "#2563eb", "#ea580c", "#7c3aed", "#0891b2", "#dc2626", "#475569"];

type CategoryView = "pie" | "table";
type CategorySort = "amount" | "percentage" | "trend";
type CategoryRow = CategoryBreakdown & { trend: number };

function ToggleSwitch({
  value,
  onChange,
}: {
  value: CategoryView;
  onChange: (value: CategoryView) => void;
}) {
  const options: Array<{ value: CategoryView; label: string; icon: React.ReactNode }> = [
    { value: "pie", label: "Pie chart", icon: <PieChartIcon className="h-4 w-4" /> },
    { value: "table", label: "Table", icon: <Table2 className="h-4 w-4" /> },
  ];

  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-2 rounded-[14px] px-3 py-2 text-sm font-medium transition ${
              active ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function CategoryChart({ categories }: { categories: CategoryRow[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              dataKey="amount"
              nameKey="category"
              innerRadius={72}
              outerRadius={110}
              paddingAngle={3}
              label={({ percentage }) => `${Number(percentage).toFixed(0)}%`}
              labelLine={false}
            >
              {categories.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, _name, payload) => {
                const item = payload?.payload as CategoryRow | undefined;
                return [formatMoney(Number(value)), `${item?.category ?? "Category"} • ${item?.percentage.toFixed(1) ?? "0.0"}%`];
              }}
              contentStyle={{ borderRadius: 16, borderColor: "#e2e8f0" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:gap-3 lg:overflow-visible">
        {categories.map((item, index) => (
          <div key={item.category} className="min-w-[220px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm lg:min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <div>
                  <p className="font-medium text-slate-900">{item.category}</p>
                  <p className="text-xs text-slate-500">{item.percentage.toFixed(1)}% of expense mix</p>
                </div>
              </div>
              <span className="font-semibold text-slate-900">{formatMoney(item.amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryTable({
  categories,
  sortBy,
  onSortChange,
}: {
  categories: CategoryRow[];
  sortBy: CategorySort;
  onSortChange: (value: CategorySort) => void;
}) {
  const topCategory = categories[0]?.category;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-500">Technical view with sortable spending columns.</div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as CategorySort)}
            className="appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-9 text-sm text-slate-700 outline-none"
          >
            <option value="amount">Sort by amount</option>
            <option value="percentage">Sort by percentage</option>
            <option value="trend">Sort by trend</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-[640px] w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-right font-semibold">Amount</th>
              <th className="px-4 py-3 text-right font-semibold">Percentage</th>
              <th className="px-4 py-3 text-right font-semibold">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {categories.map((item, index) => (
              <tr key={item.category} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{item.category}</span>
                      {item.category === topCategory ? (
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                          Top spending
                        </span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900">{formatMoney(item.amount)}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-600">{item.percentage.toFixed(1)}%</td>
                <td className={`px-4 py-3 text-right font-medium tabular-nums ${item.trend > 0 ? "text-rose-600" : item.trend < 0 ? "text-emerald-600" : "text-slate-500"}`}>
                  {item.trend > 0 ? "↑" : item.trend < 0 ? "↓" : "-"} {Math.abs(item.trend).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
  action,
  className = "",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[28px] border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/60 sm:p-6 ${className}`}>
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  tone,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  tone: "green" | "red" | "blue";
}) {
  const styles = {
    green: {
      wrap: "from-emerald-50 to-white border-emerald-200/80",
      icon: "bg-emerald-100 text-emerald-700",
      value: "text-emerald-700",
    },
    red: {
      wrap: "from-rose-50 to-white border-rose-200/80",
      icon: "bg-rose-100 text-rose-700",
      value: "text-rose-700",
    },
    blue: {
      wrap: "from-sky-50 to-white border-sky-200/80",
      icon: "bg-sky-100 text-sky-700",
      value: "text-sky-700",
    },
  }[tone];

  return (
    <article className={`rounded-[24px] border bg-gradient-to-br p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles.wrap}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`mt-3 text-2xl font-semibold tracking-tight ${styles.value}`}>{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.icon}`}>{icon}</div>
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{subtitle}</p>
    </article>
  );
}

function InsightCard({
  title,
  text,
  tone = "neutral",
  icon,
}: {
  title: string;
  text: string;
  tone?: "neutral" | "warning" | "success";
  icon: React.ReactNode;
}) {
  const styles = {
    neutral: "border-slate-200 bg-slate-50/80",
    warning: "border-amber-200 bg-amber-50",
    success: "border-emerald-200 bg-emerald-50",
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 transition duration-200 hover:shadow-sm ${styles}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-slate-700">{icon}</div>
        <div>
          <p className="font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

function HealthScore({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const label = clamped >= 75 ? "Good" : clamped >= 50 ? "Average" : "Poor";
  const tone = clamped >= 75 ? "bg-emerald-500" : clamped >= 50 ? "bg-amber-500" : "bg-rose-500";
  const pill = clamped >= 75 ? "bg-emerald-100 text-emerald-700" : clamped >= 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Financial health score</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-4xl font-semibold tracking-tight text-slate-950">{clamped}</span>
            <span className="pb-1 text-sm text-slate-400">/100</span>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${pill}`}>{label}</span>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

function buildMonthDate(monthLabel: string) {
  const parsed = new Date(`${monthLabel} 01`);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function monthLabelFromDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function buildMetricsFromTransactions(transactions: TransactionRecord[], baseMetrics: DashboardMetric): DashboardMetric {
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
    ...baseMetrics,
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    latestBalance,
    transactionCount: transactions.length,
  };
}

function buildMonthlySeriesFromTransactions(transactions: TransactionRecord[]): MonthlyPoint[] {
  const grouped = new Map<string, MonthlyPoint>();
  const sorted = [...transactions].sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());

  for (const transaction of sorted) {
    const key = transaction.transactionDate.slice(0, 7);
    const current = grouped.get(key) ?? {
      month: monthLabelFromDate(transaction.transactionDate),
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

function buildCategoryBreakdownFromTransactions(
  transactions: TransactionRecord[],
  direction: "credit" | "debit",
): CategoryBreakdown[] {
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
    .map(([category, amount]) => {
      const latestAmount = latestMonthTotals.get(category) ?? 0;
      const previousAmount = previousMonthTotals.get(category) ?? 0;
      let trend = 0;

      if (previousAmount > 0) {
        trend = ((latestAmount - previousAmount) / previousAmount) * 100;
      } else if (latestAmount > 0) {
        trend = 100;
      }

      return {
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        direction,
        trend,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

function buildRecurringTransactionsFromTransactions(transactions: TransactionRecord[]) {
  const grouped = new Map<string, { description: string; category: string; amounts: number[]; lastSeenAt: string }>();

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
      averageAmount: entry.amounts.reduce((sum, value) => sum + value, 0) / Math.max(entry.amounts.length, 1),
      lastSeenAt: entry.lastSeenAt,
    }))
    .sort((a, b) => b.occurrences - a.occurrences || b.averageAmount - a.averageAmount);
}

function buildPayeeBreakdownFromTransactions(transactions: TransactionRecord[]) {
  const grouped = new Map<string, { payee: string; debit: number; credit: number; total: number; net: number; transactions: number; lastPaidAt: string }>();

  for (const transaction of transactions) {
    const payee = transaction.payee;
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

function buildDocumentComparisonFromTransactions(transactions: TransactionRecord[]) {
  const grouped = new Map<string, { fileName: string; income: number; expenses: number; transactionCount: number }>();

  for (const transaction of transactions) {
    const key = transaction.sourceFile || "Unknown source";
    const current = grouped.get(key) ?? {
      fileName: key,
      income: 0,
      expenses: 0,
      transactionCount: 0,
    };

    if (transaction.direction === "credit") {
      current.income += Number(transaction.amount);
    } else {
      current.expenses += Number(transaction.amount);
    }
    current.transactionCount += 1;
    grouped.set(key, current);
  }

  return Array.from(grouped.values()).sort((a, b) => b.transactionCount - a.transactionCount || b.expenses - a.expenses);
}

function composeFilteredAnalytics(base: AnalyticsResponse, transactions: TransactionRecord[]): AnalyticsResponse {
  return {
    metrics: buildMetricsFromTransactions(transactions, base.metrics),
    monthlySeries: buildMonthlySeriesFromTransactions(transactions),
    expenseCategories: buildCategoryBreakdownFromTransactions(transactions, "debit"),
    incomeCategories: buildCategoryBreakdownFromTransactions(transactions, "credit"),
    recurringTransactions: buildRecurringTransactionsFromTransactions(transactions).slice(0, 10),
    payeeBreakdown: buildPayeeBreakdownFromTransactions(transactions),
    documentComparison: buildDocumentComparisonFromTransactions(transactions),
  };
}
export default function Analytics() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryView, setCategoryView] = useState<CategoryView>("pie");
  const [categorySort, setCategorySort] = useState<CategorySort>("amount");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [analyticsResponse, transactionsResponse] = await Promise.all([fetchAnalytics(), fetchTransactions()]);
        setData(analyticsResponse);
        setTransactions(transactionsResponse.transactions);
        setFilteredData(null);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const analyticsView = filteredData ?? data;
  const hasDateFilter = Boolean(startDate || endDate);

  const applyFilter = () => {
    if (!data) {
      return;
    }

    if (!startDate && !endDate) {
      setFilteredData(null);
      return;
    }

    setIsApplyingFilter(true);

    const nextTransactions = transactions.filter((transaction) => {
      const afterStart = !startDate || transaction.transactionDate >= startDate;
      const beforeEnd = !endDate || transaction.transactionDate <= endDate;
      return afterStart && beforeEnd;
    });

    setFilteredData(composeFilteredAnalytics(data, nextTransactions));
    setIsApplyingFilter(false);
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(null);
  };

  const categoryBreakdownRows = useMemo<CategoryRow[]>(() => {
    if (!analyticsView) {
      return [];
    }

    return analyticsView.expenseCategories.map((item) => ({
      ...item,
      trend: Number(item.trend ?? 0),
    }));
  }, [analyticsView]);

  const sortedCategoryRows = useMemo(() => {
    const rows = [...categoryBreakdownRows];
    rows.sort((left, right) => {
      if (categorySort === "percentage") {
        return right.percentage - left.percentage;
      }
      if (categorySort === "trend") {
        return Math.abs(right.trend) - Math.abs(left.trend) || right.amount - left.amount;
      }
      return right.amount - left.amount;
    });
    return rows;
  }, [categoryBreakdownRows, categorySort]);

  const categoryInsights = useMemo(() => {
    const top = sortedCategoryRows[0];
    const trendLeader = [...sortedCategoryRows]
      .filter((item) => item.trend !== 0)
      .sort((left, right) => Math.abs(right.trend) - Math.abs(left.trend))[0];

    return [
      top ? `${top.category} accounts for the highest expense share at ${top.percentage.toFixed(1)}%.` : null,
      trendLeader
        ? `${trendLeader.category} expenses ${trendLeader.trend > 0 ? "increased" : "decreased"} by ${Math.abs(trendLeader.trend).toFixed(1)}% compared to last month.`
        : "Trend data is steady across the current visible category mix.",
    ].filter(Boolean) as string[];
  }, [sortedCategoryRows]);

  const topPayees = useMemo(() => analyticsView?.payeeBreakdown.slice(0, 8) ?? [], [analyticsView]);

  const totalIncome = analyticsView?.metrics.totalIncome ?? 0;
  const totalExpenses = analyticsView?.metrics.totalExpenses ?? 0;
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  const predictedNextExpense = useMemo(() => {
    const source = analyticsView?.monthlySeries ?? [];
    if (source.length === 0) {
      return 0;
    }

    const recent = source.slice(-3);
    const weighted = recent.reduce((sum, item, index) => sum + item.expenses * (index + 1), 0);
    const divisor = recent.reduce((sum, _, index) => sum + (index + 1), 0);
    return divisor > 0 ? weighted / divisor : 0;
  }, [analyticsView]);

  const healthScore = useMemo(() => {
    const savingsComponent = Math.max(0, Math.min(40, savingsRate));
    const recurringPenalty = Math.min(20, (analyticsView?.recurringTransactions.length ?? 0) * 1.5);
    const concentrationPenalty = Math.min(20, (topPayees[0]?.total ?? 0) > 0 && totalExpenses > 0 ? (topPayees[0].total / totalExpenses) * 20 : 0);
    const coverageBonus = totalIncome > totalExpenses ? 35 : 15;
    return coverageBonus + savingsComponent - recurringPenalty - concentrationPenalty + 25;
  }, [analyticsView, savingsRate, topPayees, totalExpenses, totalIncome]);

  const anomalyItems = useMemo(() => {
    return [...(analyticsView?.recurringTransactions ?? [])]
      .sort((a, b) => b.averageAmount - a.averageAmount || b.occurrences - a.occurrences)
      .slice(0, 3);
  }, [analyticsView]);

  const insights = useMemo(() => {
    if (!analyticsView) {
      return [] as Array<{ title: string; text: string; tone?: "neutral" | "warning" | "success"; icon: React.ReactNode }>;
    }

    const latest = analyticsView.monthlySeries[analyticsView.monthlySeries.length - 1];
    const previous = analyticsView.monthlySeries[analyticsView.monthlySeries.length - 2];
    const topCategory = analyticsView.expenseCategories[0];
    const topPayee = analyticsView.payeeBreakdown[0];
    const latestChange = latest && previous && previous.expenses > 0
      ? ((latest.expenses - previous.expenses) / previous.expenses) * 100
      : null;

    return [
      topCategory
        ? {
            title: "Expense concentration",
            text: `${topCategory.category} contributes ${topCategory.percentage.toFixed(1)}% of visible expenses.`,
            tone: "warning" as const,
            icon: <Filter className="h-4 w-4" />,
          }
        : null,
      latestChange !== null
        ? {
            title: "Month-over-month trend",
            text: `Expenses ${latestChange >= 0 ? "increased" : "decreased"} by ${Math.abs(latestChange).toFixed(1)}% in ${latest?.month}.`,
            tone: latestChange > 15 ? "warning" as const : "success" as const,
            icon: latestChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />,
          }
        : null,
      topPayee
        ? {
            title: "Most active payee",
            text: `${topPayee.payee} accounts for ${formatMoney(topPayee.total)} across ${topPayee.transactions} transactions.`,
            tone: "neutral" as const,
            icon: <Sparkles className="h-4 w-4" />,
          }
        : null,
    ].filter(Boolean) as Array<{ title: string; text: string; tone?: "neutral" | "warning" | "success"; icon: React.ReactNode }>;
  }, [analyticsView]);

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading analytics...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>;
  }

  if (!data) {
    return <div className="text-sm text-slate-500">No analytics available.</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-6 shadow-md shadow-slate-200/60 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Finance intelligence</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Analytics</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Executive-level visibility into spend mix, trends, recurring outflows, anomalies, and the projected path for next month.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Records analyzed</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{analyticsView?.metrics.transactionCount ?? 0}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/60 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">Date filter</h2>
            <p className="mt-1 text-sm text-slate-500">Apply a date range to refresh summary cards, charts, and insights across the full analytics page.</p>
          </div>
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Centralized filtering</div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr_auto_auto] xl:items-end">
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              <CalendarRange className="h-3.5 w-3.5" /> Start date
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            />
          </label>

          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              <CalendarRange className="h-3.5 w-3.5" /> End date
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            />
          </label>

          <button
            type="button"
            onClick={applyFilter}
            disabled={!hasDateFilter || isApplyingFilter}
            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isApplyingFilter ? 'Applying...' : 'Apply Filter'}
          </button>

          <button
            type="button"
            onClick={clearFilter}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Clear Filter
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {hasDateFilter
            ? `Showing results for selected date range${startDate ? ` from ${startDate}` : ''}${endDate ? ` to ${endDate}` : ''}.`
            : 'Showing analytics for all transactions.'}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Income" value={formatMoney(totalIncome)} subtitle="Incoming cash flow" icon={<ArrowUpRight className="h-5 w-5" />} tone="green" />
        <SummaryCard title="Total Expense" value={formatMoney(totalExpenses)} subtitle="Outgoing cash flow" icon={<ArrowDownRight className="h-5 w-5" />} tone="red" />
        <SummaryCard title="Net Savings" value={formatMoney(netSavings)} subtitle="Income minus expense" icon={<PiggyBank className="h-5 w-5" />} tone="blue" />
        <SummaryCard title="Savings Rate" value={`${savingsRate.toFixed(1)}%`} subtitle="Savings / income ratio" icon={<CircleDollarSign className="h-5 w-5" />} tone="blue" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <SectionCard title="Monthly trend" description="Income versus expense over time with a smooth, responsive trend view.">
          <div className="h-[320px] w-full sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsView?.monthlySeries ?? []} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatMoney(Number(value))} contentStyle={{ borderRadius: 16, borderColor: "#e2e8f0" }} />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#059669" fill="url(#incomeFill)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="expenses" stroke="#dc2626" fill="url(#expenseFill)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="net" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Financial health" description="A compact score combining savings rate, recurring burden, and concentration risk.">
          <div className="space-y-4">
            <HealthScore score={healthScore} />
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-sm font-medium text-slate-500">Predicted next month expense</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-sky-700">{formatMoney(predictedNextExpense)}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Weighted from the latest visible monthly expense trend, with more recent months counting more heavily.</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="Category breakdown"
          description="Category-wise expense mix with toggleable visualization for executive and technical analysis."
          action={<ToggleSwitch value={categoryView} onChange={setCategoryView} />}
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all duration-300">
              {categoryView === "pie" ? (
                <CategoryChart categories={sortedCategoryRows} />
              ) : (
                <CategoryTable categories={sortedCategoryRows} sortBy={categorySort} onSortChange={setCategorySort} />
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {categoryInsights.map((insight, index) => (
                <div key={`${index}-${insight}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <p className="font-medium text-slate-900">Insight {index + 1}</p>
                  <p className="mt-1 leading-6">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Anomaly detection" description="Flags recurring debit patterns that stand out by amount or frequency.">
          <div className="space-y-3">
            {anomalyItems.length === 0 && <p className="text-sm text-slate-500">No unusual recurring transactions found in the visible filters.</p>}
            {anomalyItems.map((item) => (
              <div key={`${item.description}-${item.lastSeenAt}`} className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-rose-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-slate-950"><AlertTriangle className="h-4 w-4 text-amber-600" /> {item.description}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.category} | Last seen {item.lastSeenAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-rose-700">{formatMoney(item.averageAmount)}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.occurrences} occurrences</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Time-based insights" description="Compact behavioral signals built from the currently visible analytics model." className="xl:col-span-1">
          <div className="space-y-3">
            {insights.map((insight) => (
              <InsightCard key={insight.title} title={insight.title} text={insight.text} tone={insight.tone} icon={insight.icon} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Payee concentration" description="Which payees account for the largest combined movement across visible results." className="xl:col-span-2">
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPayees} layout="vertical" margin={{ left: 12, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="payee" width={150} tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => formatMoney(Number(value))} contentStyle={{ borderRadius: 16, borderColor: "#e2e8f0" }} />
                  <Bar dataKey="total" radius={[10, 10, 10, 10]}>
                    {topPayees.map((entry, index) => (
                      <Cell key={entry.payee} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {topPayees.slice(0, 5).map((item) => (
                <div key={item.payee} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-white hover:shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">{item.payee}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.transactions} transactions</p>
                    </div>
                    <p className="font-semibold text-slate-900">{formatMoney(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <div>
        <SectionCard title="Upload comparison" description="Income, expense, and document activity compared across uploaded statements.">
          <div className="space-y-4">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsView?.documentComparison ?? []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="fileName" hide />
                  <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => formatMoney(Number(value))} contentStyle={{ borderRadius: 16, borderColor: "#e2e8f0" }} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {(analyticsView?.documentComparison ?? []).map((item) => (
                <div key={item.fileName} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition hover:bg-white hover:shadow-sm">
                  <div className="min-w-0 pr-4">
                    <p className="truncate font-medium text-slate-900">{item.fileName}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.transactionCount} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-700">{formatMoney(item.income)}</p>
                    <p className="text-xs text-rose-600">{formatMoney(item.expenses)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}












