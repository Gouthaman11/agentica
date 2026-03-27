import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { DashboardResponse } from "@shared/api";
import { fetchDashboard, formatMoney } from "@/lib/finance-api";

function StatCard({
  title,
  value,
  icon,
  tone = "default",
  badge,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  tone?: "default" | "success" | "danger";
  badge?: string;
}) {
  const valueClass = {
    default: "text-slate-950",
    success: "text-emerald-700",
    danger: "text-rose-700",
  }[tone];

  const iconClass = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-emerald-100 text-emerald-700",
    danger: "bg-rose-100 text-rose-700",
  }[tone];

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`mt-3 text-2xl font-semibold tracking-tight ${valueClass}`}>{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}>{icon}</div>
      </div>
      {badge ? <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{badge}</p> : null}
    </article>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        setData(await fetchDashboard());
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const latestMonth = useMemo(() => data?.monthlySeries[data.monthlySeries.length - 1] ?? null, [data]);
  const topPayees = useMemo(() => data?.topPayees.slice(0, 6) ?? [], [data]);
  const ledgerRows = useMemo(() => data?.payeeLedger.slice(0, 8) ?? [], [data]);
  const recentTransactions = useMemo(() => data?.recentTransactions.slice(0, 6) ?? [], [data]);

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>;
  }

  if (!data) {
    return <div className="text-sm text-slate-500">No dashboard data available.</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm shadow-slate-200/60 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Financial overview</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">Dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-base">
              A polished view of balance, monthly movement, payee activity, and the latest extracted transactions.
            </p>
          </div>
          <Link
            to="/enhanced/analytics"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            Open analytics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Closing balance"
          value={data.metrics.latestBalance === null ? "-" : formatMoney(data.metrics.latestBalance)}
          icon={<Wallet className="h-5 w-5" />}
          badge="Latest available balance"
        />
        <StatCard
          title="Credits"
          value={formatMoney(data.metrics.totalIncome)}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="success"
          badge="Total incoming amount"
        />
        <StatCard
          title="Debits"
          value={formatMoney(data.metrics.totalExpenses)}
          icon={<TrendingDown className="h-5 w-5" />}
          tone="danger"
          badge="Total outgoing amount"
        />
        <StatCard
          title="Net position"
          value={formatMoney(data.metrics.netBalance)}
          icon={<Wallet className="h-5 w-5" />}
          tone={data.metrics.netBalance >= 0 ? "success" : "danger"}
          badge={data.metrics.netBalance >= 0 ? "Positive cash movement" : "Negative cash movement"}
        />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        <article className="flex h-fit flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-semibold text-slate-950">Current period</h2>
            <p className="mt-1 text-sm text-slate-500">Latest extracted month and movement snapshot.</p>
          </div>

          {latestMonth ? (
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center">
                <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Reporting month</p>
                    <p className="mt-1 text-base font-semibold text-slate-950">{latestMonth.month}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm shadow-slate-200/70">
                    Current snapshot
                  </span>
                </div>
              </div>

              <div className="grid gap-2.5">
                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600">Credit</p>
                    <p className="mt-1 text-xs text-emerald-600/80">Incoming amount</p>
                  </div>
                  <p className="text-right text-lg font-semibold tabular-nums leading-tight text-emerald-700">{formatMoney(latestMonth.income)}</p>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-600">Debit</p>
                    <p className="mt-1 text-xs text-rose-600/80">Outgoing amount</p>
                  </div>
                  <p className="text-right text-lg font-semibold tabular-nums leading-tight text-rose-700">{formatMoney(latestMonth.expenses)}</p>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3.5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Net</p>
                    <p className="mt-1 text-xs text-slate-400">Closing movement</p>
                  </div>
                  <p className="text-right text-lg font-semibold tabular-nums leading-tight text-white">{formatMoney(latestMonth.net)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">No monthly summary yet.</p>
          )}
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Payee ledger</h2>
              <p className="mt-1 text-sm text-slate-500">Clear debit, credit, total, and net positions by payee.</p>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Responsive ledger view</span>
          </div>

          {ledgerRows.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              No payee ledger available yet.
            </p>
          ) : (
            <>
              <div className="mt-5 space-y-3 lg:hidden">
                {ledgerRows.map((entry) => (
                  <div key={entry.payee} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-950">{entry.payee}</p>
                        <p className="mt-1 text-xs text-slate-500">{entry.transactions} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Net</p>
                        <p className={`mt-1 font-semibold tabular-nums whitespace-nowrap ${entry.net >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                          {formatMoney(entry.net)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-500">Debit</p>
                        <p className="mt-1 font-semibold tabular-nums whitespace-nowrap text-rose-700">{entry.debit > 0 ? formatMoney(entry.debit) : "-"}</p>
                      </div>
                      <div className="rounded-xl bg-white px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-500">Credit</p>
                        <p className="mt-1 font-semibold tabular-nums whitespace-nowrap text-emerald-700">{entry.credit > 0 ? formatMoney(entry.credit) : "-"}</p>
                      </div>
                      <div className="rounded-xl bg-white px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Total</p>
                        <p className="mt-1 font-semibold tabular-nums whitespace-nowrap text-slate-800">{formatMoney(entry.total)}</p>
                      </div>
                      <div className="rounded-xl bg-white px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Position</p>
                        <p className={`mt-1 font-semibold tabular-nums whitespace-nowrap ${entry.net >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                          {entry.net >= 0 ? "Credit-led" : "Debit-led"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 hidden overflow-x-auto rounded-2xl border border-slate-200 lg:block">
                <table className="min-w-[760px] w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold">Payee</th>
                      <th className="px-4 py-3 text-right font-semibold">Debit</th>
                      <th className="px-4 py-3 text-right font-semibold">Credit</th>
                      <th className="px-4 py-3 text-right font-semibold">Total</th>
                      <th className="px-4 py-3 text-right font-semibold">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {ledgerRows.map((entry) => (
                      <tr key={entry.payee} className="align-middle hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="min-w-0">
                            <p className="max-w-[240px] truncate font-semibold text-slate-950">{entry.payee}</p>
                            <p className="mt-1 text-xs text-slate-500">{entry.transactions} transactions</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right font-medium tabular-nums whitespace-nowrap text-rose-700">
                          {entry.debit > 0 ? formatMoney(entry.debit) : "-"}
                        </td>
                        <td className="px-4 py-4 text-right font-medium tabular-nums whitespace-nowrap text-emerald-700">
                          {entry.credit > 0 ? formatMoney(entry.credit) : "-"}
                        </td>
                        <td className="px-4 py-4 text-right font-medium tabular-nums whitespace-nowrap text-slate-700">
                          {formatMoney(entry.total)}
                        </td>
                        <td className={`px-4 py-4 text-right font-semibold tabular-nums whitespace-nowrap ${entry.net >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                          {formatMoney(entry.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </article>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-2">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Top payees</h2>
              <p className="mt-1 text-sm text-slate-500">Highest combined movement with clean debit and credit split.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Top 6</span>
          </div>

          <div className="mt-5 space-y-3">
            {topPayees.length === 0 && <p className="text-sm text-slate-500">No payees available.</p>}
            {topPayees.map((payee) => (
              <div key={payee.payee} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{payee.payee}</p>
                    <p className="mt-1 text-xs text-slate-500">{payee.transactions} payments recorded</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl font-semibold tracking-tight text-slate-950">{formatMoney(payee.total)}</p>
                    <p className="mt-1 text-xs text-slate-500">Net {formatMoney(payee.net)}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-500">Debit</p>
                    <p className="mt-1 font-semibold tabular-nums text-rose-700">{formatMoney(payee.debit)}</p>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-500">Credit</p>
                    <p className="mt-1 font-semibold tabular-nums text-emerald-700">{formatMoney(payee.credit)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Recent activity</h2>
              <p className="mt-1 text-sm text-slate-500">Latest extracted transactions with clearer spacing and amounts.</p>
            </div>
            <Link
              to="/enhanced/transactions"
              className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition hover:text-sky-800"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentTransactions.length === 0 && <p className="text-sm text-slate-500">No recent transactions yet.</p>}
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">{transaction.payee}</p>
                  <p className="mt-1 text-xs text-slate-500">{transaction.transactionDate} • {transaction.category}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold tabular-nums ${transaction.direction === "credit" ? "text-emerald-700" : "text-rose-700"}`}>
                    {transaction.direction === "credit" ? "+" : "-"}{formatMoney(transaction.amount)}
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">{transaction.direction}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}






