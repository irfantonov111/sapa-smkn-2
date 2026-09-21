import React, { useState, useEffect } from 'react';
import {
  Heart,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  Sparkles,
  Send,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  RefreshCw,
  HelpCircle,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { MoodType, StudentMoodCheck } from '../types/database';

interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
  score: number;
  bgClass: string;
  borderClass: string;
  textClass: string;
  activeRingClass: string;
  description: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    type: 'sangat_senang',
    label: 'Sangat Senang',
    emoji: '🤩',
    score: 5,
    bgClass: 'bg-emerald-50 hover:bg-emerald-100/70',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-700',
    activeRingClass: 'ring-2 ring-emerald-500 bg-emerald-100/80 border-emerald-500',
    description: 'Penuh energi, antusias, bahagia'
  },
  {
    type: 'senang',
    label: 'Senang',
    emoji: '😊',
    score: 4,
    bgClass: 'bg-sky-50 hover:bg-sky-100/70',
    borderClass: 'border-sky-200',
    textClass: 'text-sky-700',
    activeRingClass: 'ring-2 ring-sky-500 bg-sky-100/80 border-sky-500',
    description: 'Nyaman, ceria, dalam kondisi baik'
  },
  {
    type: 'netral',
    label: 'Biasa Saja',
    emoji: '😐',
    score: 3,
    bgClass: 'bg-slate-50 hover:bg-slate-100/70',
    borderClass: 'border-slate-200',
    textClass: 'text-slate-700',
    activeRingClass: 'ring-2 ring-slate-500 bg-slate-100/90 border-slate-500',
    description: 'Normal, santai, datar, tidak ada masalah'
  },
  {
    type: 'sedih',
    label: 'Sedih / Galau',
    emoji: '😢',
    score: 2,
    bgClass: 'bg-indigo-50 hover:bg-indigo-100/70',
    borderClass: 'border-indigo-200',
    textClass: 'text-indigo-700',
    activeRingClass: 'ring-2 ring-indigo-500 bg-indigo-100/80 border-indigo-500',
    description: 'Kurang semangat, murung, kesepian'
  },
  {
    type: 'cemas',
    label: 'Cemas / Khawatir',
    emoji: '😰',
    score: 1,
    bgClass: 'bg-amber-50 hover:bg-amber-100/70',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    activeRingClass: 'ring-2 ring-amber-500 bg-amber-100/80 border-amber-500',
    description: 'Gugup, overthinking, tegang, takut'
  },
  {
    type: 'marah',
    label: 'Marah / Frustrasi',
    emoji: '😤',
    score: 1,
    bgClass: 'bg-rose-50 hover:bg-rose-100/70',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-700',
    activeRingClass: 'ring-2 ring-rose-500 bg-rose-100/80 border-rose-500',
    description: 'Kesal, jengkel, emosi tinggi'
  }
];

const COMMON_EMOTIONS = [
  'Bersemangat',
  'Tenang',
  'Bersyukur',
  'Percaya Diri',
  'Fokus',
  'Lelah Fisik',
  'Ngantuk',
  'Khawatir Ujian / Tugas',
  'Overthinking',
  'Kesepian',
  'Bingung',
  'Tersinggung',
  'Ragu-ragu',
  'Butuh Teman Ngobrol'
];

const COMMON_TRIGGERS = [
  'Pelajaran & Tugas Sekolah',
  'Pertemanan / Teman Sekelas',
  'Suasana Kelas / Guru',
  'Keluarga di Rumah',
  'Kesehatan Tubuh / Fisik',
  'Masalah Pribadi / Percintaan',
  'Tidak Ada Pemicu Khusus'
];

