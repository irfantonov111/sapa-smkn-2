import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  User,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Search
} from 'lucide-react';
import { StudentMoodCheck, SchoolClass, MoodType } from '../../types/database';
import { db } from '../../services/db';

interface StudentMoodTimelineViewProps {
  classes: SchoolClass[];
  selectedClassId: string;
  onClassChange: (classId: string) => void;
  selectedMonth: string; // 'YYYY-MM'
  onMonthChange: (month: string) => void;
  onSelectMoodCheck: (item: StudentMoodCheck) => void;
  preselectedStudentId?: string;
}

export const StudentMoodTimelineView: React.FC<StudentMoodTimelineViewProps> = ({
  classes,
  selectedClassId,
  onClassChange,
  selectedMonth,
  onMonthChange,
  onSelectMoodCheck,
  preselectedStudentId
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(preselectedStudentId || 'all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // 'desc' = terbaru ke terlama, 'asc' = terlama ke terbaru
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [onlyNeedsCounseling, setOnlyNeedsCounseling] = useState<boolean>(false);

  // Active class
  const currentClass = useMemo(() => {
    if (selectedClassId && selectedClassId !== 'all') {
      return classes.find(c => c.id === selectedClassId) || classes[0];
    }
    return classes[0];
  }, [classes, selectedClassId]);

  // Students in class
  const studentsInClass = useMemo(() => {
    if (!currentClass) return [];
    return db.getStudentsByClassId(currentClass.id);
  }, [currentClass]);

  // Parse year & month
  const [year, month] = useMemo(() => {
    const parts = selectedMonth.split('-').map(Number);
    return [parts[0] || 2026, parts[1] || 9];
  }, [selectedMonth]);

  const monthLabel = useMemo(() => {
    const dateObj = new Date(year, month - 1, 1);
    return dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }, [year, month]);

  // Navigation helpers
  const handlePrevMonth = () => {
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  // Month list for dropdown selector
  const availableMonths = useMemo(() => {
    return [
      { value: '2026-10', label: 'Oktober 2026' },
      { value: '2026-09', label: 'September 2026' },
      { value: '2026-08', label: 'Agustus 2026' },
      { value: '2026-07', label: 'Juli 2026' }
    ];
  }, []);

  // Fetch mood checks
  const timelineRecords = useMemo(() => {
    if (!currentClass) return [];
    const allChecks = db.getMoodChecks();

    let list = allChecks.filter(m => {
      // Must be in this class
      if (m.class_id !== currentClass.id) return false;
      // Must match selected month
      if (selectedMonth && !m.date.startsWith(selectedMonth)) return false;
      // Filter by specific student if selected
      if (selectedStudentId !== 'all' && m.student_id !== selectedStudentId && m.student_user_id !== selectedStudentId) {
        return false;
      }
      // Filter by mood type
      if (moodFilter !== 'all' && m.mood !== moodFilter) return false;
      // Filter counseling
      if (onlyNeedsCounseling && !m.needs_counseling) return false;

      return true;
    });

    // Sort order
    list.sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const timeB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [currentClass, selectedMonth, selectedStudentId, moodFilter, onlyNeedsCounseling, sortOrder]);

  // Selected student details (if single student selected)
  const activeStudentInfo = useMemo(() => {
    if (selectedStudentId === 'all') return null;
    return studentsInClass.find(s => s.id === selectedStudentId || s.user_id === selectedStudentId);
  }, [selectedStudentId, studentsInClass]);

  // Monthly summary stats for active view
  const monthlyStats = useMemo(() => {
    const total = timelineRecords.length;
    if (total === 0) {
      return { total: 0, avgScore: '0', counselingCount: 0, positiveCount: 0, attentionCount: 0 };
    }

    const sumScore = timelineRecords.reduce((acc, m) => acc + (m.mood_score || 3), 0);
    const avgScore = (sumScore / total).toFixed(1);
    const counselingCount = timelineRecords.filter(m => m.needs_counseling).length;
    const positiveCount = timelineRecords.filter(m => m.mood === 'sangat_senang' || m.mood === 'senang').length;
    const attentionCount = timelineRecords.filter(m => m.mood === 'sedih' || m.mood === 'cemas' || m.mood === 'marah').length;

    return { total, avgScore, counselingCount, positiveCount, attentionCount };
  }, [timelineRecords]);

  const getMoodBadge = (mood: MoodType) => {
    switch (mood) {
      case 'sangat_senang':
        return {
          emoji: '🤩',
          label: 'Sangat Senang',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          score: 5
        };
      case 'senang':
        return {
          emoji: '😊',
          label: 'Senang',
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500',
          score: 4
        };
      case 'netral':
        return {
          emoji: '😐',
          label: 'Netral',
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          score: 3
        };
      case 'sedih':
        return {
          emoji: '😢',
          label: 'Sedih / Lesu',
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          score: 2
        };
      case 'cemas':
        return {
          emoji: '😰',
          label: 'Cemas / Khawatir',
          badge: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          score: 1
        };
      case 'marah':
        return {
          emoji: '😡',
          label: 'Kesal / Marah',
          badge: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          score: 1
        };
      default:
        return {
          emoji: '😐',
          label: 'Netral',
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          score: 3
        };
    }
  };

  const formatIndonesianDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (!currentClass) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        <p className="font-bold text-sm">Tidak ada kelas binaan yang dapat ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Filter & Month Switcher Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1.5 border border-indigo-200">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Linimasa Kronologis Emosi</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Linimasa Mood Siswa (Sortir per Bulan)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Analisis riwayat emosi siswa dari hari ke hari dengan narasi curhat, pemicu masalah, dan catatan bimbingan konseling.
            </p>
          </div>

          {/* Month Navigation Controls */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 shadow-2xs transition cursor-pointer"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Month Dropdown */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-indigo-500 cursor-pointer text-center"
              >
                {availableMonths.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 shadow-2xs transition cursor-pointer"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          {/* Class Select */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Rombel / Kelas
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={currentClass.id}
                onChange={(e) => {
                  onClassChange(e.target.value);
                  setSelectedStudentId('all');
                }}
                className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none w-full cursor-pointer"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Select */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Fokus Siswa
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none w-full cursor-pointer"
              >
                <option value="all">Semua Siswa di Kelas ({studentsInClass.length})</option>
                {studentsInClass.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.nis})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mood Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Kondisi Mood
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <Smile className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none w-full cursor-pointer"
              >
                <option value="all">Semua Jenis Mood</option>
                <option value="sangat_senang">🤩 Sangat Senang</option>
                <option value="senang">😊 Senang</option>
                <option value="netral">😐 Netral</option>
                <option value="sedih">😢 Sedih</option>
                <option value="cemas">😰 Cemas</option>
                <option value="marah">😡 Marah</option>
              </select>
            </div>
          </div>

          {/* Sort Order & Urgent Toggle */}
          <div className="flex items-center gap-2 pt-2 sm:pt-5">
            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Ubah urutan tanggal linimasa"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'Terbaru Dulu' : 'Terlama Dulu'}</span>
            </button>

            <button
              type="button"
              onClick={() => setOnlyNeedsCounseling(prev => !prev)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                onlyNeedsCounseling
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Hanya tampilkan siswa butuh konseling"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Darurat</span>
            </button>
          </div>
        </div>

        {/* Monthly Summary Statistics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <div>
              <span className="text-[10px] text-indigo-900 font-bold block">Absensi Tercatat:</span>
              <p className="font-extrabold text-slate-900 text-sm">{monthlyStats.total} Catatan</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <div>
              <span className="text-[10px] text-indigo-900 font-bold block">Rata Skor Emosi:</span>
              <p className="font-extrabold text-slate-900 text-sm">{monthlyStats.avgScore} / 5</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <div>
              <span className="text-[10px] text-emerald-800 font-bold block">Mood Positif:</span>
              <p className="font-extrabold text-emerald-900 text-sm">{monthlyStats.positiveCount} Hari</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <div>
              <span className="text-[10px] text-rose-800 font-bold block">Permohonan Konseling:</span>
              <p className="font-extrabold text-rose-900 text-sm">{monthlyStats.counselingCount} Siswa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Student Banner (if single student filtered) */}
      {activeStudentInfo && (
        <div className="p-4 rounded-2xl bg-white border border-blue-200 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <img
              src={activeStudentInfo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={activeStudentInfo.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-400/20"
            />
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">{activeStudentInfo.name}</h4>
              <p className="text-xs text-slate-500 font-mono">
                NIS: {activeStudentInfo.nis} • Kelas: {activeStudentInfo.class_name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedStudentId('all')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
          >
            Tampilkan Semua Siswa
          </button>
        </div>
      )}

      {/* Timeline List of Mood Checks */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Linimasa Mood Siswa • {monthLabel}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
              {timelineRecords.length} Catatan
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            Urutan: {sortOrder === 'desc' ? 'Terbaru ke Terlama' : 'Terlama ke Terbaru'}
          </span>
        </div>

        {timelineRecords.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Calendar className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
            <p className="text-sm font-bold text-slate-600">Tidak ada catatan mood pada periode ini</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Belum ada data mood check yang diinput oleh siswa pada bulan {monthLabel} dengan filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 space-y-6">
            {timelineRecords.map((item) => {
              const moodInfo = getMoodBadge(item.mood);

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Circle Node */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white border-2 flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                      item.needs_counseling
                        ? 'border-rose-500 ring-4 ring-rose-100'
                        : 'border-slate-300'
                    }`}
                  >
                    <span className="text-xs">{moodInfo.emoji}</span>
                  </div>

                  {/* Timeline Card */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all space-y-3.5">
                    {/* Header Card: Student Info & Date/Time */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={item.student_name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {item.student_name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-600">
                              {item.class_name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            NIS: {item.student_nis}
                          </span>
                        </div>
                      </div>

                      {/* Date and Time Badge */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatIndonesianDate(item.date)}</span>
                          {item.time && <span className="font-mono text-slate-400">• {item.time} WIB</span>}
                        </div>
                      </div>
                    </div>

                    {/* Mood Details & Score */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{moodInfo.emoji}</span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Kondisi Emosi:
                          </span>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${moodInfo.badge}`}>
                            {moodInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Mood Score Bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500">Skor:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`w-2.5 h-2.5 rounded-full ${
                                star <= (item.mood_score || moodInfo.score)
                                  ? moodInfo.dot
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {item.mood_score || moodInfo.score}/5
                        </span>
                      </div>

                      {/* Counseling Request Alert Badge */}
                      {item.needs_counseling && (
                        <div className="px-3 py-1 rounded-xl bg-rose-100 border border-rose-200 text-rose-800 text-xs font-extrabold flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>🚨 Memohon Bimbingan Konseling</span>
                        </div>
                      )}
                    </div>

                    {/* Emotion Tags & Trigger */}
                    <div className="space-y-2">
                      {item.emotions && item.emotions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-400 mr-1">Perasaan:</span>
                          {item.emotions.map((e, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs"
                            >
                              #{e}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.trigger && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span className="font-bold text-slate-400 text-[11px]">Pemicu:</span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200 text-[11px]">
                            {item.trigger}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Student Note / Curhatan */}
                    {item.note && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                        <span className="font-bold text-[11px] text-slate-400 block mb-0.5">
                          Catatan / Curhatan Siswa:
                        </span>
                        <p className="italic font-medium">"{item.note}"</p>
                      </div>
                    )}

                    {/* Follow-up / BK Notes & Review Action */}
                    <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        {item.status === 'belum_ditinjau' ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Menunggu Review Bimbingan</span>
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>
                                {item.status === 'dalam_tindak_lanjut' ? 'Dalam Tindak Lanjut' : 'Sudah Ditinjau'}
                              </span>
                              {item.reviewed_by_teacher_name && (
                                <span className="text-slate-500 font-normal">oleh {item.reviewed_by_teacher_name}</span>
                              )}
                            </span>

                            {item.teacher_notes && (
                              <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 mt-1">
                                <span className="font-bold text-slate-700">Catatan Guru BK: </span>
                                {item.teacher_notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => onSelectMoodCheck(item)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{item.status === 'belum_ditinjau' ? 'Tinjau & Tindak Lanjut' : 'Perbarui Catatan'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
