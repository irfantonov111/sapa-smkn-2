import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  ChevronRight,
  MessageSquare,
  Clock,
  CheckCircle2,
  Trash2,
  Users,
  CheckCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { ReportStatus, EnrichedReport } from '../types/database';
import { CategoryIcon, StatusBadge, UrgencyBadge, PrivacyBadge } from '../components/StatusBadges';
import { DeleteReportModal } from '../components/DeleteReportModal';
import { BulkDeleteReportModal } from '../components/BulkDeleteReportModal';
import { TablePagination, ResponsiveTableContainer } from '../components/common/TablePagination';

interface ReportsListPageProps {
  onNavigate: (tab: string, reportId?: string) => void;
  statusFilterPreset?: ReportStatus | 'all';
}

export const ReportsListPage: React.FC<ReportsListPageProps> = ({
  onNavigate,
  statusFilterPreset = 'all'
}) => {
  const { currentUser, teacherProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(statusFilterPreset);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  // Default for BK is 'my_assigned'
  const [bkFilterScope, setBkFilterScope] = useState<'my_assigned' | 'all'>('my_assigned');
  const [sortBy, setSortBy] = useState<string>('assigned_first');
  const [refreshTick, setRefreshTick] = useState(0);

  // Pagination
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Deletion modal state
  const [reportToDelete, setReportToDelete] = useState<EnrichedReport | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState<string | null>(null);

  // Bulk deletion state
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [bulkDeleteError, setBulkDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedStatus(statusFilterPreset);
  }, [statusFilterPreset]);

  const categories = db.getCategories();
  const reports = useMemo(() => {
    return currentUser ? db.getReports(currentUser) : [];
  }, [currentUser, refreshTick]);

  const isTeacher = currentUser?.role === 'guru';
  const isAdmin = currentUser?.role === 'admin';
  const teacherRecord = currentUser ? db.getTeacherByUserId(currentUser.id) : null;
  const isBK = teacherProfile?.teacher_type === 'guru_bk' || teacherRecord?.teacher_type === 'guru_bk';

  // Wali Kelas managed class names
  const homeroomClassNames = useMemo(() => {
    if (!teacherRecord) return [];
    return db.getClasses().filter(c => c.homeroom_teacher_id === teacherRecord.id).map(c => c.name);
  }, [teacherRecord]);

  // Check if report was chosen specifically for current BK teacher
  const isReportAssignedToCurrentBK = (rep: EnrichedReport) => {
    if (!teacherRecord) return false;
    return (
      rep.assigned_teacher_id === teacherRecord.id ||
      rep.assigned_teacher_id === teacherRecord.user_id ||
      rep.assigned_teacher?.teacher_id === teacherRecord.id ||
      rep.assigned_teacher?.user_id === teacherRecord.user_id
    );
  };

  const myAssignedCount = useMemo(() => {
    return reports.filter(isReportAssignedToCurrentBK).length;
  }, [reports, teacherRecord]);

  const canDeleteReport = (rep: EnrichedReport) => {
    if (!currentUser) return false;
    if (isAdmin) return true;
    if (isTeacher) {
      if (isBK) return true;
      // Wali Kelas can delete reports for students in their class
      if (rep.student?.class_name && homeroomClassNames.includes(rep.student.class_name)) return true;
      if (rep.assigned_teacher_id === teacherRecord?.id || rep.assigned_teacher_id === teacherRecord?.user_id) return true;
    }
    return false;
  };

  const filteredReports = useMemo(() => {
    const list = reports.filter((rep) => {
      // Guru BK Filter Scope: Default is only reports specifically chosen for this BK teacher
      if (isBK && bkFilterScope === 'my_assigned') {
        if (!isReportAssignedToCurrentBK(rep)) {
          return false;
        }
      }

      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchCode = rep.report_code.toLowerCase().includes(term);
        const matchTitle = rep.title.toLowerCase().includes(term);
        const matchDesc = rep.description.toLowerCase().includes(term);
        const matchStudent = rep.student?.name?.toLowerCase().includes(term);
        if (!matchCode && !matchTitle && !matchDesc && !matchStudent) return false;
      }

      // Status
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'ditindaklanjuti') {
          // Include ditindaklanjuti and direspons in follow-up views
          if (rep.status !== 'ditindaklanjuti' && rep.status !== 'direspons') {
            return false;
          }
        } else if (rep.status !== selectedStatus) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && rep.category_id !== selectedCategory) {
        return false;
      }

      // Urgency
      if (selectedUrgency !== 'all' && rep.urgency !== selectedUrgency) {
        return false;
      }

      return true;
    });

    // Default sorting for Guru BK: Prioritize reports assigned to the current BK teacher
    return [...list].sort((a, b) => {
      if (sortBy === 'assigned_first') {
        const aMine = isReportAssignedToCurrentBK(a);
        const bMine = isReportAssignedToCurrentBK(b);
        if (aMine && !bMine) return -1;
        if (!aMine && bMine) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'urgency') {
        const urgencyWeight: Record<string, number> = { tinggi: 3, sedang: 2, rendah: 1 };
        const diff = (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
        if (diff !== 0) return diff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });
  }, [reports, searchTerm, selectedStatus, selectedCategory, selectedUrgency, isBK, bkFilterScope, sortBy, teacherRecord]);

  // Paginated reports
  const paginatedReports = useMemo(() => {
    if (pageSize === 'all') return filteredReports;
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage, pageSize]);

  // Reports that the current user has permission to delete
  const deletableReports = useMemo(() => {
    return filteredReports.filter(canDeleteReport);
  }, [filteredReports, currentUser, isBK, isTeacher, isAdmin, homeroomClassNames, teacherRecord]);

  const isAllSelected = deletableReports.length > 0 && selectedReportIds.length === deletableReports.length;
  const isSomeSelected = selectedReportIds.length > 0 && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedReportIds([]);
    } else {
      setSelectedReportIds(deletableReports.map(r => r.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedReportIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedReportObjects = useMemo(() => {
    return reports.filter(r => selectedReportIds.includes(r.id));
  }, [reports, selectedReportIds]);

  const handleConfirmDelete = () => {
    if (!reportToDelete || !currentUser) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      db.deleteReport(reportToDelete.id, currentUser);
      const code = reportToDelete.report_code;
      setDeleteSuccessMessage(`Laporan ${code} berhasil dihapus permanen.`);
      setSelectedReportIds(prev => prev.filter(id => id !== reportToDelete.id));
      setReportToDelete(null);
      setRefreshTick(prev => prev + 1);
      setTimeout(() => setDeleteSuccessMessage(null), 5000);
    } catch (err: any) {
      setDeleteError(err.message || 'Gagal menghapus laporan.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmBulkDelete = () => {
    if (selectedReportIds.length === 0 || !currentUser) return;
    setIsDeletingBulk(true);
    setBulkDeleteError(null);
    try {
      const count = db.deleteReportsBulk(selectedReportIds, currentUser);
      setDeleteSuccessMessage(`Berhasil menghapus ${count} laporan sekaligus secara serentak.`);
      setSelectedReportIds([]);
      setIsBulkDeleteOpen(false);
      setRefreshTick(prev => prev + 1);
      setTimeout(() => setDeleteSuccessMessage(null), 5000);
    } catch (err: any) {
      setBulkDeleteError(err.message || 'Gagal menghapus beberapa laporan terpilih.');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  // Dynamic page title
  const pageTitle = useMemo(() => {
    if (selectedStatus === 'ditindaklanjuti') {
      return 'Laporan Sedang Ditindaklanjuti';
    }
    if (selectedStatus === 'selesai') {
      return 'Laporan Selesai & Dituntaskan';
    }
    return currentUser?.role === 'siswa' ? 'Laporan Saya' : 'Daftar Laporan Masuk';
  }, [selectedStatus, currentUser?.role]);

  return (
    <div className="space-y-6">
      {/* Delete Success Alert Banner */}
      {deleteSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{deleteSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setDeleteSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ditemukan {filteredReports.length} laporan{' '}
            {isBK && bkFilterScope === 'my_assigned' ? `(Khusus pilihan siswa untuk ${currentUser?.name?.split(',')[0] || 'Anda'})` : 'sesuai filter yang aktif'}
          </p>
        </div>

        {currentUser?.role === 'siswa' && (
          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 self-start sm:self-auto transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Laporan Baru</span>
          </button>
        )}
      </div>

      {/* Guru BK Filter Scope Switcher */}
      {isBK && (
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                Lingkup Laporan Guru BK:
              </span>
            </div>
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setBkFilterScope('my_assigned')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  bkFilterScope === 'my_assigned'
                    ? 'bg-white text-blue-800 shadow-xs border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Ditujukan ke Saya (Pilihan Siswa)</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    bkFilterScope === 'my_assigned'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {myAssignedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBkFilterScope('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  bkFilterScope === 'all'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Semua Laporan Siswa</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    bkFilterScope === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {reports.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode laporan (misal: AC-00001), judul, atau isi..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="terkirim">Terkirim</option>
              <option value="dibaca">Dibaca</option>
              <option value="direspons">Direspons</option>
              <option value="ditindaklanjuti">Ditindaklanjuti</option>
              <option value="selesai">Selesai</option>
            </select>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Urgency Select */}
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Urgensi</option>
              <option value="rendah">Urgensi Rendah</option>
              <option value="sedang">Urgensi Sedang</option>
              <option value="tinggi">Urgensi Tinggi</option>
            </select>
            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isBK && (
                <option value="assigned_first">Guru BK Saya (Default)</option>
              )}
              <option value="newest">Waktu: Terbaru</option>
              <option value="oldest">Waktu: Terlama</option>
              <option value="urgency">Urgensi Tertinggi</option>
            </select>

            {/* Page Size Select */}
            <select
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setPageSize(val as any);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              title="Jumlah data per halaman"
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

      {/* Bulk Action & Selection Bar */}
      {deletableReports.length > 0 && (
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>{isAllSelected ? 'Batalkan Semua' : `Pilih Semua (${deletableReports.length})`}</span>
            </button>

            {selectedReportIds.length > 0 && (
              <span className="font-semibold text-slate-600">
                <strong className="text-blue-700">{selectedReportIds.length}</strong> laporan dipilih
              </span>
            )}
          </div>

          {selectedReportIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedReportIds([])}
                className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setBulkDeleteError(null);
                  setIsBulkDeleteOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus {selectedReportIds.length} Laporan Sekaligus</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reports Listing */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Laporan Ditemukan</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {isBK && bkFilterScope === 'my_assigned' ? (
              <>
                Belum ada laporan siswa yang ditujukan khusus ke Anda. Coba pilih filter{' '}
                <button
                  type="button"
                  onClick={() => setBkFilterScope('all')}
                  className="text-blue-600 font-bold underline cursor-pointer"
                >
                  Semua Laporan Siswa
                </button>
                .
              </>
            ) : (
              'Coba sesuaikan kata kunci pencarian atau filter yang kamu gunakan.'
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {paginatedReports.map((rep) => {
            const canDel = canDeleteReport(rep);
            const isSelected = selectedReportIds.includes(rep.id);
            return (
              <div
                key={rep.id}
                onClick={() => onNavigate('detail', rep.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer bg-white group flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-blue-400 bg-blue-50/40 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  {canDel && (
                    <button
                      type="button"
                      onClick={(e) => toggleSelectOne(rep.id, e)}
                      className="p-1 -ml-1 text-slate-400 hover:text-blue-600 cursor-pointer mt-0.5"
                      title={isSelected ? 'Hapus dari pilihan' : 'Pilih laporan'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                      )}
                    </button>
                  )}

                  <CategoryIcon iconName={rep.category.icon} color={rep.category.color} />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {rep.report_code}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {rep.category.name}
                      </span>
                      {rep.student && (
                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {rep.student.name} ({rep.student.class_name})
                        </span>
                      )}
                      <UrgencyBadge urgency={rep.urgency} />
                      <PrivacyBadge privacy={rep.privacy} />
                      {isReportAssignedToCurrentBK(rep) && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          Ditujukan ke Anda
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {rep.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {rep.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>
                        Penerima: <strong className="text-slate-600">{rep.assigned_teacher?.specific_name ? `${rep.assigned_teacher.specific_name} (${rep.assigned_teacher.role_label})` : rep.assigned_teacher?.role_label}</strong>
                      </span>
                      <span>•</span>
                      <span>{new Date(rep.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {rep.messages_count > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-blue-600 font-semibold">
                            <MessageSquare className="w-3 h-3" />
                            {rep.messages_count} pesan
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  <StatusBadge status={rep.status} />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                    >
                      <span>Detail & Chat</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {canDel && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteError(null);
                          setReportToDelete(rep);
                        }}
                        title="Hapus Laporan Siswa"
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <TablePagination
            currentPage={currentPage}
            totalItems={filteredReports.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[10, 25, 50, 200, 'all']}
          />
        </div>
      </div>
    )}

      {/* Delete Confirmation Modal */}
      <DeleteReportModal
        isOpen={!!reportToDelete}
        report={reportToDelete}
        onClose={() => {
          if (!isDeleting) {
            setReportToDelete(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        errorMessage={deleteError}
      />

      {/* Bulk Delete Confirmation Modal */}
      <BulkDeleteReportModal
        isOpen={isBulkDeleteOpen}
        selectedReports={selectedReportObjects}
        onClose={() => {
          if (!isDeletingBulk) {
            setIsBulkDeleteOpen(false);
            setBulkDeleteError(null);
          }
        }}
        onConfirm={handleConfirmBulkDelete}
        isDeleting={isDeletingBulk}
        errorMessage={bulkDeleteError}
      />
    </div>
  );
};
