import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  Shield,
  Clock,
  CheckCircle2,
  Activity,
  MessageSquare,
  AlertCircle,
  FileCheck,
  Send,
  Lock,
  Eye,
  UserX,
  X,
  Trash2,
  Paperclip,
  Image as ImageIcon,
  FileText,
  File as FileGeneric,
  Download,
  ZoomIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { EnrichedReport, ReportStatus, ReportStatusHistory } from '../types/database';
import { CategoryIcon, StatusBadge, UrgencyBadge, PrivacyBadge } from '../components/StatusBadges';
import { StatusTimeline } from '../components/StatusTimeline';
import { ReportChat } from '../components/ReportChat';
import { DeleteReportModal } from '../components/DeleteReportModal';

interface ReportDetailPageProps {
  reportId: string;
  onNavigate: (tab: string, reportId?: string) => void;
}

export const ReportDetailPage: React.FC<ReportDetailPageProps> = ({ reportId, onNavigate }) => {
  const { currentUser } = useAuth();
  const [report, setReport] = useState<EnrichedReport | null>(null);
  const [history, setHistory] = useState<(ReportStatusHistory & { changer_name: string })[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ReportStatus>('ditindaklanjuti');
  const [statusNote, setStatusNote] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Lightbox preview modal state
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<{ url: string; name: string } | null>(null);

  const formatFileSize = (bytes?: number | string): string => {
    if (!bytes) return '';
    const num = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
    if (isNaN(num)) return String(bytes);
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  const loadData = () => {
    if (!currentUser) return;
    const rep = db.getReportById(reportId, currentUser);
    if (rep) {
      // Trigger automatic transition to DIBACA if opened by teacher while status is terkirim
      if (currentUser.role === 'guru' && rep.status === 'terkirim') {
        db.markReportAsReadByTeacher(rep.id, currentUser);
        // Reload after status update
        const updated = db.getReportById(reportId, currentUser);
        setReport(updated);
      } else {
        setReport(rep);
      }

      const hist = db.getStatusHistory(rep.id);
      setHistory(hist);
    }
  };

  useEffect(() => {
    loadData();

    // Fetch freshest data from server (including image attachments and status)
    db.fetchReportDetails(reportId, currentUser).then((fresh) => {
      if (fresh) {
        setReport(fresh);
        setHistory(db.getStatusHistory(fresh.id));
      }
    });

    // Listen to database changes
    const unsub = db.subscribe(() => {
      loadData();
    });

    return () => unsub();
  }, [reportId, currentUser]);

  if (!currentUser) return null;

  if (!report) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-base">Laporan Tidak Ditemukan</h3>
        <p className="text-xs text-slate-500 mt-1">
          Laporan ini mungkin tidak ada atau kamu tidak memiliki hak akses untuk membukanya.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const isTeacher = currentUser.role === 'guru';
  const isAdmin = currentUser.role === 'admin';
  const canUpdateStatus = isTeacher || isAdmin;

  const handleUpdateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpdateStatus) return;

    db.updateReportStatus(report.id, targetStatus, currentUser, statusNote.trim() || undefined);
    setShowStatusModal(false);
    setStatusNote('');
    loadData();
  };

  const handleConfirmDelete = () => {
    if (!report || !currentUser) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      db.deleteReport(report.id, currentUser);
      setShowDeleteModal(false);
      onNavigate(currentUser.role === 'siswa' ? 'my-reports' : 'inbox');
    } catch (err: any) {
      setDeleteError(err.message || 'Gagal menghapus laporan.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar with Back Link and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate(currentUser.role === 'siswa' ? 'my-reports' : 'inbox')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Laporan</span>
        </button>

        {/* Teacher / Admin action buttons */}
        {canUpdateStatus && (
          <div className="flex items-center gap-2 flex-wrap">
            {report.status !== 'selesai' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setTargetStatus('selesai');
                    setStatusNote('Masalah telah diselesaikan dan didiskusikan bersama siswa.');
                    setShowStatusModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Selesai</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTargetStatus(
                      report.status === 'ditindaklanjuti' ? 'selesai' : 'ditindaklanjuti'
                    );
                    setShowStatusModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Ubah Status Laporan</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTargetStatus('ditindaklanjuti');
                  setShowStatusModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Activity className="w-4 h-4 text-slate-500" />
                <span>Perbarui / Buka Status Kembali</span>
              </button>
            )}

            {/* Hapus Laporan Button */}
            <button
              type="button"
              onClick={() => {
                setDeleteError(null);
                setShowDeleteModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Laporan</span>
            </button>
          </div>
        )}
      </div>

      {/* Resolution Banner if Selesai */}
      {report.status === 'selesai' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4.5 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Laporan Telah Diselesaikan
              </h4>
              {report.closed_at && (
                <span className="text-[11px] text-emerald-700">
                  • {new Date(report.closed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-800 mt-1">
              Laporan ini telah ditangani hingga tuntas. Riwayat penanganan dan catatan komunikasi tersimpan rapi untuk pertanggungjawaban sekolah.
            </p>
          </div>
        </div>
      )}

      {/* Main Report Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-start gap-4">
            <CategoryIcon iconName={report.category.icon} color={report.category.color} className="w-6 h-6" />

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                  {report.report_code}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {report.category.name}
                </span>
                <UrgencyBadge urgency={report.urgency} />
                <PrivacyBadge privacy={report.privacy} />
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {report.title}
              </h1>

              {/* Student info and recipient banner */}
              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pelapor: <strong className="text-slate-800">{report.student?.name}</strong> ({report.student?.class_name})</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Penerima:{' '}
                    <strong className="text-slate-800">
                      {report.assigned_teacher?.specific_name
                        ? `${report.assigned_teacher.specific_name} (${report.assigned_teacher.role_label})`
                        : report.assigned_teacher?.name || report.assigned_teacher?.role_label}
                    </strong>
                    {report.assigned_teacher?.room && (
                      <span className="text-slate-400 font-normal ml-1">
                        • {report.assigned_teacher.room}
                      </span>
                    )}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="self-start md:self-auto shrink-0">
            <StatusBadge status={report.status} />
          </div>
        </div>

        {/* Full Story / Description Box */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Isi / Deskripsi Masalah Siswa:
          </h4>
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
            {report.description}
          </p>
        </div>

        {/* Attachments Section if present */}
        {report.attachments && report.attachments.length > 0 && (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Paperclip className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Lampiran Bukti ({report.attachments.length} Berkas)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.attachments.map((att) => {
                const isImg = att.type === 'image';
                return (
                  <div
                    key={att.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
                  >
                    {isImg ? (
                      <div
                        onClick={() => setSelectedLightboxImage({ url: att.url, name: att.name })}
                        className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 cursor-pointer relative group/thumb"
                        title="Klik untuk memperbesar gambar"
                      >
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition flex items-center justify-center">
                          <ZoomIn className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600">
                        {att.name.toLowerCase().endsWith('.pdf') ? (
                          <FileText className="w-6 h-6 text-rose-600" />
                        ) : (
                          <FileGeneric className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate" title={att.name}>
                        {att.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400">
                          {formatFileSize(att.size)}
                        </span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded uppercase tracking-wider bg-white text-slate-600 border border-slate-200">
                          {isImg ? 'Foto' : (att.name.split('.').pop() || 'Dokumen')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isImg && (
                        <button
                          type="button"
                          onClick={() => setSelectedLightboxImage({ url: att.url, name: att.name })}
                          className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition"
                          title="Lihat Pratinjau Foto"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      )}
                      <a
                        href={att.url}
                        download={att.name}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition"
                        title="Unduh Berkas"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Visual Status Timeline Progress */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Perkembangan Status
          </h3>
          <StatusTimeline currentStatus={report.status} history={history} />
        </div>
      </div>

      {/* Interactive Communication / Chat Section */}
      <div className="space-y-3">
        <ReportChat report={report} currentUser={currentUser} onMessageSent={loadData} />
      </div>

      {/* Modal: Change Status (Guru & Admin) - Responsive and non-overflowing */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[calc(100vh-2rem)] my-auto overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0 bg-slate-50/50">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Perbarui Status Laporan
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Pembaruan status tercatat di riwayat dan siswa otomatis menerima notifikasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <form onSubmit={handleUpdateStatusSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Status Baru:</label>
                <div className="grid grid-cols-1 gap-2">
                  <label className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition cursor-pointer ${
                    targetStatus === 'direspons' ? 'border-blue-500 bg-blue-50/60 shadow-2xs' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="direspons"
                      checked={targetStatus === 'direspons'}
                      onChange={() => setTargetStatus('direspons')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800">Direspons</p>
                      <p className="text-[11px] text-slate-500 leading-tight">Guru telah memberikan tanggapan atau instruksi awal</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition cursor-pointer ${
                    targetStatus === 'ditindaklanjuti' ? 'border-purple-500 bg-purple-50/60 shadow-2xs' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="ditindaklanjuti"
                      checked={targetStatus === 'ditindaklanjuti'}
                      onChange={() => setTargetStatus('ditindaklanjuti')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-purple-900">Ditindaklanjuti</p>
                      <p className="text-[11px] text-slate-500 leading-tight">Sedang dalam proses bimbingan / penanganan aktif</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition cursor-pointer ${
                    targetStatus === 'selesai' ? 'border-emerald-500 bg-emerald-50/60 shadow-2xs' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="selesai"
                      checked={targetStatus === 'selesai'}
                      onChange={() => setTargetStatus('selesai')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-emerald-900">Selesai</p>
                      <p className="text-[11px] text-slate-500 leading-tight">Masalah telah terselesaikan dengan tuntas</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Tindak Lanjut (Ditampilkan ke Siswa):
                </label>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder={
                    targetStatus === 'selesai'
                      ? 'Contoh: Masalah telah dibahas dan diselesaikan secara tuntas bersama siswa.'
                      : 'Contoh: Telah dijadwalkan sesi bimbingan tatap muka Kamis jam 10.00 di ruang BK.'
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Quick Templates */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[10px] text-slate-400 self-center">Template cepat:</span>
                  {targetStatus === 'selesai' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setStatusNote('Telah selesai dibahas & dicarikan solusi bersama siswa.')}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px]"
                      >
                        Solusi disepakati
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusNote('Bimbingan telah terlaksana dan siswa dalam kondisi baik.')}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px]"
                      >
                        Bimbingan tuntas
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setStatusNote('Akan dijadwalkan sesi diskusi lanjutan.')}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px]"
                      >
                        Jadwal lanjutan
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusNote('Laporan sedang dikoordinasikan dengan pihak terkait.')}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px]"
                      >
                        Koordinasi
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Info note */}
              <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-2.5 text-[11px] text-blue-800 flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Hak Akses Guru:</strong> Baik <em>Guru Wali Kelas</em> maupun <em>Guru BK</em> memiliki wewenang untuk mengubah status menjadi <strong>Selesai</strong> atas laporan yang menjadi ranah penanganannya.
                </span>
              </div>

              {/* Footer action buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Report Confirmation Modal */}
      <DeleteReportModal
        isOpen={showDeleteModal}
        report={report}
        onClose={() => {
          if (!isDeleting) {
            setShowDeleteModal(false);
            setDeleteError(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        errorMessage={deleteError}
      />

      {/* Lightbox / Full Photo Preview Modal */}
      {selectedLightboxImage && (
        <div
          onClick={() => setSelectedLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80">
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {selectedLightboxImage.name}
                </h4>
                <p className="text-[10px] text-slate-400">Pratinjau Foto Bukti</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLightboxImage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-slate-950/95 overflow-auto max-h-[75vh]">
              <img
                src={selectedLightboxImage.url}
                alt={selectedLightboxImage.name}
                className="max-h-[70vh] max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
