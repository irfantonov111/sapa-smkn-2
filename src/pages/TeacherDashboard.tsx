import React, { useState, useMemo, useEffect } from 'react';
import {
  Inbox,
  Eye,
  EyeOff,
  Activity,
  CheckCircle2,
  Filter,
  Search,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  Calendar,
  AlertTriangle,
  Trash2,
  Users,
  CheckCircle,
  AlertCircle,
  CheckSquare,
  Square,
  Megaphone,
  Heart,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { decryptNip, maskNip } from '../utils/nipCrypto';
import { CategoryIcon, StatusBadge, UrgencyBadge, PrivacyBadge } from '../components/StatusBadges';
import { EnrichedReport } from '../types/database';
import { DeleteReportModal } from '../components/DeleteReportModal';
import { BulkDeleteReportModal } from '../components/BulkDeleteReportModal';

interface TeacherDashboardProps {
  onNavigate: (tab: string, reportId?: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { currentUser, teacherProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  // Default filter for Guru BK: 'my_assigned' (only reports specifically chosen for this BK teacher)
  const [bkFilterScope, setBkFilterScope] = useState<'my_assigned' | 'all'>('my_assigned');
  const [sortBy, setSortBy] = useState<string>('assigned_first');
  const [refreshTick, setRefreshTick] = useState(0);
  const [showNip, setShowNip] = useState(false);

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

  const categories = db.getCategories();
  const classes = db.getClasses();
  const reports = useMemo(() => {
    return currentUser ? db.getReports(currentUser) : [];
  }, [currentUser, refreshTick]);

  const isBK = teacherProfile?.teacher_type === 'guru_bk';
  const teacherRecord = currentUser ? db.getTeacherByUserId(currentUser.id) : null;

  // Helper to check if a report was assigned to this specific BK teacher by student choice
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

  // Real-time synchronization with database & backend
  useEffect(() => {
    const unsub = db.subscribe(() => {
      setRefreshTick(t => t + 1);
    });

    // Periodic sync every 4 seconds to catch new student reports and message changes
    const interval = setInterval(async () => {
      await db.syncFromBackend();
    }, 4000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  // Statistics
  const countNew = reports.filter(r => r.status === 'terkirim').length;
  const countUnread = reports.filter(r => r.status === 'terkirim' || r.unread_messages_count > 0).length;
  const countInProgress = reports.filter(r => r.status === 'ditindaklanjuti' || r.status === 'direspons').length;
  const countResolved = reports.filter(r => r.status === 'selesai').length;

  // Mood check statistics for teacher
  const teacherMoodChecks = useMemo(() => {
    if (!currentUser) return [];
    return db.getMoodChecksForTeacher(teacherProfile?.id || currentUser.id, 'all', 'today');
  }, [currentUser, teacherProfile, refreshTick]);

  const counselingMoodCount = useMemo(() => {
    return teacherMoodChecks.filter(m => m.needs_counseling).length;
  }, [teacherMoodChecks]);

  // BK Teacher Active Status (Clean toggle without daily limits)
  const isTeacherActive = teacherRecord?.is_active !== false;

  const filteredReports = useMemo(() => {
    const list = reports.filter((rep) => {
      // Guru BK Filter Scope: Default is only reports specifically chosen for this BK teacher
      if (isBK && bkFilterScope === 'my_assigned') {
        if (!isReportAssignedToCurrentBK(rep)) {
          return false;
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchCode = rep.report_code.toLowerCase().includes(term);
        const matchTitle = rep.title.toLowerCase().includes(term);
        const matchStudent = rep.student?.name.toLowerCase().includes(term);
        if (!matchCode && !matchTitle && !matchStudent) return false;
      }

      // Status
      if (filterStatus !== 'all' && rep.status !== filterStatus) return false;

      // Category
      if (filterCategory !== 'all' && rep.category_id !== filterCategory) return false;

      // Urgency
      if (filterUrgency !== 'all' && rep.urgency !== filterUrgency) return false;

      // Class
      if (filterClass !== 'all') {
        if (rep.student?.class_name !== filterClass) return false;
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
  }, [reports, searchTerm, filterCategory, filterStatus, filterUrgency, filterClass, isBK, bkFilterScope, sortBy, teacherRecord]);

  // Bulk selection helpers
  const isAllSelected = filteredReports.length > 0 && selectedReportIds.length === filteredReports.length;
  const isSomeSelected = selectedReportIds.length > 0 && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedReportIds([]);
    } else {
      setSelectedReportIds(filteredReports.map(r => r.id));
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

  // Handle Single Report Deletion
  const handleConfirmDelete = () => {
    if (!reportToDelete || !currentUser) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      db.deleteReport(reportToDelete.id, currentUser);
      const code = reportToDelete.report_code;
      setDeleteSuccessMessage(`Laporan ${code} berhasil dihapus permanen dari sistem.`);
      setSelectedReportIds(prev => prev.filter(id => id !== reportToDelete.id));
      setReportToDelete(null);
      setRefreshTick(prev => prev + 1);
      setTimeout(() => setDeleteSuccessMessage(null), 5000);
    } catch (err: any) {
      setDeleteError(err.message || 'Gagal menghapus laporan siswa.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Bulk Report Deletion
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {isBK ? 'Portal Guru Bimbingan Konseling (BK)' : `Portal Wali Kelas • ${teacherProfile?.managed_class?.name || 'Kelas'}`}
                </span>
              </div>
              {teacherProfile?.nip && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-xs font-mono">
                  <span className="text-[11px]">
                    NIP: {showNip ? decryptNip(teacherProfile.nip) : maskNip(decryptNip(teacherProfile.nip))}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNip(!showNip)}
                    title={showNip ? 'Sembunyikan NIP' : 'Tampilkan NIP'}
                    className="text-slate-300 hover:text-white p-0.5 rounded cursor-pointer transition"
                  >
                    {showNip ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Selamat bertugas, {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isBK
                ? 'Pantau laporan siswa yang membutuhkan bimbingan konseling, perundungan, maupun masalah personal dengan kerahasiaan terjaga.'
                : `Kelola aspirasi dan kendala belajar siswa perwalian kelas ${teacherProfile?.managed_class?.name || ''}.`}
            </p>
          </div>

          <div className="flex flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full xl:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('mood-check')}
              className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer group whitespace-nowrap"
            >
              <Heart className="w-4 h-4 fill-white/20 group-hover:scale-110 transition-transform shrink-0" />
              <span>Rekap Mood Siswa</span>
              {counselingMoodCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white text-rose-700 text-[10px] font-extrabold animate-pulse">
                  {counselingMoodCount} Butuh Konseling
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('announcements')}
              className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white text-slate-900 hover:bg-blue-50 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Megaphone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Pengumuman Siswa</span>
            </button>

            <div className="w-full sm:w-auto bg-white/10 border border-white/15 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left">
              <span className="text-[11px] text-blue-200 block font-medium">Kewenangan Akses:</span>
              <p className="text-xs font-bold text-white mt-0.5">
                {isBK ? 'Bimbingan Konseling & Urgensi Tinggi' : `Perwalian ${teacherProfile?.managed_class?.name || '-'}`}
              </p>
              <span className="text-[10px] text-slate-400 block mt-1">Data luar kewenangan terlindungi sistem RLS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Check Highlight Banner for Teachers */}
      <div className="bg-linear-to-r from-pink-50 via-purple-50 to-blue-50 border border-pink-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20 shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Pemantau Kesehatan Emosi & Mood Siswa
              </h2>
              {counselingMoodCount > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                  🚨 {counselingMoodCount} Siswa Memohon Konseling
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                  {teacherMoodChecks.length} Siswa Absen Hari Ini
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Lihat rekapitulasi perasaan harian siswa, emosi dominan, serta tindak lanjuti siswa yang membutuhkan sesi konseling khusus dari Guru BK.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onNavigate('mood-check')}
            className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs shadow-md shadow-pink-600/20 transition flex items-center gap-2 cursor-pointer"
          >
            <span>Buka Rekapitulasi Mood</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BK Teacher Active Status Section */}
      {isBK && teacherRecord && (
        <div
          className={`rounded-3xl p-5 sm:p-6 border shadow-xs transition-all ${
            isTeacherActive
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  isTeacherActive ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {isTeacherActive ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Status Penerimaan Laporan Bimbingan Konseling
                  </h3>
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isTeacherActive
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {isTeacherActive ? 'AKTIF (Siap Menerima Laporan)' : 'TIDAK AKTIF'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  {isTeacherActive
                    ? 'Nama Anda saat ini aktif dan dapat dipilih langsung oleh siswa dalam formulir pengaduan/konseling.'
                    : 'Status Anda sedang Tidak Aktif. Siswa tidak dapat memilih Anda saat membuat laporan baru.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (currentUser) {
                  db.setTeacherActiveStatus(currentUser.id, !isTeacherActive);
                  setRefreshTick(t => t + 1);
                }
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-center shrink-0 ${
                isTeacherActive
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isTeacherActive ? 'Nonaktifkan Sementara' : 'Aktifkan Penerimaan Laporan'}
            </button>
          </div>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <button
          type="button"
          onClick={() => {
            setFilterStatus('terkirim');
          }}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition ${
            filterStatus === 'terkirim'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400'
              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700">Laporan Baru</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{countNew}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Klik untuk filter laporan baru</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onNavigate('inbox');
          }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-xs text-left transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Belum Dibaca</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{countUnread}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Buka semua pesan di Laporan Masuk</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setFilterStatus(filterStatus === 'ditindaklanjuti' ? 'all' : 'ditindaklanjuti');
          }}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition ${
            filterStatus === 'ditindaklanjuti'
              ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-400'
              : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700">Sedang Ditindaklanjuti</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{countInProgress}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Klik untuk filter laporan proses</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setFilterStatus(filterStatus === 'selesai' ? 'all' : 'selesai');
          }}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition ${
            filterStatus === 'selesai'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Selesai</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{countResolved}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Klik untuk filter laporan tuntas</span>
        </button>
      </div>

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

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Guru BK Filter Scope Switcher */}
        {isBK && (
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  Filter Pilihan Siswa Guru BK:
                </span>
              </div>
              <div className="w-full sm:w-auto flex flex-col sm:flex-row p-1 bg-slate-200/70 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setBkFilterScope('my_assigned')}
                  className={`w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between sm:justify-center gap-1.5 cursor-pointer ${
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
                        : 'bg-slate-300/80 text-slate-700'
                    }`}
                  >
                    {myAssignedCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setBkFilterScope('all')}
                  className={`w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between sm:justify-center gap-1.5 cursor-pointer ${
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
                        : 'bg-slate-300/80 text-slate-700'
                    }`}
                  >
                    {reports.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Contextual description note */}
            <div className="text-[11px] text-slate-600 flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 flex-wrap">
              <span>
                {bkFilterScope === 'my_assigned' ? (
                  <>
                    Menampilkan laporan yang dipilihkan siswa secara khusus untuk{' '}
                    <strong className="text-blue-700">{currentUser?.name}</strong>.
                  </>
                ) : (
                  <>
                    Menampilkan seluruh laporan bimbingan konseling di sekolah ({filteredReports.length} laporan).
                  </>
                )}
              </span>
              {bkFilterScope === 'my_assigned' ? (
                <button
                  type="button"
                  onClick={() => setBkFilterScope('all')}
                  className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                >
                  Lihat Semua Laporan Siswa &rarr;
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setBkFilterScope('my_assigned')}
                  className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                >
                  Kembali ke Laporan Saya &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Daftar Laporan Masuk Siswa
            </h2>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredReports.length} laporan{' '}
              {isBK && bkFilterScope === 'my_assigned'
                ? `(Khusus pilihan siswa untuk ${currentUser?.name?.split(',')[0] || 'Anda'})`
                : '(Semua laporan sesuai hak kewenangan)'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode, judul, atau siswa..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters bar */}
        <div className={`grid gap-2 sm:gap-2.5 pt-2 border-t border-slate-100 ${
          isBK
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
        }`}>
          {isBK && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Pilihan Siswa</label>
              <select
                value={bkFilterScope}
                onChange={(e) => setBkFilterScope(e.target.value as 'my_assigned' | 'all')}
                className="w-full px-2.5 py-1.5 bg-blue-50/50 border border-blue-200 text-blue-900 font-medium rounded-xl text-xs"
              >
                <option value="my_assigned">Ditujukan ke Saya [Default]</option>
                <option value="all">Semua Laporan Siswa</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Sortir (Urutan)</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full px-2.5 py-1.5 border rounded-xl text-xs font-semibold ${
                sortBy === 'assigned_first'
                  ? 'bg-blue-50/80 border-blue-300 text-blue-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {isBK && (
                <option value="assigned_first">Guru BK Saya (Default)</option>
              )}
              <option value="newest">Waktu: Terbaru</option>
              <option value="oldest">Waktu: Terlama</option>
              <option value="urgency">Urgensi Tertinggi</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Kategori</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
            >
              <option value="all">Semua Status</option>
              <option value="terkirim">Terkirim</option>
              <option value="dibaca">Dibaca</option>
              <option value="direspons">Direspons</option>
              <option value="ditindaklanjuti">Ditindaklanjuti</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Urgensi</label>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
            >
              <option value="all">Semua Urgensi</option>
              <option value="rendah">Rendah</option>
              <option value="sedang">Sedang</option>
              <option value="tinggi">Tinggi</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Kelas</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
            >
              <option value="all">Semua Kelas</option>
              {classes.map(cl => <option key={cl.id} value={cl.name}>{cl.name}</option>)}
            </select>
          </div>
        </div>

        {/* Bulk Action Banner */}
        {selectedReportIds.length > 0 && (
          <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                {selectedReportIds.length}
              </span>
              <span className="font-bold text-blue-900">
                {selectedReportIds.length} laporan terpilih
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedReportIds([])}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition cursor-pointer"
              >
                Batalkan Pilihan
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
          </div>
        )}

        {/* Data Table (Desktop & Tablet) */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                <th className="p-3.5 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    title={isAllSelected ? 'Batalkan pilih semua' : 'Pilih semua'}
                    className="p-1 rounded text-slate-500 hover:text-blue-600 cursor-pointer"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">Kode</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Judul & Siswa</th>
                <th className="p-3.5">Kelas</th>
                <th className="p-3.5">Penerima</th>
                <th className="p-3.5">Urgensi</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Waktu</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">Tidak ada laporan yang sesuai dengan kriteria filter.</p>
                    {isBK && bkFilterScope === 'my_assigned' && (
                      <p className="text-xs text-slate-400 mt-1">
                        Belum ada laporan siswa yang ditujukan khusus ke Anda. Coba pilih filter{' '}
                        <button
                          type="button"
                          onClick={() => setBkFilterScope('all')}
                          className="text-blue-600 font-bold underline cursor-pointer"
                        >
                          Semua Laporan Siswa
                        </button>
                        .
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => {
                  const isSelected = selectedReportIds.includes(rep.id);
                  return (
                    <tr
                      key={rep.id}
                      onClick={() => onNavigate('detail', rep.id)}
                      className={`hover:bg-blue-50/40 cursor-pointer transition ${
                        isSelected ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <td
                        className="p-3.5 text-center"
                        onClick={(e) => toggleSelectOne(rep.id, e)}
                      >
                        <button
                          type="button"
                          className="p-1 rounded text-slate-500 hover:text-blue-600 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </td>

                      <td className="p-3.5 font-mono font-bold text-blue-700">
                        {rep.report_code}
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800">
                          {rep.category.name}
                        </span>
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <p className="font-bold text-slate-900 line-clamp-1">{rep.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-500">{rep.student?.name}</span>
                          <PrivacyBadge privacy={rep.privacy} />
                        </div>
                      </td>

                      <td className="p-3.5 font-medium text-slate-600 whitespace-nowrap">
                        {rep.student?.class_name || '-'}
                      </td>

                      <td className="p-3.5 text-slate-600 whitespace-nowrap">
                        {isReportAssignedToCurrentBK(rep) ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                            Ditujukan ke Anda
                          </span>
                        ) : rep.assigned_teacher?.specific_name ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                            {rep.assigned_teacher.specific_name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">
                            {rep.assigned_to === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <UrgencyBadge urgency={rep.urgency} />
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <StatusBadge status={rep.status} size="sm" />
                      </td>

                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {new Date(rep.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('detail', rep.id);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                          >
                            <span>Tanggapi</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

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
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards List (Responsive for small screens) */}
        <div className="block md:hidden space-y-3">
          {filteredReports.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="font-semibold text-slate-600 text-xs">Tidak ada laporan yang sesuai dengan kriteria filter.</p>
              {isBK && bkFilterScope === 'my_assigned' && (
                <p className="text-xs text-slate-400 mt-1">
                  Belum ada laporan siswa yang ditujukan khusus ke Anda.{' '}
                  <button
                    type="button"
                    onClick={() => setBkFilterScope('all')}
                    className="text-blue-600 font-bold underline cursor-pointer"
                  >
                    Lihat Semua Laporan Siswa
                  </button>
                </p>
              )}
            </div>
          ) : (
            filteredReports.map((rep) => {
              const isSelected = selectedReportIds.includes(rep.id);
              return (
                <div
                  key={rep.id}
                  onClick={() => onNavigate('detail', rep.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-300'
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => toggleSelectOne(rep.id, e)}
                        className="p-1 rounded text-slate-500 hover:text-blue-600 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <span className="font-mono font-bold text-blue-700 text-xs">
                        {rep.report_code}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <UrgencyBadge urgency={rep.urgency} />
                      <StatusBadge status={rep.status} size="sm" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {rep.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{rep.category.name}</span>
                      <span>•</span>
                      <span>{rep.student?.name}</span>
                      {rep.student?.class_name && (
                        <>
                          <span>•</span>
                          <span className="font-medium">{rep.student.class_name}</span>
                        </>
                      )}
                      <span>•</span>
                      <PrivacyBadge privacy={rep.privacy} />
                    </div>
                  </div>

                  {/* Teacher Assignment Badge if applicable */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-2">
                    <div>
                      {isReportAssignedToCurrentBK(rep) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                          Ditujukan ke Anda
                        </span>
                      ) : rep.assigned_teacher?.specific_name ? (
                        <span className="font-medium text-slate-600">
                          Penerima: {rep.assigned_teacher.specific_name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">
                          {rep.assigned_to === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'}
                        </span>
                      )}
                    </div>

                    <span>
                      {new Date(rep.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteError(null);
                        setReportToDelete(rep);
                      }}
                      title="Hapus Laporan Siswa"
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('detail', rep.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Tanggapi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

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
