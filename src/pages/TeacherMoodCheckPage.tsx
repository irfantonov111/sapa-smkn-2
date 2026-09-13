import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  UserCheck,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowUpDown,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  RefreshCw,
  Shield,
  Eye,
  BookOpen,
  CalendarDays,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { StudentMoodCheck, MoodType, SchoolClass } from '../types/database';
import { MoodDayAttendanceGrid } from '../components/mood/MoodDayAttendanceGrid';
import { StudentMoodTimelineView } from '../components/mood/StudentMoodTimelineView';
import { TablePagination, ResponsiveTableContainer } from '../components/common/TablePagination';

interface TeacherMoodCheckPageProps {
  onNavigate?: (tab: string, reportId?: string) => void;
}

export const TeacherMoodCheckPage: React.FC<TeacherMoodCheckPageProps> = ({ onNavigate }) => {
  const { currentUser, teacherProfile } = useAuth();

  // Active view tab: 'rekap_harian' | 'absensi_harian' | 'linimasa_bulanan'
  const [activeViewMode, setActiveViewMode] = useState<'rekap_harian' | 'absensi_harian' | 'linimasa_bulanan'>('rekap_harian');

  // Month state for attendance and timeline: 'YYYY-MM'
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [timelineStudentId, setTimelineStudentId] = useState<string>('all');

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('today');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'needs_counseling' | 'belum_ditinjau'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moodRecords, setMoodRecords] = useState<StudentMoodCheck[]>([]);
  const [availableClasses, setAvailableClasses] = useState<SchoolClass[]>([]);

  // Pagination & Sort
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'score_asc' | 'score_desc'>('newest');

  // Modal inspection state
  const [activeItem, setActiveItem] = useState<StudentMoodCheck | null>(null);
  const [teacherNoteInput, setTeacherNoteInput] = useState<string>('');
  const [reviewStatusInput, setReviewStatusInput] = useState<'sudah_ditinjau' | 'dalam_tindak_lanjut'>('sudah_ditinjau');
  const [isSavingReview, setIsSavingReview] = useState<boolean>(false);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);
  const [studentHistory, setStudentHistory] = useState<StudentMoodCheck[]>([]);

  const loadData = () => {
    if (!currentUser) return;
    const teacherId = teacherProfile?.id || currentUser.id;
    const classes = db.getClassesForTeacher(teacherId);
    setAvailableClasses(classes);

    const records = db.getMoodChecksForTeacher(
      teacherId,
      selectedClass,
      selectedDateFilter
    );
    setMoodRecords(records);
  };

  useEffect(() => {
    loadData();
  }, [currentUser, teacherProfile, selectedClass, selectedDateFilter]);

  // When active item is opened for inspection
  useEffect(() => {
    if (activeItem) {
      setTeacherNoteInput(activeItem.teacher_notes || '');
      setReviewStatusInput(activeItem.status === 'dalam_tindak_lanjut' ? 'dalam_tindak_lanjut' : 'sudah_ditinjau');
      const hist = db.getMoodChecksByStudent(activeItem.student_id);
      setStudentHistory(hist);
    }
  }, [activeItem]);

  // Filter records based on search and status
  const filteredRecords = useMemo(() => {
    return moodRecords.filter((item) => {
      // Status filter
      if (selectedStatusFilter === 'needs_counseling' && !item.needs_counseling) {
        return false;
      }
      if (selectedStatusFilter === 'belum_ditinjau' && item.status !== 'belum_ditinjau') {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.student_name.toLowerCase().includes(q);
        const matchNis = item.student_nis.toLowerCase().includes(q);
        const matchClass = item.class_name.toLowerCase().includes(q);
        const matchNote = item.note?.toLowerCase().includes(q) || false;
        const matchEmotions = item.emotions?.some(e => e.toLowerCase().includes(q)) || false;
        return matchName || matchNis || matchClass || matchNote || matchEmotions;
      }

      return true;
    });
  }, [moodRecords, selectedStatusFilter, searchQuery]);

  // Sorted records
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = new Date(`${a.date}T${a.time || '00:00'}:00`).getTime();
        const timeB = new Date(`${b.date}T${b.time || '00:00'}:00`).getTime();
        return timeB - timeA;
      }
      if (sortBy === 'oldest') {
        const timeA = new Date(`${a.date}T${a.time || '00:00'}:00`).getTime();
        const timeB = new Date(`${b.date}T${b.time || '00:00'}:00`).getTime();
        return timeA - timeB;
      }
      if (sortBy === 'name_asc') {
        return a.student_name.localeCompare(b.student_name, 'id');
      }
      if (sortBy === 'name_desc') {
        return b.student_name.localeCompare(a.student_name, 'id');
      }
      if (sortBy === 'score_asc') {
        return (a.mood_score || 3) - (b.mood_score || 3);
      }
      if (sortBy === 'score_desc') {
        return (b.mood_score || 3) - (a.mood_score || 3);
      }
      return 0;
    });
  }, [filteredRecords, sortBy]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    if (pageSize === 'all') return sortedRecords;
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  // Quick statistics
  const stats = useMemo(() => {
    const total = moodRecords.length;
    const counselingRequests = moodRecords.filter(m => m.needs_counseling).length;
    const unreviewed = moodRecords.filter(m => m.status === 'belum_ditinjau').length;
    const avgScore = total > 0
      ? (moodRecords.reduce((acc, m) => acc + (m.mood_score || 3), 0) / total).toFixed(1)
      : '0.0';

    const countHappy = moodRecords.filter(m => m.mood === 'sangat_senang' || m.mood === 'senang').length;
    const countNeutral = moodRecords.filter(m => m.mood === 'netral').length;
    const countAttention = moodRecords.filter(m => m.mood === 'sedih' || m.mood === 'cemas' || m.mood === 'marah').length;

    return {
      total,
      counselingRequests,
      unreviewed,
      avgScore,
      countHappy,
      countNeutral,
      countAttention
    };
  }, [moodRecords]);

  const handleSaveReview = () => {
    if (!activeItem || !currentUser) return;
    setIsSavingReview(true);
    setReviewFeedback(null);

    try {
      const res = db.reviewMoodCheck(
        activeItem.id,
        teacherProfile?.id || currentUser.id,
        teacherNoteInput.trim(),
        reviewStatusInput
      );

      if (res.success) {
        setReviewFeedback('Catatan bimbingan berhasil disimpan.');
        loadData();
        // Update local activeItem
        setActiveItem(prev => prev ? {
          ...prev,
          status: reviewStatusInput,
          needs_counseling: reviewStatusInput === 'sudah_ditinjau' ? false : prev.needs_counseling,
          teacher_notes: teacherNoteInput.trim(),
          reviewed_at: new Date().toISOString(),
          reviewed_by_teacher_name: currentUser.name
        } : null);

        setTimeout(() => {
          setReviewFeedback(null);
        }, 2000);
      }
    } catch {
      setReviewFeedback('Gagal menyimpan catatan bimbingan.');
    } finally {
      setIsSavingReview(false);
    }
  };

  const getMoodBadge = (mood: MoodType) => {
    switch (mood) {
      case 'sangat_senang':
        return {
          label: 'Sangat Senang',
          emoji: '🤩',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      case 'senang':
        return {
          label: 'Senang',
          emoji: '😊',
          badgeClass: 'bg-sky-100 text-sky-800 border-sky-200'
        };
      case 'netral':
        return {
          label: 'Biasa Saja',
          emoji: '😐',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200'
        };
      case 'sedih':
        return {
          label: 'Sedih / Murung',
          emoji: '😢',
          badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200'
        };
      case 'cemas':
        return {
          label: 'Cemas / Gelisah',
          emoji: '😰',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-200'
        };
      case 'marah':
        return {
          label: 'Marah / Kesal',
          emoji: '😤',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200'
        };
      default:
        return {
          label: 'Netral',
          emoji: '🙂',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-linear-to-r from-pink-600 via-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white inline-block">
                Layanan Bimbingan Konseling
              </span>
              <span className="text-[11px] font-medium text-pink-100">
                {teacherProfile?.teacher_type === 'guru_bk' ? 'Portal Guru BK' : 'Portal Wali Kelas'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Rekapitulasi Mood Check Siswa
            </h1>
            <p className="text-sm text-pink-100/90 mt-1 max-w-2xl">
              Pemantau kesehatan psikologis dan perasaan harian khusus untuk{' '}
              <strong className="underline decoration-pink-300 font-extrabold">{availableClasses.length} kelas binaan</strong> yang Anda ampu di sekolah. Deteksi dini siswa yang membutuhkan pendampingan atau konseling individual.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={loadData}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-xs transition flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notice if no classes assigned */}
      {availableClasses.length === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold">Belum Ada Kelas Binaan yang Ditugaskan</p>
            <p className="text-amber-800 text-[11px] mt-0.5">
              Guru hanya dapat melihat mood check dari siswa pada kelas yang diampunya. Akun Anda belum terdaftar mengampu kelas manapun. Silakan hubungi Administrator Sistem jika terdapat kekeliruan penugasan rombel.
            </p>
          </div>
        </div>
      )}

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Absen Mood</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{stats.total}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Sesuai rentang filter aktif</span>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xs transition ${
          stats.counselingRequests > 0
            ? 'bg-amber-50/70 border-amber-300'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Permintaan Konseling</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-2">{stats.counselingRequests}</p>
          <span className="text-[11px] text-amber-800 mt-0.5 block font-medium">Siswa memohon diajak bicara</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600">Perlu Perhatian Khusus</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Frown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{stats.countAttention}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Sedih, cemas, atau marah</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600">Kondisi Positif / Baik</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{stats.countHappy}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Senang & sangat senang</span>
        </div>
      </div>

      {/* 3 Navigational View Modes */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveViewMode('rekap_harian')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
            activeViewMode === 'rekap_harian'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Daftar Rekapitulasi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveViewMode('absensi_harian')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
            activeViewMode === 'absensi_harian'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <CalendarDays className="w-4 h-4 text-blue-600" />
          <span>Absensi Hari ke Hari</span>
          <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Matriks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveViewMode('linimasa_bulanan')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
            activeViewMode === 'linimasa_bulanan'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span>Linimasa Mood Siswa</span>
          <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">Per Bulan</span>
        </button>
      </div>

      {/* VIEW MODE 1: Absensi Hari ke Hari (Matriks Kalender Bulanan) */}
      {activeViewMode === 'absensi_harian' && (
        <MoodDayAttendanceGrid
          classes={availableClasses}
          selectedClassId={selectedClass === 'all' ? availableClasses[0]?.id || '' : selectedClass}
          onClassChange={(clsId) => setSelectedClass(clsId)}
          selectedMonth={selectedMonth}
          onMonthChange={(m) => setSelectedMonth(m)}
          onSelectMoodCheck={(item) => setActiveItem(item)}
        />
      )}

      {/* VIEW MODE 2: Linimasa Mood Siswa (Sortir per Bulan) */}
      {activeViewMode === 'linimasa_bulanan' && (
        <StudentMoodTimelineView
          classes={availableClasses}
          selectedClassId={selectedClass === 'all' ? availableClasses[0]?.id || '' : selectedClass}
          onClassChange={(clsId) => setSelectedClass(clsId)}
          selectedMonth={selectedMonth}
          onMonthChange={(m) => setSelectedMonth(m)}
          onSelectMoodCheck={(item) => setActiveItem(item)}
          preselectedStudentId={timelineStudentId}
        />
      )}

      {/* VIEW MODE 3: Daftar Rekapitulasi Tabel / Kartu Standar */}
      {activeViewMode === 'rekap_harian' && (
        <>
          {/* Filter and Search Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama siswa, NIS, kelas, atau kata emosi..."
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
                {/* Class Filter */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-500">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="bg-transparent border-none p-0 text-xs font-semibold text-slate-700 focus:outline-none w-full cursor-pointer"
                  >
                    <option value="all">Semua Kelas yang Diampu ({availableClasses.length})</option>
                    {availableClasses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={selectedDateFilter}
                    onChange={(e) => setSelectedDateFilter(e.target.value)}
                    className="bg-transparent border-none p-0 text-xs font-semibold text-slate-700 focus:outline-none w-full cursor-pointer"
                  >
                    <option value="today">Hari Ini</option>
                    <option value="7days">7 Hari Terakhir</option>
                    <option value="30days">30 Hari Terakhir</option>
                    <option value="month:2026-09">Bulan Ini (Sep 2026)</option>
                    <option value="month:2026-08">Bulan Lalu (Agu 2026)</option>
                    <option value="all">Semua Waktu</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-500">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                    className="bg-transparent border-none p-0 text-xs font-semibold text-slate-700 focus:outline-none w-full cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="needs_counseling">🚨 Butuh Konseling</option>
                    <option value="belum_ditinjau">Belum Ditinjau</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sort and Page Size Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Urutkan:</span>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none p-0 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Terbaru (Tanggal & Jam)</option>
                    <option value="oldest">Terlama</option>
                    <option value="score_asc">Mood Terendah (Butuh Perhatian)</option>
                    <option value="score_desc">Mood Tertinggi</option>
                    <option value="name_asc">Nama Siswa (A - Z)</option>
                    <option value="name_desc">Nama Siswa (Z - A)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Tampilkan per Halaman:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                    setPageSize(val as any);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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

          {/* Table / List of Mood Checks */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Daftar Rekapitulasi Mood Siswa
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                  {sortedRecords.length} Data
                </span>
              </div>

              <p className="text-xs text-slate-500 hidden sm:block">
                Klik baris siswa untuk melihat riwayat lengkap & menulis catatan bimbingan
              </p>
            </div>

            {sortedRecords.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Tidak ada data mood check yang sesuai
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Belum ada siswa yang melakukan absensi mood check pada filter yang dipilih atau pencarian tidak menemukan hasil.
                </p>
              </div>
            ) : (
              <div>
                <ResponsiveTableContainer tableId="teacher-mood-table" maxHeight="600px" minWidth="640px">
                  <div className="divide-y divide-slate-100">
                    {paginatedRecords.map((item) => {
                  const moodInfo = getMoodBadge(item.mood);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveItem(item)}
                      className={`p-4 sm:p-5 hover:bg-slate-50/80 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        item.needs_counseling ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Student info */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <img
                          src={item.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={item.student_name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 shrink-0 mt-0.5"
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-extrabold text-slate-900">
                              {item.student_name}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              {item.class_name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              NIS: {item.student_nis}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{item.date}</span>
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{item.time || '08:00'}</span>
                            </span>
                            {item.trigger && (
                              <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                Faktor: {item.trigger}
                              </span>
                            )}
                          </div>

                          {/* Student's personal note */}
                          {item.note && (
                            <p className="text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-200/80 italic line-clamp-1 max-w-xl">
                              "{item.note}"
                            </p>
                          )}

                          {/* Emotion chips */}
                          {item.emotions && item.emotions.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {item.emotions.map((emo, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                                >
                                  #{emo}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mood Status & Action Badge */}
                      <div className="flex items-center gap-3 sm:self-center shrink-0 justify-between sm:justify-end">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-2xl">{moodInfo.emoji}</span>
                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${moodInfo.badgeClass}`}>
                              {moodInfo.label}
                            </span>
                          </div>

                          {item.needs_counseling && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                              🚨 Memohon Konseling
                            </span>
                          )}

                          {item.status === 'belum_ditinjau' ? (
                            <span className="text-[10px] text-slate-400">
                              Belum ditinjau Guru BK
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{item.status === 'dalam_tindak_lanjut' ? 'Dalam Tindak Lanjut' : 'Sudah Ditinjau'}</span>
                            </span>
                          )}
                        </div>

                        {/* Quick Timeline Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTimelineStudentId(item.student_id);
                            setActiveViewMode('linimasa_bulanan');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Buka linimasa mood siswa"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Linimasa</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveItem(item);
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ResponsiveTableContainer>

            <TablePagination
              currentPage={currentPage}
              totalItems={sortedRecords.length}
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
        </>
      )}

      {/* Modal Detail & Review Mood Siswa */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 space-y-5 p-6 animate-in zoom-in-95 duration-150">
            {/* Modal Top Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <img
                  src={activeItem.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={activeItem.student_name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {activeItem.student_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeItem.class_name} • NIS: <span className="font-mono">{activeItem.student_nis}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Detail Mood Check Hari Ini */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Kondisi Mood Tercatat
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {activeItem.date} {activeItem.time ? `• ${activeItem.time} WIB` : ''}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{getMoodBadge(activeItem.mood).emoji}</span>
                    <div>
                      <span className="text-xs text-slate-500 block">Kondisi:</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {getMoodBadge(activeItem.mood).label}
                      </span>
                    </div>
                  </div>

                  {activeItem.needs_counseling && (
                    <div className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Siswa Memohon Konseling</span>
                    </div>
                  )}
                </div>

                {/* Emotion Tags */}
                {activeItem.emotions && activeItem.emotions.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      Rasa Emosi yang Dipilih:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeItem.emotions.map((e, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs"
                        >
                          #{e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trigger */}
                {activeItem.trigger && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                      Faktor Pemicu Utama:
                    </span>
                    <p className="text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
                      {activeItem.trigger}
                    </p>
                  </div>
                )}

                {/* Student's Note */}
                {activeItem.note && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                      Catatan / Curhatan Siswa:
                    </span>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                      "{activeItem.note}"
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Riwayat Mood Siswa Beberapa Hari Terakhir */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Tren & Riwayat Mood Siswa ({studentHistory.length} catatan)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTimelineStudentId(activeItem.student_id);
                    setActiveViewMode('linimasa_bulanan');
                    setActiveItem(null);
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Buka Linimasa Lengkap</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 max-h-36 overflow-y-auto space-y-1.5">
                {studentHistory.map((h) => {
                  const mBadge = getMoodBadge(h.mood);
                  return (
                    <div
                      key={h.id}
                      className="p-2 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span>{mBadge.emoji}</span>
                        <span className="font-bold text-slate-800">{mBadge.label}</span>
                        <span className="text-[11px] text-slate-400">• {h.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {h.needs_counseling && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            Butuh Konseling
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">{h.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Tindak Lanjut Guru BK */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Catatan Tindak Lanjut & Bimbingan Guru BK
              </span>

              {reviewFeedback && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reviewFeedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Tindak Lanjut:
                  </label>
                  <select
                    value={reviewStatusInput}
                    onChange={(e) => setReviewStatusInput(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="sudah_ditinjau">Sudah Ditinjau & Terpantau Baik</option>
                    <option value="dalam_tindak_lanjut">Jadwalkan / Dalam Tindak Lanjut Konseling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Petugas Peninjau:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.name}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Privat Guru BK (Internal):
                </label>
                <textarea
                  value={teacherNoteInput}
                  onChange={(e) => setTeacherNoteInput(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Siswa dipanggil ke ruang BK pada jam istirahat untuk mendiskusikan rasa cemas menjelang ujian akhir..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                >
                  Tutup
                </button>

                <button
                  type="button"
                  disabled={isSavingReview}
                  onClick={handleSaveReview}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSavingReview ? 'Menyimpan...' : 'Simpan Catatan Bimbingan'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
