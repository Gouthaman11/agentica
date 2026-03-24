import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileType, FileText, Download, Trash2, ShieldCheck, FileSpreadsheet, ArrowRight, Loader2, Sparkles, AlertTriangle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: string;
  date: string;
  type: string;
  status?: 'processing' | 'completed' | 'error';
}

export default function Documents() {
  const [originalDocs, setOriginalDocs] = useState<Document[]>([
    { id: '1', name: 'Raw_Messy_Data_Q1.csv', size: '2.4 MB', date: '2026-03-22', type: 'CSV', status: 'error' },
    { id: '2', name: 'Scanned_Invoice_Batch.pdf', size: '4.1 MB', date: '2026-03-20', type: 'PDF', status: 'error' }
  ]);
  
  const [convertedDocs, setConvertedDocs] = useState<Document[]>([
    { id: '1c', name: 'Structured_Data_Q1.xlsx', size: '1.8 MB', date: '2026-03-22', type: 'Excel' },
    { id: '2c', name: 'Cleaned_Invoices_Batch.xlsx', size: '890 KB', date: '2026-03-20', type: 'Excel' }
  ]);
  
  const [isHovering, setIsHovering] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<Document | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      // Format file size nicely
      const sizeStr = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' 
        : (file.size / 1024).toFixed(0) + ' KB';
      
      processNewUpload(file.name, sizeStr, ext);
      
      // Reset input so the same file could be uploaded again if needed
      e.target.value = '';
    }
  };

  const processNewUpload = (fileName: string, sizeStr: string, extString: string) => {
    setIsHovering(false);
    const newId = Date.now().toString();
    
    const newDoc: Document = {
      id: newId,
      name: fileName,
      size: sizeStr,
      date: new Date().toISOString().split('T')[0],
      type: extString,
      status: 'processing'
    };
    
    setOriginalDocs(prev => [newDoc, ...prev]);

    // Simulate AI processing and fixing unaligned errors
    setTimeout(() => {
      setOriginalDocs(docs => docs.map(d => d.id === newId ? { ...d, status: 'error' } : d));
      
      // Simple size scaling mock for the resulting Excel file
      let parsedNum = parseFloat(sizeStr);
      let newSizeStr = sizeStr;
      if (!isNaN(parsedNum)) {
          newSizeStr = `${(parsedNum * 0.6).toFixed(1)} ${sizeStr.includes('MB') ? 'MB' : 'KB'}`;
      }

      const newConverted: Document = {
        id: newId + 'c', // 'c' suffix mapping!
        name: `AI_Corrected_${newDoc.name.split('.')[0]}.xlsx`,
        size: newSizeStr,
        date: newDoc.date,
        type: 'Excel'
      };
      setConvertedDocs(prev => [newConverted, ...prev]);
    }, 3500);
  };

  const confirmDelete = () => {
    if (deleteConfirmTarget) {
      // Delete from originals
      setOriginalDocs(docs => docs.filter(d => d.id !== deleteConfirmTarget.id));
      // Completely erase associated converted AI files
      setConvertedDocs(docs => docs.filter(d => d.id !== deleteConfirmTarget.id + 'c'));
      setDeleteConfirmTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {deleteConfirmTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-white/10"
            >
              <div className="flex items-center gap-3 text-rose-500 mb-4">
                <div className="p-3 rounded-full bg-rose-500/10">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Data?</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">{deleteConfirmTarget.name}</strong>? 
                This will automatically and securely erase the corresponding AI-converted Excel file. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setDeleteConfirmTarget(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 active:scale-95 transition"
                >
                  Yes, Delete All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AI Document Structuring</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Upload messy, unaligned files. Nexus AI will correct errors and convert them to professional Excel sheets.</p>
        </div>
        <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4 mr-1" />
          Bank-grade encryption
        </div>
      </div>

      {/* Hidden file input invoked by custom UI */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.csv,.txt,.xlsx,.xls,.doc,.docx"
      />

      {/* Upload Area (Top, Full Width) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div 
          className={`cursor-pointer group flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed transition-all duration-300
            ${isHovering 
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' 
              : 'border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40'} 
            backdrop-blur-xl hover:border-indigo-500 shadow-sm`}
          onDragEnter={() => setIsHovering(true)}
          onDragLeave={() => setIsHovering(false)}
          onDrop={(e) => { 
            e.preventDefault(); 
            setIsHovering(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const file = e.dataTransfer.files[0];
              const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
              const sizeStr = file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : (file.size / 1024).toFixed(0) + ' KB';
              processNewUpload(file.name, sizeStr, ext);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={`p-4 rounded-full mb-3 transition-colors ${
            isHovering ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-indigo-500'
          }`}>
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Click or Drag to Upload Messy Data</h3>
          <p className="text-sm text-center text-slate-500">Supports PDF, CSV, TXT. Our AI will automatically align fields and fix errors.</p>
        </div>
      </motion.div>

      {/* Split View: Originals vs Converted */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        
        {/* Center Arrow Indicator (Desktop only) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-slate-800 rounded-full items-center justify-center shadow-lg border border-slate-200 dark:border-white/10 text-indigo-500">
          <ArrowRight className="w-6 h-6" />
        </div>

        {/* Left Side: Original Files */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm overflow-hidden flex flex-col h-[500px]"
        >
          <div className="p-5 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Recent Uploads (Raw)
            </h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-2.5 py-1 rounded-full">{originalDocs.length} files</span>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            <AnimatePresence>
              {originalDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-4 truncate">
                    <div className={`p-3 rounded-xl shrink-0 ${
                      doc.type === 'PDF' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate pr-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{doc.size}</span>
                        <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                        {doc.status === 'processing' ? (
                          <span className="text-xs text-indigo-500 flex items-center gap-1 font-medium">
                            <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3 h-3" /> Unaligned formatting
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 pl-2">
                    <button 
                      onClick={() => setDeleteConfirmTarget(doc)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {originalDocs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <FileType className="w-12 h-12 mb-3 opacity-20" />
                <p>No raw files uploaded.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Side: Converted Excel Files */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/5 backdrop-blur-xl border border-indigo-500/20 dark:border-indigo-400/20 shadow-sm overflow-hidden flex flex-col h-[500px]"
        >
          <div className="p-5 border-b border-indigo-500/10 dark:border-indigo-400/10 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-500/[0.02]">
            <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              AI Structured Excel Files
            </h2>
            <span className="flex h-3 w-3 relative">
              {convertedDocs.length > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${convertedDocs.length > 0 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
            </span>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            <AnimatePresence>
              {convertedDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  className="flex items-center justify-between p-4 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/20 hover:border-emerald-500/40 transition-colors group shadow-sm shadow-emerald-500/5"
                >
                  <div className="flex items-center gap-4 truncate">
                    <div className="p-3 rounded-xl shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className="truncate pr-4">
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-emerald-700/70 dark:text-emerald-300/70">{doc.size}</span>
                        <span className="text-xs text-emerald-700/30 dark:text-emerald-300/30">•</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium tracking-wide uppercase">Structured & Cleaned</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 pl-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors shadow-sm shadow-emerald-500/20"
                      onClick={() => alert(`Downloading perfectly formatted Excel file: ${doc.name}`)}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {convertedDocs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-indigo-300 dark:text-indigo-700">
                <FileSpreadsheet className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm font-medium">Waiting for AI processing...</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
