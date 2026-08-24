import { useState, useRef, useEffect } from 'react';
import { FileText, Image } from 'lucide-react';
import { exportPDF, exportPNG } from '../utils/export';
import { useRulingStore } from '../store/useRulingStore';

export default function DownloadMenu({ svgRef }) {
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(null); // 'pdf' | 'png' | null
  const menuRef               = useRef(null);
  const state                 = useRulingStore();

  // ????????? ?? ????? ???
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handlePDF = async () => {
    if (!svgRef.current) return;
    setLoading('pdf');
    setOpen(false);
    try {
      await exportPDF(svgRef.current, state);
    } finally {
      setLoading(null);
    }
  };

  const handlePNG = async () => {
    if (!svgRef.current) return;
    setLoading('png');
    setOpen(false);
    try {
      await exportPNG(svgRef.current, state);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative flex-1" ref={menuRef}>
      <button
        onClick={() => setOpen(v => !v)}
        disabled={!!loading}
        className="w-full h-12 rounded-xl border border-stone-200 bg-white text-stone-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-stone-50 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin text-brand-blue" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        )}
        {loading === 'pdf' ? 'Генерация PDF...' : loading === 'png' ? 'Генерация PNG...' : 'Скачать'}
      </button>

      {open && (
        <div className="absolute bottom-full mb-1.5 left-0 right-0 bg-white rounded-xl shadow-lg ring-1 ring-slate-200 overflow-hidden z-50">
          <button
            onClick={handlePDF}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-brand-blue" />
            PDF (для печати)
          </button>
          <div className="mx-3 h-px bg-stone-100" />
          <button
            onClick={handlePNG}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <Image className="w-4 h-4 text-emerald-600" />
            PNG (без фона)
          </button>
        </div>
      )}
    </div>
  );
}
