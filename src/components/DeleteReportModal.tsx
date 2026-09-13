import React from 'react';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';
import { EnrichedReport } from '../types/database';

interface DeleteReportModalProps {
  isOpen: boolean;
  report: EnrichedReport | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  errorMessage?: string | null;
}

export const DeleteReportModal: React.FC<DeleteReportModalProps> = ({
  isOpen,
  report,
  onClose,
  onConfirm,
  isDeleting,
  errorMessage
}) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-rose-950">
                Hapus Laporan Siswa?
              </h3>
              <p className="text-xs text-rose-700 mt-0.5">
                Konfirmasi penghapusan permanen dari sistem sekolah
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Report summary card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {report.report_code}
              </span>
              <span className="text-slate-500 font-semibold">
                Kategori: {report.category?.name || '-'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Judul Laporan:</span>
              <p className="font-bold text-slate-900 mt-0.5 text-sm line-clamp-2">
                {report.title}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[11px] text-slate-600">
              <span>
                Siswa: <strong className="text-slate-800">{report.student?.name || 'Siswa'}</strong> ({report.student?.class_name || '-'})
              </span>
              <span>
                {new Date(report.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Peringatan Tindakan Permanen</p>
              <p className="mt-0.5 text-amber-800 text-[11px]">
                Menghapus laporan ini akan membersihkan seluruh riwayat penanganan, percakapan pesan konsultasi, dan notifikasi terkait. Data tidak dapat dipulihkan kembali.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
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
            <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Laporan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
