import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { TransactionRecord } from "@shared/api";
import { fetchTransactions, formatMoney } from "@/lib/finance-api";

export default function Transactions() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTransactions();
        setTransactions(response.transactions);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(transactions.map((transaction) => transaction.category)))],
    [transactions],
  );

  const filtered = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        search.trim() === "" ||
        `${transaction.description} ${transaction.category} ${transaction.sourceFile}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesDirection = direction === "all" || transaction.direction === direction;
      const matchesCategory = category === "all" || transaction.category === category;
      return matchesSearch && matchesDirection && matchesCategory;
    });
  }, [transactions, search, direction, category]);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Transactions</h1>
        <p className="mt-1 text-slate-500">Every row below comes from the extracted PDF data stored in SQL.</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 md:grid-cols-[1.6fr_0.7fr_0.7fr]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search description, category, or source file"
            className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <select
          value={direction}
          onChange={(event) => setDirection(event.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
        >
          <option value="all">All directions</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All categories" : item}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading transactions...</p>}
      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {!isLoading && !error && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4 text-sm text-slate-500">
            {filtered.length} transaction{filtered.length === 1 ? "" : "s"} matched
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Source PDF</th>
                  <th className="px-5 py-3 font-medium">Confidence</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-slate-200">
                    <td className="px-5 py-4 text-slate-600">{transaction.transactionDate}</td>
                    <td className="px-5 py-4 font-medium text-slate-900">{transaction.description}</td>
                    <td className="px-5 py-4 text-slate-600">{transaction.category}</td>
                    <td className="px-5 py-4 text-slate-600">{transaction.sourceFile}</td>
                    <td className="px-5 py-4 text-slate-600">{transaction.extractionConfidence.toFixed(0)}%</td>
                    <td className={`px-5 py-4 text-right font-semibold ${transaction.direction === "credit" ? "text-emerald-700" : "text-rose-700"}`}>
                      {transaction.direction === "credit" ? "+" : "-"}{formatMoney(transaction.amount)}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-600">
                      {transaction.balance === null ? "-" : formatMoney(transaction.balance)}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                      No extracted transactions matched the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
