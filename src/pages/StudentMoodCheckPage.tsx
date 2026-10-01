import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { StudentMoodCheck, MoodType } from '../types/database';
import { StudentMoodCheckCard } from '../components/StudentMoodCheckCard';

interface StudentMoodCheckPageProps {
  onNavigate?: (tab: string, id?: string) => void;
}

export const StudentMoodCheckPage: React.FC<StudentMoodCheckPageProps> = () => {
  const { currentUser, studentProfile } = useAuth();
  const [moodHistory, setMoodHistory] = useState<StudentMoodCheck[]>([]);
  const [todayMood, setTodayMood] = useState<StudentMoodCheck | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailMood, setDetailMood] = useState<StudentMoodCheck | null>(null);

  const loadMoodData = () => {
    if (!studentProfile) return;
    const today = db.getMoodCheckByStudentToday(studentProfile.id);
    setTodayMood(today || null);

    const list = db.getMoodChecksByStudent(studentProfile.id);
    setMoodHistory(list);

    // If current month has no data but list has data in another month (e.g., seed data in 2026-09), keep user's selection or default smartly
  };

  useEffect(() => {
    loadMoodData();
    db.syncFromBackend().then(loadMoodData);

    const unsub = db.subscribe(() => {
      loadMoodData();
    });

    const interval = setInterval(async () => {
      await db.syncFromBackend();
      loadMoodData();
    }, 4000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [studentProfile]);

  if (!currentUser || currentUser.role !== 'siswa' || !studentProfile) {
    return null;
  }

  const getMoodBadge = (mood: MoodType) => {
    switch (mood) {
      case 'sangat_senang':
        return {
          label: 'Sangat Senang',
          emoji: '🤩',
          score: 5,
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      case 'senang':
        return {
          label: 'Senang',
          emoji: '😊',
          score: 4,
          badgeClass: 'bg-sky-100 text-sky-800 border-sky-200'
        };
      case 'netral':
        return {
          label: 'Biasa Saja',
          emoji: '😐',
          score: 3,
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200'
        };
      case 'sedih':
        return {
          label: 'Sedih / Galau',
          emoji: '😢',
          score: 2,
          badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200'
        };
      case 'cemas':
        return {
          label: 'Cemas / Khawatir',
          emoji: '😰',
          score: 1,
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-200'
        };
      case 'marah':
        return {
          label: 'Marah / Kesal',
          emoji: '😤',
          score: 1,
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200'
        };
      default:
        return {
          label: 'Netral',
          emoji: '🙂',
          score: 3,
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200'
        };
    }
  };

  const formatDateIndo = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) return dateStr;
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Parse selectedMonth for calendar matrix
  const [year, month] = useMemo(() => {
    const parts = selectedMonth.split('-').map(Number);
    return [parts[0] || new Date().getFullYear(), parts[1] || new Date().getMonth() + 1];
  }, [selectedMonth]);

  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const daysArray = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const monthLabel = useMemo(() => {
    const dt = new Date(year, month - 1, 1);
    return dt.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }, [year, month]);

  const handlePrevMonth = () => {
    let ny = year;
    let nm = month - 1;
    if (nm < 1) {
      nm = 12;
      ny -= 1;
    }
    setSelectedMonth(`${ny}-${String(nm).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let ny = year;
    let nm = month + 1;
    if (nm > 12) {
      nm = 1;
      ny += 1;
    }
    setSelectedMonth(`${ny}-${String(nm).padStart(2, '0')}`);
  };

  const moodByDateMap = useMemo(() => {
    const map: Record<string, StudentMoodCheck> = {};
    for (const item of moodHistory) {
      map[item.date] = item;
    }
    return map;
  }, [moodHistory]);

  // Filtered table records
  const filteredHistory = useMemo(() => {
    return moodHistory.filter(item => {
      if (moodFilter !== 'all' && item.mood !== moodFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchDate = item.date.toLowerCase().includes(q);
        const matchNote = (item.note || '').toLowerCase().includes(q);
        const matchTrigger = (item.trigger || '').toLowerCase().includes(q);
        const matchEmo = item.emotions?.some(e => e.toLowerCase().includes(q)) || false;
        return matchDate || matchNote || matchTrigger || matchEmo;
      }
      return true;
    });
  }, [moodHistory, moodFilter, searchQuery]);

  // Stats
  const totalAbsensi = moodHistory.length;
  const positiveCount = moodHistory.filter(m => m.mood === 'sangat_senang' || m.mood === 'senang').length;
  const avgScore = totalAbsensi > 0
    ? (moodHistory.reduce((acc, m) => acc + (m.mood_score || getMoodBadge(m.mood).score), 0) / totalAbsensi).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
              <Heart className="w-6 h-6 text-white fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold tracking-wider text-pink-100">
                  Absensi Mood Check Siswa • {studentProfile.class_info?.name || 'SMK'}
                </span>
                {todayMood ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/30 text-white border border-white/30 uppercase">
                    ✓ Sudah Absen Hari Ini
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/30 text-white border border-white/30 uppercase">
                    Belum Absen Hari Ini
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                Mood Check & Riwayat Absensi Harian
              </h1>
              <p className="text-xs sm:text-sm text-pink-100/90 mt-1 max-w-2xl">
                Catat perasaan dan suasana hatimu setiap hari serta pantau seluruh riwayat data absensi mood check yang telah kamu lakukan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Absensi Mood</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalAbsensi} Hari</p>
          <span className="text-[11px] text-slate-400">Tercatat di sistem</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600">Status Hari Ini</span>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1.5">
            {todayMood ? `${getMoodBadge(todayMood.mood).emoji} ${getMoodBadge(todayMood.mood).label}` : 'Belum Mengisi'}
          </p>
          <span className="text-[11px] text-slate-400">
            {todayMood ? `Pukul ${todayMood.time || '-'} WIB` : 'Silakan isi di bawah'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-indigo-600">Rata-rata Skor Mood</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{avgScore} / 5.0</p>
          <span className="text-[11px] text-slate-400">Indeks suasana hati</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-sky-600">Hari Mood Positif</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{positiveCount} Hari</p>
          <span className="text-[11px] text-slate-400">Senang & sangat senang</span>
        </div>
      </div>

      {/* Form / Kartu Pengisian Absensi Mood Hari Ini */}
      <StudentMoodCheckCard />

      {/* Rekap Kalender Kehadiran Absensi Mood Bulanan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Kalender Kehadiran Absensi Mood Bulanan
            </h2>
            <p className="text-xs text-slate-500">
              Klik pada tanggal yang memiliki emoji untuk melihat detail absensi mood pada tanggal tersebut
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl bg-white hover:bg-pink-50 text-slate-700 border border-slate-200 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-extrabold text-slate-900 min-w-[125px] text-center capitalize">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl bg-white hover:bg-pink-50 text-slate-700 border border-slate-200 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-16 gap-2">
          {daysArray.map((dayNum) => {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const record = moodByDateMap[dateStr];
            const badge = record ? getMoodBadge(record.mood) : null;

            return (
              <div
                key={dayNum}
                onClick={() => record && setDetailMood(record)}
                className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                  record
                    ? 'bg-pink-50/50 border-pink-200 hover:border-pink-400 hover:shadow-xs cursor-pointer'
                    : 'bg-slate-50/60 border-slate-200/60 text-slate-400'
                }`}
                title={record ? `${dateStr}: ${badge?.label}` : `${dateStr}: Belum ada absensi`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-500">{dayNum}</span>
                <span className="text-lg mt-0.5">{record ? badge?.emoji : '—'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabel Data Absensi Mood Check yang Telah Dilakukan */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Tabel Riwayat Absensi Mood Check Saya
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200">
                  {filteredHistory.length} Data Absensi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar lengkap absensi mood harian yang telah kamu lakukan beserta status tinjauan Guru BK
              </p>
            </div>

            {/* Filter Mood */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={moodFilter}
                  onChange={(e) => setMoodFilter(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Kondisi Mood</option>
                  <option value="sangat_senang">🤩 Sangat Senang</option>
                  <option value="senang">😊 Senang</option>
                  <option value="netral">😐 Biasa Saja</option>
                  <option value="sedih">😢 Sedih / Galau</option>
                  <option value="cemas">😰 Cemas / Khawatir</option>
                  <option value="marah">😤 Marah / Kesal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tanggal, emosi, faktor pemicu, atau isi catatan..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition"
            />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50/40">
            <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Belum Ada Data Absensi Mood Check</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Silakan isi absensi mood harianmu pada kartu di atas untuk mulai mencatat riwayat suasana hatimu.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Hari & Tanggal</th>
                  <th className="py-3.5 px-4">Kondisi Mood</th>
                  <th className="py-3.5 px-4">Emosi Dirasakan</th>
                  <th className="py-3.5 px-4">Faktor Pemicu</th>
                  <th className="py-3.5 px-4">Catatan Hati</th>
                  <th className="py-3.5 px-4">Status Tinjauan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredHistory.map((item, idx) => {
                  const badge = getMoodBadge(item.mood);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setDetailMood(item)}
                      className="hover:bg-pink-50/30 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                          <span>{formatDateIndo(item.date)}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Pukul {item.time || '08:00'} WIB</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-lg">{badge.emoji}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${badge.badgeClass}`}>
                            {badge.label}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[190px]">
                          {item.emotions && item.emotions.length > 0 ? (
                            item.emotions.map((emo, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]"
                              >
                                #{emo}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700">
                          {item.trigger || '-'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {item.note ? (
                          <p className="text-slate-700 italic line-clamp-2" title={item.note}>
                            "{item.note}"
                          </p>
                        ) : (
                          <span className="text-slate-400 italic">Tidak ada catatan</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.status === 'belum_ditinjau' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Terkirim ke BK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Ditinjau Guru BK</span>
                          </span>
                        )}
                      </td>

                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setDetailMood(item)}
                          className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-600 text-pink-700 hover:text-white border border-pink-200 font-bold text-[11px] inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail Absensi Mood Check */}
      {detailMood && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-600 text-white flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-white/20" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Detail Absensi Mood Check
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {formatDateIndo(detailMood.date)} • Pukul {detailMood.time || '08:00'} WIB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetailMood(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {(() => {
                const badge = getMoodBadge(detailMood.mood);
                return (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{badge.emoji}</span>
                      <div>
                        <span className="text-[11px] text-slate-500 font-semibold block">Kondisi Suasana Hati:</span>
                        <span className={`inline-block mt-0.5 px-3 py-0.5 rounded-full text-xs font-extrabold border ${badge.badgeClass}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 font-semibold block">Skor Mood:</span>
                      <span className="text-base font-extrabold text-slate-900">
                        {detailMood.mood_score || badge.score} / 5
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Emosi */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Emosi yang Dirasakan
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {detailMood.emotions && detailMood.emotions.length > 0 ? (
                    detailMood.emotions.map((emo, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs"
                      >
                        #{emo}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </div>
              </div>

              {/* Faktor Pemicu */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Faktor Pemicu Utama
                </span>
                <p className="text-xs font-extrabold text-slate-800">
                  {detailMood.trigger || '-'}
                </p>
              </div>

              {/* Catatan Hati */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Catatan / Curhatan Kamu
                </span>
                {detailMood.note ? (
                  <p className="text-xs text-slate-800 italic leading-relaxed">
                    "{detailMood.note}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">Tidak ada catatan tertulis.</p>
                )}
              </div>

              {/* Status Tinjauan Guru BK */}
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Status Pemantauan Guru BK
                </span>
                <p className="text-xs font-bold text-emerald-950">
                  {detailMood.status === 'belum_ditinjau'
                    ? 'Terkirim & Terpantau di Portal Guru BK'
                    : `Telah Ditinjau oleh ${detailMood.reviewed_by_teacher_name || 'Guru BK'}`}
                </p>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/80 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailMood(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
