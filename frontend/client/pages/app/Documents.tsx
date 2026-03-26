import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

type UploadStatus = "uploading" | "uploaded" | "error";

type UploadedDocument = {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  status: UploadStatus;
  s3Key?: string;
  s3Url?: string;
  error?: string;
};

type ListedDocument = {
  key: string;
  name?: string;
  size?: number;
  lastModified?: string | null;
  publicUrl: string;
};

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

async function readResponsePayload(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!rawText) {
    return { json: null as Record<string, unknown> | null, text: "" };
  }

  if (contentType.includes("application/json")) {
    try {
      return { json: JSON.parse(rawText) as Record<string, unknown>, text: rawText };
    } catch {
      return { json: null, text: rawText };
    }
  }

  return { json: null, text: rawText };
}

async function fileToBase64(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function buildUserId() {
  return localStorage.getItem("user_username") || localStorage.getItem("user_email") || "guest";
}

function mapListedDocument(doc: ListedDocument): UploadedDocument {
  const extension = doc.name?.split(".").pop()?.toUpperCase() || "FILE";
  const date = doc.lastModified
    ? new Date(doc.lastModified).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  return {
    id: doc.key,
    name: doc.name || doc.key.split("/").pop() || "Uploaded file",
    size: formatSize(doc.size || 0),
    type: extension,
    date,
    status: "uploaded",
    s3Key: doc.key,
    s3Url: doc.publicUrl,
  };
}

export default function Documents() {
  const [docs, setDocs] = useState<UploadedDocument[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoadingDocs(true);
      setUploadError("");

      try {
        const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
        const userId = buildUserId();
        const response = await fetch(
          `${apiBase}/api/users/documents?userId=${encodeURIComponent(userId)}`,
        );
        const { json, text } = await readResponsePayload(response);

        if (!response.ok) {
          throw new Error(
            (json?.message as string | undefined) ||
              text ||
              `Failed to load documents (HTTP ${response.status}).`,
          );
        }

        const documents = Array.isArray(json?.documents)
          ? (json.documents as ListedDocument[])
          : [];

        setDocs(documents.map(mapListedDocument));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load documents.";
        setUploadError(message);
      } finally {
        setIsLoadingDocs(false);
      }
    };

    void loadDocuments();
  }, []);

  const uploadToS3 = async (file: File) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const baseDoc: UploadedDocument = {
      id,
      name: file.name,
      size: formatSize(file.size),
      type: file.name.split(".").pop()?.toUpperCase() || "FILE",
      date: new Date().toISOString().split("T")[0],
      status: "uploading",
    };

    setDocs((prev) => [baseDoc, ...prev]);
    setUploadError("");

    try {
      const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
      const userId = buildUserId();
      const fileContentBase64 = await fileToBase64(file);

      const uploadRes = await fetch(`${apiBase}/api/users/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          userId,
          fileContentBase64,
        }),
      });

      const { json: uploadData, text: uploadText } = await readResponsePayload(uploadRes);

      if (!uploadRes.ok) {
        const message =
          (uploadData?.message as string | undefined) ||
          uploadText ||
          `Upload failed (HTTP ${uploadRes.status}).`;
        throw new Error(message);
      }

      if (!uploadData?.publicUrl || !uploadData?.key) {
        throw new Error("Upload response is incomplete. Check backend /api/users/upload.");
      }

      setDocs((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: "uploaded",
                s3Key: String(uploadData.key),
                s3Url: String(uploadData.publicUrl),
              }
            : d,
        ),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setDocs((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "error", error: message } : d)),
      );
      setUploadError(message);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const allowed = ["pdf", "csv", "txt", "xlsx", "xls", "doc", "docx"];
    const selected = Array.from(files).filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() || "";
      return allowed.includes(ext);
    });

    for (const file of selected) {
      await uploadToS3(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Documents</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Upload PDFs and files directly to AWS S3 through the backend.
          </p>
        </div>
        <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4 mr-1" />
          S3 upload enabled
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept=".pdf,.csv,.txt,.xlsx,.xls,.doc,.docx"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/60 dark:bg-slate-900/60 p-8 text-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          void handleFiles(e.dataTransfer.files);
        }}
      >
        <div className={`mx-auto mb-3 w-14 h-14 rounded-full grid place-items-center ${dragActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-indigo-600"}`}>
          <UploadCloud className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Drop files here or click to upload</h3>
        <p className="text-sm text-slate-500 mt-1">PDF, CSV, TXT, XLSX, XLS, DOC, DOCX</p>
      </motion.div>

      {uploadError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Upload error: {uploadError}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white/70 dark:bg-slate-900/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/70 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Uploaded Files ({docs.length})</h2>
        </div>

        <div className="p-4 space-y-3 max-h-[480px] overflow-y-auto">
          {isLoadingDocs && <p className="text-sm text-slate-500">Loading uploaded files...</p>}
          {!isLoadingDocs && docs.length === 0 && (
            <p className="text-sm text-slate-500">No files uploaded yet.</p>
          )}

          {docs.map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-slate-800/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{doc.name}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{doc.type} - {doc.size} - {doc.date}</p>

                  {doc.status === "uploaded" && doc.s3Url && (
                    <a
                      href={doc.s3Url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline mt-2"
                    >
                      Open S3 Object <Download className="w-3 h-3" />
                    </a>
                  )}

                  {doc.status === "error" && (
                    <p className="text-xs text-rose-600 mt-2">{doc.error || "Upload failed"}</p>
                  )}
                </div>

                <div className="shrink-0">
                  {doc.status === "uploading" && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading
                    </span>
                  )}
                  {doc.status === "uploaded" && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                    </span>
                  )}
                  {doc.status === "error" && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                      <AlertTriangle className="w-3.5 h-3.5" /> Failed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
