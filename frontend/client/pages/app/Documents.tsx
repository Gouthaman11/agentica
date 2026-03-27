import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, FileText, Loader2, ShieldCheck, Trash2, UploadCloud } from "lucide-react";

import { DocumentRecord } from "@shared/api";
import { buildUserId, deleteDocument, fetchDocuments } from "@/lib/finance-api";

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary);
}

const statusTone: Record<DocumentRecord["extractionStatus"], string> = {
  uploaded: "text-slate-600 bg-slate-100",
  processing: "text-amber-700 bg-amber-100",
  completed: "text-emerald-700 bg-emerald-100",
  failed: "text-rose-700 bg-rose-100",
};

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processedCount = useMemo(
    () => documents.filter((document) => document.extractionStatus === "completed").length,
    [documents],
  );

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetchDocuments();
      setDocuments(response.documents);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load uploaded documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDocuments();
  }, []);

  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const userId = buildUserId();

  const handleUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file. The backend now extracts directly from PDFs using Textract.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const payload = {
        fileName: file.name,
        fileType: file.type || "application/pdf",
        userId: buildUserId(),
        fileSize: file.size,
        fileContentBase64: await fileToBase64(file),
      };

      const response = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}/api/users/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "The PDF upload or extraction request failed.");
      }

      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The PDF upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (document: DocumentRecord) => {
    const confirmed = window.confirm(`Delete "${document.fileName}" and its extracted transactions?`);
    if (!confirmed) {
      return;
    }

    setDeletingId(document.id);
    setError("");

    try {
      await deleteDocument(document.id);
      setDocuments((current) => current.filter((entry) => entry.id !== document.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete the uploaded document.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Documents</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Upload real bank-statement PDFs, extract transactions with Textract, and store the results in SQL.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          {processedCount} processed
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(event) => {
          void handleUpload(event.target.files);
        }}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center transition hover:border-slate-400 hover:bg-white"
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-700">
          {isUploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {isUploading ? "Uploading and extracting..." : "Upload a statement PDF"}
          </p>
          <p className="text-sm text-slate-500">The extracted transactions are written straight into MySQL.</p>
        </div>
      </button>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="rounded-3xl border border-slate-200 bg-white/80">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Uploaded PDFs</h2>
        </div>
        <div className="space-y-3 p-4">
          {isLoading && <p className="text-sm text-slate-500">Loading uploaded PDFs...</p>}
          {!isLoading && documents.length === 0 && (
            <p className="text-sm text-slate-500">No PDFs uploaded yet.</p>
          )}
          {documents.map((document) => (
            <div
              key={document.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <p className="truncate font-semibold text-slate-900">{document.fileName}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Uploaded {new Date(document.uploadedAt).toLocaleString()} • {formatSize(document.fileSize)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Transactions extracted: {document.transactionCount}
                    {document.statementStartDate && document.statementEndDate
                      ? ` • Statement window ${document.statementStartDate} to ${document.statementEndDate}`
                      : ""}
                  </p>
                  {document.extractionError && (
                    <p className="mt-2 text-sm text-rose-600">{document.extractionError}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <a
                      href={document.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-sm font-medium text-sky-700 hover:underline"
                    >
                      Open uploaded PDF
                    </a>
                    {document.extractionStatus === "completed" && document.transactionCount > 0 && (
                      <a
                        href={`${apiBase}/api/users/documents/${document.id}/export?userId=${encodeURIComponent(userId)}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline"
                      >
                        <Download className="h-4 w-4" />
                        Download structured spreadsheet
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        void handleDelete(document);
                      }}
                      disabled={deletingId === document.id}
                      className="inline-flex items-center gap-2 text-sm font-medium text-rose-700 transition hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === document.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete file
                    </button>
                  </div>
                </div>
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone[document.extractionStatus]}`}
                >
                  {document.extractionStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




