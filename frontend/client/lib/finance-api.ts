import {
  AlertsResponse,
  AnalyticsResponse,
  DashboardResponse,
  DocumentRecord,
  TransactionRecord,
} from "@shared/api";

function getApiBase() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
}

export function buildUserId() {
  return (
    localStorage.getItem("user_username") ||
    localStorage.getItem("user_email") ||
    localStorage.getItem("user_id") ||
    "guest"
  );
}

export function getCurrencySymbol() {
  return localStorage.getItem("user_currency") || "INR";
}

export function formatMoney(value: number, currency = getCurrencySymbol()) {
  return `${currency} ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBase()}${path}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || `Request failed with HTTP ${response.status}.`);
  }

  return payload as T;
}

export function fetchDocuments() {
  return fetchJson<{ documents: DocumentRecord[] }>(
    `/api/users/documents?userId=${encodeURIComponent(buildUserId())}`,
  );
}

export async function deleteDocument(documentId: number) {
  const response = await fetch(
    `${getApiBase()}/api/users/documents/${documentId}?userId=${encodeURIComponent(buildUserId())}`,
    {
      method: "DELETE",
    },
  );
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || `Request failed with HTTP ${response.status}.`);
  }

  return payload as { success: true };
}

export function fetchTransactions() {
  return fetchJson<{ transactions: TransactionRecord[] }>(
    `/api/users/transactions?userId=${encodeURIComponent(buildUserId())}`,
  );
}

export function fetchDashboard() {
  return fetchJson<DashboardResponse>(`/api/users/dashboard?userId=${encodeURIComponent(buildUserId())}`);
}

export function fetchAnalytics() {
  return fetchJson<AnalyticsResponse>(`/api/users/analytics?userId=${encodeURIComponent(buildUserId())}`);
}

export function fetchAlerts() {
  return fetchJson<AlertsResponse>(`/api/users/alerts?userId=${encodeURIComponent(buildUserId())}`);
}
