import React from 'react';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';
import { EnrichedReport } from '../types/database';

interface BulkDeleteReportModalProps {
  isOpen: boolean;
  selectedReports: EnrichedReport[];
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  errorMessage?: string | null;
}

export const BulkDeleteReportModal: React.FC<BulkDeleteReportModalProps> = ({
  isOpen,
  selectedReports,
  onClose,
  onConfirm,
  isDeleting,
  errorMessage
}) => {
  if (!isOpen || selectedReports.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-rose-950">
                Hapus {selectedReports.length} Laporan Sekaligus?
              </h3>
              <p className="text-xs text-rose-700 mt-0.5">
                Konfirmasi penghapusan massal dari database sekolah
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-white/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <p className="text-xs text-slate-600">
            Anda telah memilih <strong>{selectedReports.length} laporan</strong> untuk dihapus secara serentak:
          </p>

          {/* List of selected items */}
          <div className="max-h-44 overflow-y-auto space-y-2 p-2 bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {selectedReports.map((report) => (
              <div key={report.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      {report.report_code}
                    </span>
                    <span className="font-bold text-slate-900 truncate">
                      {report.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {report.student?.name || 'Siswa'} ({report.category?.name || 'Kategori'})
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Perhatian Penghapusan Permanen</p>
              <p className="mt-0.5 text-amber-800 text-[11px]">
                Semua data obrolan konsultasi, riwayat status, dan file bukti terkait {selectedReports.length} laporan ini akan dihapus secara permanen.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Menghapus...' : `Hapus ${selectedReports.length} Laporan`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
