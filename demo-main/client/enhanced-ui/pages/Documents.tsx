import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileType, FileText, Download, Trash2, ShieldCheck } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: string;
  date: string;
  type: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Q1_Financial_Report.pdf', size: '2.4 MB', date: '2026-03-22', type: 'PDF' },
    { id: '2', name: 'Vendor_Invoices_March.xlsx', size: '1.1 MB', date: '2026-03-20', type: 'Excel' },
    { id: '3', name: 'Employee_Payroll_Summary.csv', size: '458 KB', date: '2026-03-15', type: 'CSV' },
  ]);
  const [isHovering, setIsHovering] = useState(false);

  const handleUploadClick = () => {
    // Mock upload
    const newDoc = {
      id: Date.now().toString(),
      name: `New_Export_${Math.floor(Math.random() * 1000)}.pdf`,
      size: '1.2 MB',
      date: new Date().toISOString().split('T')[0],
      type: 'PDF'
    };
    setDocuments([newDoc, ...documents]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Documents</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Upload and manage your financial files securely.</p>
        </div>
        <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4 mr-1" />
          End-to-end encrypted
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div 
            className={`cursor-pointer group flex flex-col items-center justify-center p-10 rounded-3xl border-2 border-dashed transition-all duration-300
              ${isHovering 
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' 
                : 'border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40'} 
              backdrop-blur-xl hover:border-indigo-500`}
            onDragEnter={() => setIsHovering(true)}
            onDragLeave={() => setIsHovering(false)}
            onDrop={() => { setIsHovering(false); handleUploadClick(); }}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleUploadClick}
          >
            <div className={`p-4 rounded-full mb-4 transition-colors ${
              isHovering ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Upload File</h3>
            <p className="text-sm text-center text-slate-500 px-4">Drag and drop your PDF, CSV, or Excel files here, or click to browse.</p>
            <div className="mt-6 flex gap-2">
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded">PDF</span>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded">CSV</span>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded">Excel</span>
            </div>
          </div>
        </motion.div>

        {/* Document List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-200/50 dark:border-white/5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Uploads</h2>
          </div>
          
          <div className="p-2 flex-1">
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-slate-400">
                <FileType className="w-12 h-12 mb-2 opacity-20" />
                <p>No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc, i) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        doc.type === 'PDF' ? 'bg-rose-500/10 text-rose-500' :
                        doc.type === 'Excel' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.size} • Uploaded {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:bg-slate-100 dark:hover:bg-indigo-500/10 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}
                        className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors hover:bg-slate-100 dark:hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
