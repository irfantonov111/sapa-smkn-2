import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Info,
  AlertTriangle,
  Smile,
  Heart,
  User,
  Filter
} from 'lucide-react';
import { StudentMoodCheck, SchoolClass, MoodType } from '../../types/database';
import { db } from '../../services/db';

interface MoodDayAttendanceGridProps {
  classes: SchoolClass[];
  selectedClassId: string;
  onClassChange: (classId: string) => void;
  selectedMonth: string; // Format 'YYYY-MM'
  onMonthChange: (month: string) => void;
  onSelectMoodCheck: (item: StudentMoodCheck) => void;
}

export const MoodDayAttendanceGrid: React.FC<MoodDayAttendanceGridProps> = ({
  classes,
  selectedClassId,
  onClassChange,
  selectedMonth,
  onMonthChange,
  onSelectMoodCheck
}) => {
  const [studentSearch, setStudentSearch] = useState('');

  // Parse year and month
  const [year, month] = useMemo(() => {
    const parts = selectedMonth.split('-').map(Number);
    return [parts[0] || 2026, parts[1] || 9];
  }, [selectedMonth]);

  // Number of days in this month
  const daysInMonth = useMemo(() => {
    return new Date(year, month, 0).getDate();
  }, [year, month]);

  // Days array: [1, 2, 3, ..., daysInMonth]
  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  // Month navigation helpers
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

  const monthLabel = useMemo(() => {
    const dateObj = new Date(year, month - 1, 1);
    return dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }, [year, month]);

  // Active class
  const currentClass = useMemo(() => {
    if (selectedClassId && selectedClassId !== 'all') {
      return classes.find(c => c.id === selectedClassId) || classes[0];
    }
    return classes[0];
  }, [classes, selectedClassId]);

  // Fetch students in this class
  const studentsInClass = useMemo(() => {
    if (!currentClass) return [];
    return db.getStudentsByClassId(currentClass.id);
  }, [currentClass]);

  // Filter students by search
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return studentsInClass;
    const q = studentSearch.toLowerCase().trim();
    return studentsInClass.filter(s =>
      s.name.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q)
    );
  }, [studentsInClass, studentSearch]);

  // Fetch all mood checks in this class for this month
  const classMoodChecks = useMemo(() => {
    if (!currentClass) return [];
    const allChecks = db.getMoodChecks();
    return allChecks.filter(m => m.class_id === currentClass.id && m.date.startsWith(selectedMonth));
  }, [currentClass, selectedMonth]);

  // Student mood map: studentId -> { 'YYYY-MM-DD': StudentMoodCheck }
  const studentMoodMap = useMemo(() => {
    const map: Record<string, Record<string, StudentMoodCheck>> = {};
    for (const check of classMoodChecks) {
      if (!map[check.student_id]) {
        map[check.student_id] = {};
      }
      map[check.student_id][check.date] = check;
    }
    return map;
  }, [classMoodChecks]);

  // Helper for mood emoji and color
  const getMoodVisual = (mood: MoodType) => {
    switch (mood) {
      case 'sangat_senang':
        return { emoji: '🤩', bg: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300', label: 'Sangat Senang' };
      case 'senang':
        return { emoji: '😊', bg: 'bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300', label: 'Senang' };
      case 'netral':
        return { emoji: '😐', bg: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300', label: 'Netral' };
      case 'sedih':
        return { emoji: '😢', bg: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300', label: 'Sedih' };
      case 'cemas':
        return { emoji: '😰', bg: 'bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300', label: 'Cemas' };
      case 'marah':
        return { emoji: '😡', bg: 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300', label: 'Marah' };
      default:
        return { emoji: '•', bg: 'bg-slate-50 text-slate-400 border-slate-200', label: 'Absen' };
    }
  };

  // Class monthly stats
  const classStats = useMemo(() => {
    const totalFilled = classMoodChecks.length;
    const counselingRequests = classMoodChecks.filter(m => m.needs_counseling).length;
    const totalStudents = studentsInClass.length;
    const avgScore = totalFilled > 0
      ? (classMoodChecks.reduce((acc, m) => acc + (m.mood_score || 3), 0) / totalFilled).toFixed(1)
      : '-';

    return {
      totalFilled,
      counselingRequests,
      totalStudents,
      avgScore
    };
  }, [classMoodChecks, studentsInClass]);

  if (!currentClass) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        <p className="font-bold text-sm">Tidak ada kelas yang dapat ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Controls: Class Selector, Month Navigation, & Search */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1.5 border border-blue-200">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Matriks Absensi Harian Siswa</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Absensi Mood Siswa dari Hari ke Hari
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau kepatuhan pengisian mood check serta kondisi psikologis tiap siswa per tanggal sepanjang bulan.
            </p>
          </div>

          {/* Month Switcher Controls */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shadow-2xs transition cursor-pointer"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3 py-1 text-center min-w-[140px]">
              <span className="text-xs font-bold text-slate-900 block capitalize">
                {monthLabel}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {daysInMonth} Hari Kalender
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shadow-2xs transition cursor-pointer"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar: Select Class & Student Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Pilih Rombel / Kelas Binaan
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={currentClass.id}
                onChange={(e) => onClassChange(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none w-full cursor-pointer"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({studentsInClass.length} Siswa Terdaftar)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Cari Nama atau NIS Siswa
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Ketik nama siswa..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Quick Month Metrics */}
          <div className="sm:col-span-2 md:col-span-1 flex items-center justify-between sm:justify-end gap-3 px-3 py-2 bg-blue-50/50 rounded-xl border border-blue-200/80 text-xs">
            <div>
              <span className="text-[10px] text-blue-700 font-bold block">Total Absensi Mood:</span>
              <p className="font-extrabold text-slate-900 text-sm">{classStats.totalFilled} Terisi</p>
            </div>
            <div className="h-6 w-px bg-blue-200" />
            <div>
              <span className="text-[10px] text-amber-700 font-bold block">Konseling:</span>
              <p className="font-extrabold text-amber-900 text-sm">{classStats.counselingRequests} Permohonan</p>
            </div>
            <div className="h-6 w-px bg-blue-200" />
            <div>
              <span className="text-[10px] text-slate-600 font-bold block">Rata Skor:</span>
              <p className="font-extrabold text-blue-900 text-sm">{classStats.avgScore} / 5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Day-by-Day Grid Matrix */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-900">
              Matriks Tanggal: {currentClass.name} • {monthLabel}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
              {filteredStudents.length} Siswa
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            * Klik sel bertanda emoji untuk membuka rincian emosi & catatan siswa
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-xs font-semibold">Tidak ada siswa yang sesuai kriteria pencarian di kelas ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500">
                  <th className="p-3 w-10 text-center sticky left-0 bg-slate-50 z-20 shadow-xs">No</th>
                  <th className="p-3 min-w-[180px] sm:min-w-[220px] sticky left-10 bg-slate-50 z-20 shadow-xs">
                    Nama Siswa & NIS
                  </th>
                  {daysArray.map((dayNum) => {
                    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const dayDate = new Date(year, month - 1, dayNum);
                    const isSunday = dayDate.getDay() === 0;
                    const isSaturday = dayDate.getDay() === 6;

                    return (
                      <th
                        key={dayNum}
                        className={`p-2 w-10 text-center border-l border-slate-200/60 select-none ${
                          isSunday
                            ? 'bg-rose-50 text-rose-600'
                            : isSaturday
                            ? 'bg-amber-50 text-amber-600'
                            : 'text-slate-600'
                        }`}
                        title={dateStr}
                      >
                        <span className="block text-[11px] font-extrabold">{dayNum}</span>
                        <span className="block text-[9px] font-normal uppercase">
                          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][dayDate.getDay()]}
                        </span>
                      </th>
                    );
                  })}
                  <th className="p-3 text-center bg-slate-50 border-l border-slate-200 min-w-[90px]">
                    Rekap
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStudents.map((student, idx) => {
                  const studentRecords = studentMoodMap[student.id] || {};
                  const filledCount = Object.keys(studentRecords).length;
                  const percentFilled = Math.round((filledCount / daysInMonth) * 100);

                  return (
                    <tr key={student.id} className="hover:bg-blue-50/30 transition">
                      <td className="p-3 text-center font-mono text-[11px] text-slate-400 sticky left-0 bg-white z-10 shadow-xs">
                        {idx + 1}
                      </td>
                      <td className="p-3 sticky left-10 bg-white z-10 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={student.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 text-xs block truncate" title={student.name}>
                              {student.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              NIS: {student.nis}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Day-by-Day cells */}
                      {daysArray.map((dayNum) => {
                        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const record = studentRecords[dateStr];
                        const dayDate = new Date(year, month - 1, dayNum);
                        const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;

                        if (!record) {
                          return (
                            <td
                              key={dayNum}
                              className={`p-1 text-center border-l border-slate-100 ${
                                isWeekend ? 'bg-slate-50/50' : ''
                              }`}
                            >
                              <span className="inline-block w-6 h-6 leading-6 text-slate-300 text-[11px]">
                                -
                              </span>
                            </td>
                          );
                        }

                        const visual = getMoodVisual(record.mood);

                        return (
                          <td
                            key={dayNum}
                            className="p-1 text-center border-l border-slate-100"
                          >
                            <button
                              type="button"
                              onClick={() => onSelectMoodCheck(record)}
                              className={`w-7 h-7 rounded-lg border text-sm flex items-center justify-center mx-auto transition-transform hover:scale-125 cursor-pointer relative shadow-2xs ${visual.bg}`}
                              title={`${student.name} • ${dateStr}\nKondisi: ${visual.label}\nCatatan: ${record.note || 'Tidak ada catatan'}${record.needs_counseling ? '\n🚨 Butuh Konseling!' : ''}`}
                            >
                              <span>{visual.emoji}</span>
                              {record.needs_counseling && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white animate-ping" />
                              )}
                            </button>
                          </td>
                        );
                      })}

                      {/* Summary Cell */}
                      <td className="p-3 text-center border-l border-slate-200 bg-slate-50/60 font-semibold text-[11px]">
                        <span className="text-blue-700 font-bold block">{filledCount}/{daysInMonth}</span>
                        <span className="text-[10px] text-slate-400">({percentFilled}%)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap text-slate-600 font-medium">
            <span className="font-bold text-slate-800 text-[11px] uppercase">Keterangan:</span>
            <div className="flex items-center gap-1.5">
              <span>🤩</span> <span>Sangat Senang</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>😊</span> <span>Senang</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>😐</span> <span>Netral</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>😢</span> <span>Sedih</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>😰</span> <span>Cemas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>😡</span> <span>Marah</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block animate-pulse" />
              <span>Memohon Konseling</span>
            </div>
          </div>

          <span className="text-[11px] text-slate-500">
            Terakhir disinkronkan secara otomatis dengan catatan siswa
          </span>
        </div>
      </div>
    </div>
  );
};
