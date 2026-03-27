import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { AlertsResponse } from "@shared/api";
import { fetchAlerts } from "@/lib/finance-api";

const severityTone: Record<string, string> = {
  high: "border-rose-200 bg-rose-50 text-rose-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-sky-200 bg-sky-50 text-sky-700",
};

export default function Alerts() {
  const [data, setData] = useState<AlertsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        setData(await fetchAlerts());
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load alerts.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Alerts</h1>
        <p className="mt-1 text-slate-500">Anomalies and review prompts derived from the extracted SQL transaction set.</p>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading alerts...</p>}
      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {!isLoading && !error && data && (
        <div className="space-y-4">
          {data.alerts.length === 0 && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-5 w-5" />
                No alerts detected from the current extracted data.
              </div>
            </div>
          )}

          {data.alerts.map((alert) => (
            <div key={alert.id} className={`rounded-3xl border p-6 ${severityTone[alert.severity] || severityTone.low}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">{alert.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6">{alert.reason}</p>
                  <p className="mt-3 text-sm font-medium">Action: {alert.action}</p>
                </div>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  {alert.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