export const StudentMoodCheckCard: React.FC = () => {
  const { currentUser, studentProfile } = useAuth();
  const [todayMood, setTodayMood] = useState<StudentMoodCheck | null>(null);
  const [pastMoods, setPastMoods] = useState<StudentMoodCheck[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Form states
  const [selectedMood, setSelectedMood] = useState<MoodType>('senang');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['Tenang']);
  const [selectedTrigger, setSelectedTrigger] = useState<string>('Pelajaran & Tugas Sekolah');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load mood check records
  const refreshMoodData = () => {
    if (!studentProfile) return;
    const today = db.getMoodCheckByStudentToday(studentProfile.id);
    setTodayMood(today || null);

    const history = db.getMoodChecksByStudent(studentProfile.id);
    setPastMoods(history);

    if (today) {
      setSelectedMood(today.mood);
      setSelectedEmotions(today.emotions || []);
      setSelectedTrigger(today.trigger || 'Pelajaran & Tugas Sekolah');
      setNote(today.note || '');
    }
  };

  useEffect(() => {
    refreshMoodData();
  }, [studentProfile]);

  if (!currentUser || currentUser.role !== 'siswa' || !studentProfile) {
    return null;
  }

  const handleToggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else {
      if (selectedEmotions.length >= 4) {
        setSelectedEmotions([...selectedEmotions.slice(1), emotion]);
      } else {
        setSelectedEmotions([...selectedEmotions, emotion]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = db.submitMoodCheck({
        student_id: studentProfile.id,
        mood: selectedMood,
        emotions: selectedEmotions.length > 0 ? selectedEmotions : ['Biasa Saja'],
        trigger: selectedTrigger,
        note: note.trim(),
        needs_counseling: false
      });

      if (res.success) {
        setTodayMood(res.data);
        setIsEditing(false);
        setFeedbackMsg({
          type: 'success',
          text: 'Absensi mood harianmu berhasil dicatat. Terima kasih sudah jujur dengan perasaanmu!'
        });
        refreshMoodData();
      }
    } catch {
      setFeedbackMsg({
        type: 'error',
        text: 'Terjadi kesalahan saat menyimpan absensi mood. Silakan coba lagi.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodConfig = (mType: MoodType): MoodOption => {
    return MOOD_OPTIONS.find(m => m.type === mType) || MOOD_OPTIONS[2];
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-500/20 shrink-0">
              <Heart className="w-5 h-5 fill-white/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Absensi Mood Check Harian
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                  Kesehatan Mental Siswa
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bagaimana suasana hati dan perasaanmu di sekolah hari ini?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {todayMood && !isEditing && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Sudah Absen Hari Ini
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Riwayat ({pastMoods.length})</span>
              {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 space-y-5">
        {feedbackMsg && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-start gap-3 animate-in fade-in ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1">
              <p className="font-bold">{feedbackMsg.type === 'success' ? 'Berhasil!' : 'Perhatian:'}</p>
              <p className="mt-0.5">{feedbackMsg.text}</p>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMsg(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* View mode when student has ALREADY submitted today and NOT editing */}
        {todayMood && !isEditing ? (
          <div className="space-y-4">
            {/* Today's Mood Result Card */}
            {(() => {
              const currentCfg = getMoodConfig(todayMood.mood);
              return (
                <div className={`rounded-2xl border ${currentCfg.borderClass} ${currentCfg.bgClass} p-5 space-y-4 relative overflow-hidden`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-4xl shrink-0">
                        {currentCfg.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">Kondisi Hari Ini:</span>
                          <span className={`text-base font-extrabold ${currentCfg.textClass}`}>
                            {currentCfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {currentCfg.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Dicatat pukul {todayMood.time || 'hari ini'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-xs transition self-start sm:self-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ubah Mood Hari Ini</span>
                    </button>
                  </div>

                  {/* Emotion Chips */}
                  {todayMood.emotions && todayMood.emotions.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-600 mr-1">Rasa yang dominan:</span>
                      {todayMood.emotions.map((emo, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs"
                        >
                          #{emo}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Trigger & Student Note */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {todayMood.trigger && (
                      <div className="bg-white/70 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Faktor Utama:
                        </span>
                        <p className="font-semibold text-slate-800">{todayMood.trigger}</p>
                      </div>
                    )}

                    {todayMood.note ? (
                      <div className="bg-white/70 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Catatan Hatimu:
                        </span>
                        <p className="font-medium text-slate-800 italic">"{todayMood.note}"</p>
                      </div>
                    ) : (
                      <div className="bg-white/70 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Catatan Hatimu:
                        </span>
                        <p className="text-slate-400 italic">Tidak ada catatan tertulis.</p>
                      </div>
                    )}
                  </div>

                  {/* Friendly advice note */}
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 flex items-center gap-2.5 text-xs text-blue-900">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <p className="text-[11px] text-blue-800 font-medium">
                      Guru BK kelas Anda dapat memantau rekapan ini agar bisa memberikan pendampingan yang tepat setiap saat.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* Form for submission or editing */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Mood Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. Pilih kondisi mood yang paling mewakili dirimu saat ini: <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {MOOD_OPTIONS.map((item) => {
                  const isSelected = selectedMood === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setSelectedMood(item.type)}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? item.activeRingClass + ' shadow-md scale-102'
                          : `${item.bgClass} ${item.borderClass} opacity-80 hover:opacity-100`
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl transition-transform hover:scale-110">
                        {item.emoji}
                      </span>
                      <span className={`text-xs font-bold ${item.textClass} leading-tight`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Specific Emotions */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                2. Emosi apa saja yang kamu rasakan? (Bisa pilih 1 - 4 kata):
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_EMOTIONS.map((emo) => {
                  const active = selectedEmotions.includes(emo);
                  return (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => handleToggleEmotion(emo)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                      }`}
                    >
                      {emo}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Trigger Context */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                3. Apa faktor utama yang paling memengaruhi perasaanmu?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {COMMON_TRIGGERS.map((trig) => {
                  const active = selectedTrigger === trig;
                  return (
                    <button
                      key={trig}
                      type="button"
                      onClick={() => setSelectedTrigger(trig)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left transition cursor-pointer border ${
                        active
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold ring-1 ring-indigo-400'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {trig}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Personal Note */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                4. Cerita singkat atau unek-unek (Opsional & Bersifat Rahasia):
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Tuliskan apa saja yang sedang membebani atau membuatmu senang hari ini... (Hanya dapat dibaca oleh Guru BK kelas Anda)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {todayMood && isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
                >
                  Batal
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/25 disabled:opacity-50 transition flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Kirim Absensi Mood'}</span>
              </button>
            </div>
          </form>
        )}

        {/* History Dropdown Panel */}
        {showHistory && (
          <div className="pt-4 border-t border-slate-200/80 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Catatan Mood Check Sebelumnya
              </h3>
              <span className="text-[11px] text-slate-500">{pastMoods.length} hari terekam</span>
            </div>

            {pastMoods.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                Belum ada riwayat mood check sebelumnya.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {pastMoods.map((item) => {
                  const cfg = getMoodConfig(item.mood);
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white transition flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cfg.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${cfg.textClass}`}>{cfg.label}</span>
                            <span className="text-[11px] text-slate-400">• {item.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1">
                            {item.emotions?.join(', ') || 'Tanpa tag'} {item.note ? `— "${item.note}"` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.needs_counseling && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Butuh Konseling
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
