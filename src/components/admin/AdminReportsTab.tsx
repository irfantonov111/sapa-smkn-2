import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Trash2,
  ExternalLink,
  ChevronRight,
  Shield,
  ArrowRightLeft,
  X,
  CheckSquare,
  Square,
  AlertCircle,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { EnrichedReport, ReportStatus, ReportUrgency } from '../../types/database';
import { db } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { decryptNip } from '../../utils/nipCrypto';
import { exportReportsToExcel } from '../../utils/exportReportsExcel';
import { StatusBadge, UrgencyBadge } from '../StatusBadges';
import { DeleteReportModal } from '../DeleteReportModal';
import { BulkDeleteReportModal } from '../BulkDeleteReportModal';
import { TablePagination, ResponsiveTableContainer } from '../common/TablePagination';

interface AdminReportsTabProps {
  onNavigate: (tab: string, reportId?: string) => void;
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  // Reload trigger
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion(v => v + 1);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedTarget, setSelectedTarget] = useState<string>('all');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination and Sort
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'urgency' | 'status' | 'title'>('newest');

  // Modals state
  const [deleteModalReport, setDeleteModalReport] = useState<EnrichedReport | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);

  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  // Status edit modal
  const [statusModalReport, setStatusModalReport] = useState<EnrichedReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('dibaca');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Reassign modal
  const [reassignModalReport, setReassignModalReport] = useState<EnrichedReport | null>(null);
  const [reassignTargetType, setReassignTargetType] = useState<'guru_bk' | 'wali_kelas'>('guru_bk');
  const [reassignTeacherId, setReassignTeacherId] = useState('');
  const [reassignNote, setReassignNote] = useState('');
  const [isReassigning, setIsReassigning] = useState(false);

  // Alert feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Data fetching
  const reports = useMemo(() => {
    if (!currentUser) return [];
    return db.getReports(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, version]);

  const categories = useMemo(() => db.getCategories(), [version]);
  const teachers = useMemo(() => db.getTeachers(), [version]);
  const users = useMemo(() => db.getUsers(), [version]);

  // Enriched teachers list for reassigning
  const teacherOptions = useMemo(() => {
    return teachers.map(t => {
      const u = users.find(usr => usr.id === t.user_id);
      return {
        id: t.id,
        user_id: t.user_id,
        name: u?.name || 'Guru',
        nip: decryptNip(t.nip),
        teacher_type: t.teacher_type,
        department: t.department
      };
    });
  }, [teachers, users]);

  const handleExportExcel = () => {
    if (!reports || reports.length === 0) {
      setFeedback({ type: 'error', message: 'Belum ada data laporan yang dapat diekspor.' });
      return;
    }
    setIsExportingExcel(true);
    try {
      // Export current filtered set if any filter is active, else all reports
      const isFiltered = Boolean(searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedUrgency !== 'all' || selectedTarget !== 'all');
      const targetReports = isFiltered ? filteredReports : reports;

      if (targetReports.length === 0) {
        setFeedback({ type: 'error', message: 'Tidak ada laporan yang sesuai dengan filter pencarian.' });
        return;
      }

      exportReportsToExcel(targetReports, isFiltered ? 'Data_Laporan_Pengaduan_SAPA_Tersaring' : 'Data_Laporan_Pengaduan_SAPA_Lengkap');
      setFeedback({ type: 'success', message: `Berhasil mengekspor ${targetReports.length} data laporan lengkap ke format Excel (.xlsx).` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Gagal mengekspor laporan: ${err?.message || 'Terjadi kesalahan'}` });
    } finally {
      setIsExportingExcel(false);
    }
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter(rep => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        rep.title.toLowerCase().includes(q) ||
        rep.report_code.toLowerCase().includes(q) ||
        (rep.student?.name && rep.student.name.toLowerCase().includes(q)) ||
        (rep.student?.nis && rep.student.nis.toLowerCase().includes(q)) ||
        (rep.assigned_teacher?.name && rep.assigned_teacher.name.toLowerCase().includes(q));

      const matchStatus = selectedStatus === 'all' || rep.status === selectedStatus;
      const matchCategory = selectedCategory === 'all' || rep.category_id === selectedCategory;
      const matchUrgency = selectedUrgency === 'all' || rep.urgency === selectedUrgency;
      const matchTarget = selectedTarget === 'all' || rep.target_role === selectedTarget;

      return matchSearch && matchStatus && matchCategory && matchUrgency && matchTarget;
    });
  }, [reports, searchQuery, selectedStatus, selectedCategory, selectedUrgency, selectedTarget]);

  // Sorted reports
  const sortedReports = useMemo(() => {
    return [...filteredReports].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'urgency') {
        const weight: Record<string, number> = { tinggi: 3, sedang: 2, rendah: 1 };
        return (weight[b.urgency] || 0) - (weight[a.urgency] || 0);
      }
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'title') return a.title.localeCompare(b.title, 'id');
      return 0;
    });
  }, [filteredReports, sortBy]);

  // Paginated reports
  const paginatedReports = useMemo(() => {
    if (pageSize === 'all') return sortedReports;
    const start = (currentPage - 1) * pageSize;
    return sortedReports.slice(start, start + pageSize);
  }, [sortedReports, currentPage, pageSize]);

  // Checkbox helpers
  const isAllSelected = paginatedReports.length > 0 && paginatedReports.every(r => selectedIds.includes(r.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !paginatedReports.some(r => r.id === id)));
    } else {
      setSelectedIds(prev => {
        const newIds = new Set(prev);
        paginatedReports.forEach(r => newIds.add(r.id));
        return Array.from(newIds);
      });
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Selected report objects for bulk delete modal
  const selectedReportObjects = useMemo(() => {
    return reports.filter(r => selectedIds.includes(r.id));
  }, [reports, selectedIds]);

  // Handlers
  const handleConfirmSingleDelete = () => {
    if (!deleteModalReport || !currentUser) return;
    setIsDeletingSingle(true);
    try {
      const success = db.deleteReport(deleteModalReport.id, currentUser);
      if (success) {
        setFeedback({
          type: 'success',
          message: `Laporan ${deleteModalReport.report_code} berhasil dihapus permanen.`
        });
        setSelectedIds(prev => prev.filter(id => id !== deleteModalReport.id));
        setDeleteModalReport(null);
        refresh();
      } else {
        setFeedback({
          type: 'error',
          message: 'Gagal menghapus laporan. Anda tidak memiliki otorisasi.'
        });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsDeletingSingle(false);
    }
  };

  const handleConfirmBulkDelete = () => {
    if (selectedIds.length === 0 || !currentUser) return;
    setIsDeletingBulk(true);
    try {
      const count = db.deleteReportsBulk(selectedIds, currentUser);
      setFeedback({
        type: 'success',
        message: `Berhasil menghapus ${count} laporan secara serentak.`
      });
      setSelectedIds([]);
      setIsBulkDeleteOpen(false);
      refresh();
    } catch {
      setFeedback({ type: 'error', message: 'Gagal menghapus beberapa laporan terpilih.' });
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const handleOpenStatusModal = (report: EnrichedReport) => {
    setStatusModalReport(report);
    setNewStatus(report.status);
    setStatusNote('');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalReport || !currentUser) return;
    setIsUpdatingStatus(true);
    try {
      const updated = db.adminUpdateReportStatus(
        statusModalReport.id,
        newStatus,
        statusNote.trim() || undefined,
        currentUser
      );
      if (updated) {
        setFeedback({
          type: 'success',
          message: `Status laporan ${statusModalReport.report_code} diubah menjadi "${newStatus}".`
        });
        setStatusModalReport(null);
        refresh();
      } else {
        setFeedback({ type: 'error', message: 'Gagal memperbarui status laporan.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan saat memperbarui status.' });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleOpenReassignModal = (report: EnrichedReport) => {
    setReassignModalReport(report);
    setReassignTargetType(report.assigned_to || 'guru_bk');
    // Find initial matching teacher
    const firstMatch = teacherOptions.find(t => t.teacher_type === (report.assigned_to || 'guru_bk'));
    setReassignTeacherId(firstMatch ? firstMatch.id : '');
    setReassignNote('');
  };

  const handleSaveReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignModalReport || !reassignTeacherId || !currentUser) return;
    setIsReassigning(true);
    try {
      const updated = db.adminReassignReport(
        reassignModalReport.id,
        reassignTargetType,
        reassignTeacherId,
        currentUser,
        reassignNote.trim() || undefined
      );
      if (updated) {
        const assignedName = teacherOptions.find(t => t.id === reassignTeacherId)?.name || 'Guru';
        setFeedback({
          type: 'success',
          message: `Laporan ${reassignModalReport.report_code} berhasil dialihkan ke ${assignedName}.`
        });
        setReassignModalReport(null);
        refresh();
      } else {
        setFeedback({ type: 'error', message: 'Gagal mengalihkan laporan.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan sistem saat disposisi laporan.' });
    } finally {
      setIsReassigning(false);
    }
  };

  // Metrics
  const totalCount = reports.length;
  const pendingCount = reports.filter(r => r.status === 'terkirim').length;
  const inProgressCount = reports.filter(r => ['dibaca', 'direspons', 'ditindaklanjuti'].includes(r.status)).length;
  const resolvedCount = reports.filter(r => r.status === 'selesai').length;

  return (
    <div className="space-y-6">
      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Header with Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Manajemen Laporan Pengaduan Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau status penanganan, delegasikan guru pendamping, dan ekspor riwayat pengaduan lengkap.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={isExportingExcel || reports.length === 0}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            title="Ekspor seluruh data laporan pengaduan siswa lengkap dari Kode, Tanggal, Judul & Kategori, Pelapor, Urgensi, Guru Pembimbing, hingga Status ke Excel (.xlsx)"
          >
            <Download className={`w-4 h-4 ${isExportingExcel ? 'animate-spin' : ''}`} />
            <span>{isExportingExcel ? 'Mengekspor Laporan...' : 'Export Laporan (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {/* Top Stat Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Semua Laporan</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Seluruh siswa sekolah</span>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-700">Menunggu Tanggapan</span>
          <p className="text-3xl font-extrabold text-amber-900 mt-2">{pendingCount}</p>
          <span className="text-[11px] text-amber-600 mt-0.5 block">Status: Terkirim</span>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 shadow-xs">
          <span className="text-xs font-semibold text-blue-700">Sedang Diproses</span>
          <p className="text-3xl font-extrabold text-blue-900 mt-2">{inProgressCount}</p>
          <span className="text-[11px] text-blue-600 mt-0.5 block">Ditindaklanjuti Guru</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700">Tuntas & Selesai</span>
          <p className="text-3xl font-extrabold text-emerald-900 mt-2">{resolvedCount}</p>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Konseling tuntas</span>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold">
              {selectedIds.length} laporan terpilih dari tabel
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition cursor-pointer"
            >
              Batalkan Pilihan
            </button>
            <button
              type="button"
              onClick={() => setIsBulkDeleteOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus {selectedIds.length} Terpilih Sekaligus</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode laporan, nama siswa, NIS, judul, guru pembimbing..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
            />
          </div>

          {/* Target Role Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Semua Tujuan (BK & Wali)</option>
              <option value="guru_bk">Khusus Guru BK</option>
              <option value="wali_kelas">Khusus Wali Kelas</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Semua Status</option>
              <option value="terkirim">Terkirim</option>
              <option value="dibaca">Dibaca</option>
              <option value="direspons">Direspons</option>
              <option value="ditindaklanjuti">Ditindaklanjuti</option>
              <option value="selesai">Selesai</option>
            </select>

            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Semua Urgensi</option>
              <option value="tinggi">Tinggi</option>
              <option value="sedang">Sedang</option>
              <option value="rendah">Rendah</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Semua Kategori ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Terbaru (Tanggal)</option>
                <option value="oldest">Terlama (Tanggal)</option>
                <option value="urgency">Urgensi (Tinggi ke Rendah)</option>
                <option value="status">Status Laporan</option>
                <option value="title">Judul Laporan (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Counter and clear and Page Size */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span>
              Total: <strong>{filteredReports.length}</strong> laporan ditemukan
            </span>
            {(searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedUrgency !== 'all' || selectedTarget !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setSelectedCategory('all');
                  setSelectedUrgency('all');
                  setSelectedTarget('all');
                  setCurrentPage(1);
                }}
                className="text-purple-600 hover:text-purple-800 font-bold cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setPageSize(val as any);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={10}>10 data</option>
              <option value={25}>25 data</option>
              <option value={50}>50 data</option>
              <option value={200}>200 data</option>
              <option value="all">Semua data</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Laporan yang Cocok</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ditemukan laporan siswa yang memenuhi kriteria pencarian dan filter aktif.
            </p>
          </div>
        ) : (
          <div>
            <ResponsiveTableContainer tableId="admin-reports-table" maxHeight="600px" minWidth="880px">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10 shadow-xs">
                  <tr>
                    <th className="p-3.5 pl-4 w-10">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="p-1 hover:text-purple-600 cursor-pointer"
                        title={isAllSelected ? 'Batalkan pilih semua' : 'Pilih semua di halaman ini'}
                      >
                        {isAllSelected ? (
                          <CheckSquare className="w-4 h-4 text-purple-600" />
                        ) : isSomeSelected ? (
                          <CheckSquare className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </th>
                    <th className="p-3.5">Kode & Tanggal</th>
                    <th className="p-3.5">Judul & Kategori</th>
                    <th className="p-3.5">Pelapor (Siswa)</th>
                    <th className="p-3.5">Urgensi</th>
                    <th className="p-3.5">Guru Pembimbing</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right pr-4">Aksi Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedReports.map((report) => {
                  const isChecked = selectedIds.includes(report.id);
                  return (
                    <tr
                      key={report.id}
                      className={`hover:bg-purple-50/40 transition ${
                        isChecked ? 'bg-purple-50/60' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 pl-4">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(report.id)}
                          className="p-1 hover:text-purple-600 cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Code & Date */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 block w-fit">
                          {report.report_code}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {new Date(report.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </td>

                      {/* Title & Category */}
                      <td className="p-3.5 max-w-xs">
                        <p className="font-bold text-slate-900 line-clamp-1">
                          {report.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[11px] text-slate-500 font-medium">
                            {report.category?.name || 'Kategori'}
                          </span>
                          {report.is_anonymous && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold border border-slate-200">
                              Anonim
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Student */}
                      <td className="p-3.5 whitespace-nowrap">
                        <p className="font-semibold text-slate-900">
                          {report.student?.name || 'Siswa'}
                        </p>
                        <span className="text-[11px] text-slate-500 block">
                          NIS: {report.student?.nis || '-'} • {report.student?.class_name || '-'}
                        </span>
                      </td>

                      {/* Urgency */}
                      <td className="p-3.5 whitespace-nowrap">
                        <UrgencyBadge urgency={report.urgency} />
                      </td>

                      {/* Assigned Teacher */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {report.assigned_teacher?.name || 'Belum Ditugaskan'}
                            </p>
                            <span className="text-[10px] text-slate-500 font-medium block">
                              {report.target_role === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenReassignModal(report)}
                            title="Alihkan / Disposisi Guru Lain"
                            className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-100/70 transition cursor-pointer"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={report.status} />
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(report)}
                            title="Perbarui Status Laporan"
                            className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-100/70 transition cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onNavigate('detail', report.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                            title="Buka Ruang Obrolan & Riwayat Laporan"
                          >
                            <span>Detail</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteModalReport(report)}
                            className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                            title="Hapus Laporan Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ResponsiveTableContainer>

          <TablePagination
            currentPage={currentPage}
            totalItems={sortedReports.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[10, 25, 50, 200, 'all']}
          />
        </div>
      )}
    </div>

      {/* MODAL: Single Delete Confirmation */}
      <DeleteReportModal
        isOpen={!!deleteModalReport}
        report={deleteModalReport}
        onClose={() => setDeleteModalReport(null)}
        onConfirm={handleConfirmSingleDelete}
        isDeleting={isDeletingSingle}
      />

      {/* MODAL: Bulk Delete Confirmation */}
      <BulkDeleteReportModal
        isOpen={isBulkDeleteOpen}
        selectedReports={selectedReportObjects}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        isDeleting={isDeletingBulk}
      />

      {/* MODAL: Update Status (Admin) */}
      {statusModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-purple-50 border-b border-purple-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-purple-950">Perbarui Status Laporan</h3>
                  <span className="text-xs text-purple-700 font-mono">{statusModalReport.report_code}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStatusModalReport(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Status Baru:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="terkirim">Terkirim (Menunggu Verifikasi)</option>
                  <option value="dibaca">Dibaca oleh Pihak Sekolah</option>
                  <option value="direspons">Direspons (Sedang Berkomunikasi)</option>
                  <option value="ditindaklanjuti">Ditindaklanjuti (Investigasi/Bimbingan)</option>
                  <option value="selesai">Selesai (Kasus Ditutup & Tuntas)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Perubahan (Opsional):
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Contoh: Admin memverifikasi laporan dan telah mengkoordinasikan tindak lanjut dengan pihak wali kelas."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusModalReport(null)}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition cursor-pointer"
                >
                  {isUpdatingStatus ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reassign Teacher (Admin) */}
      {reassignModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-purple-50 border-b border-purple-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-purple-950">Disposisi / Alihkan Guru</h3>
                  <span className="text-xs text-purple-700 font-mono">{reassignModalReport.report_code}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReassignModalReport(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReassign} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tipe Guru Tujuan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReassignTargetType('guru_bk');
                      const firstBK = teacherOptions.find(t => t.teacher_type === 'guru_bk');
                      if (firstBK) setReassignTeacherId(firstBK.id);
                    }}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition cursor-pointer ${
                      reassignTargetType === 'guru_bk'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Guru BK (10 Guru)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReassignTargetType('wali_kelas');
                      const firstWali = teacherOptions.find(t => t.teacher_type === 'wali_kelas');
                      if (firstWali) setReassignTeacherId(firstWali.id);
                    }}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition cursor-pointer ${
                      reassignTargetType === 'wali_kelas'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Wali Kelas (40 Guru)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Guru Pembimbing:
                </label>
                <select
                  value={reassignTeacherId}
                  onChange={(e) => setReassignTeacherId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {teacherOptions
                    .filter(t => t.teacher_type === reassignTargetType)
                    .map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} (NIP: {t.nip}) - {t.department}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alasan / Catatan Disposisi:
                </label>
                <textarea
                  rows={3}
                  value={reassignNote}
                  onChange={(e) => setReassignNote(e.target.value)}
                  placeholder="Contoh: Dialihkan penanganannya ke Guru BK bidang konseling karir / Wali Kelas terkait."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReassignModalReport(null)}
                  disabled={isReassigning}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isReassigning}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition cursor-pointer"
                >
                  {isReassigning ? 'Mengalihkan...' : 'Konfirmasi Disposisi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
