import React, { useState } from 'react';
import {
  Shield,
  Clock,
  MapPin,
  Sparkles,
  Check,
  User,
  HeartHandshake,
  GraduationCap,
  ChevronRight,
  Info,
  X,
  Phone,
  Mail,
  CalendarCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { BkTeacherProfile } from '../types/database';
import { decryptNip } from '../utils/nipCrypto';

interface BkTeachersListProps {
  teachers: BkTeacherProfile[];
  onSelectTeacherForReport: (teacherUserId: string) => void;
  classBkTeacherId?: string | null;
  className?: string;
}

export const BkTeachersDashboardSection: React.FC<BkTeachersListProps> = ({
  teachers,
  onSelectTeacherForReport,
  classBkTeacherId,
  className
}) => {
  const [activeModalTeacher, setActiveModalTeacher] = useState<BkTeacherProfile | null>(null);
  const [showNip, setShowNip] = useState<boolean>(false);

  // Put class BK teacher first if available
  const sortedTeachers = [...teachers].sort((a, b) => {
    const isAClassTeacher = classBkTeacherId && (a.teacher_id === classBkTeacherId || a.user_id === classBkTeacherId);
    const isBClassTeacher = classBkTeacherId && (b.teacher_id === classBkTeacherId || b.user_id === classBkTeacherId);
    if (isAClassTeacher) return -1;
    if (isBClassTeacher) return 1;
    return 0;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Pilih Guru BK yang Tersedia
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {teachers.length} Guru BK Aktif
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Di sekolah kita terdapat beberapa guru BK dengan spesialisasi berbeda. Pilih guru yang membuatmu merasa paling nyaman untuk bercerita.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowNip(prev => !prev)}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-2.5 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
            title={showNip ? 'Sembunyikan NIP Guru' : 'Tampilkan NIP Guru'}
          >
            {showNip ? <EyeOff className="w-3.5 h-3.5 text-blue-600" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span className="font-medium">{showNip ? 'Sembunyikan NIP' : 'Tampilkan NIP'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold hidden sm:inline">Privasi 100% Terlindungi</span>
            <span className="font-semibold sm:hidden">Privasi Aman</span>
          </div>
        </div>
      </div>

      {/* Grid of BK Teachers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTeachers.map((t) => {
          const isAvailable = t.is_active !== false;
          const isClassTeacher = Boolean(classBkTeacherId && (t.teacher_id === classBkTeacherId || t.user_id === classBkTeacherId));

          return (
            <div
              key={t.teacher_id}
              className={`rounded-2xl border transition-all flex flex-col justify-between p-4.5 group ${
                isClassTeacher
                  ? 'bg-blue-50/40 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                  : isAvailable
                  ? 'bg-slate-50/50 hover:bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                  : 'bg-slate-100/70 border-slate-200/90 opacity-75'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header: Photo, Name & Status */}
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-xs"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                      title={isAvailable ? 'Guru BK Aktif & Tersedia' : 'Sedang Tidak Aktif'}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      {isClassTeacher ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-600 text-white">
                          Guru BK Kelas Anda
                        </span>
                      ) : showNip ? (
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded break-all max-w-[150px] sm:max-w-none truncate" title={`NIP: ${decryptNip(t.nip)}`}>
                          NIP: {decryptNip(t.nip)}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 italic">Guru BK</span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md shrink-0 ${
                          isAvailable
                            ? 'text-emerald-700 bg-emerald-100/80'
                            : 'text-slate-600 bg-slate-200'
                        }`}
                      >
                        {isAvailable ? 'Tersedia' : 'Tidak Aktif'}
                      </span>
                    </div>
                    {isClassTeacher && showNip && (
                      <div className="mt-0.5">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded break-all max-w-[150px] sm:max-w-none truncate inline-block" title={`NIP: ${decryptNip(t.nip)}`}>
                          NIP: {decryptNip(t.nip)}
                        </span>
                      </div>
                    )}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1 mt-1">
                      {t.name}
                    </h3>
                    <p className="text-[11px] font-medium text-blue-600 line-clamp-1 mt-0.5">
                      {t.specialization}
                    </p>
                  </div>
                </div>

                {/* Badges / Details: Room & Schedule */}
                <div className="space-y-1.5 text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{t.room}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{t.available_hours}</span>
                  </div>
                </div>

                {/* Short Bio */}
                <p className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed">
                  "{t.bio}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalTeacher(t)}
                  className="px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
                >
                  Lihat Profil
                </button>

                {isAvailable ? (
                  <button
                    type="button"
                    onClick={() => onSelectTeacherForReport(t.user_id)}
                    className={`flex-1 px-3 py-2 rounded-xl text-[11px] font-bold shadow-2xs flex items-center justify-center gap-1.5 transition group/btn ${
                      isClassTeacher
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-900 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <span>{isClassTeacher ? 'Pilih (Guru BK Saya)' : 'Pilih Guru Ini'}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <span
                    className="flex-1 px-3 py-2 rounded-xl text-[11px] font-semibold bg-slate-200 text-slate-500 text-center cursor-not-allowed"
                    title="Guru BK sedang berstatus tidak aktif"
                  >
                    Sedang Tidak Aktif
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Teacher Detailed Profile */}
      {activeModalTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 relative">
            <button
              type="button"
              onClick={() => setActiveModalTeacher(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <img
                src={activeModalTeacher.avatar}
                alt={activeModalTeacher.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-100 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  {showNip ? (
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded break-all max-w-full">
                      NIP: {decryptNip(activeModalTeacher.nip)}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 italic">
                      NIP Tersembunyi
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowNip(prev => !prev)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    {showNip ? 'Sembunyikan' : 'Tampilkan NIP'}
                  </button>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {activeModalTeacher.name}
                </h3>
                <span className="inline-block mt-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                  {activeModalTeacher.specialization}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-5">
              <div>
                <strong className="text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">Tentang & Pendekatan Bimbingan:</strong>
                <p className="italic text-slate-600 leading-relaxed">
                  "{activeModalTeacher.bio}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Lokasi:</strong> {activeModalTeacher.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Jam Piket:</strong> {activeModalTeacher.available_hours}</span>
                </div>
              </div>

              {activeModalTeacher.email && (
                <div className="flex items-center gap-2 pt-1">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Email Dinas:</strong> {activeModalTeacher.email}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => {
                  const teacherId = activeModalTeacher.user_id;
                  setActiveModalTeacher(null);
                  onSelectTeacherForReport(teacherId);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Pilih Guru Ini untuk Konseling</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface BkTeacherFormSelectorProps {
  teachers: BkTeacherProfile[];
  selectedTeacherId: string | null;
  onSelectTeacher: (teacherUserId: string | null) => void;
  categoryName?: string;
  classBkTeacherId?: string | null;
  className?: string;
}

export const BkTeacherFormSelector: React.FC<BkTeacherFormSelectorProps> = ({
  teachers,
  selectedTeacherId,
  onSelectTeacher,
  categoryName,
  classBkTeacherId,
  className
}) => {
  // Check if a teacher specializes in the selected category
  const isRecommended = (t: BkTeacherProfile) => {
    if (!categoryName) return false;
    const cat = categoryName.toLowerCase();
    const spec = t.specialization.toLowerCase();
    if (cat.includes('bullying') || cat.includes('perundungan') || cat.includes('kekerasan')) {
      return spec.includes('perundungan') || spec.includes('pribadi');
    }
    if (cat.includes('karir') || cat.includes('bakat') || cat.includes('jurusan')) {
      return spec.includes('karir') || spec.includes('minat');
    }
    if (cat.includes('akademik') || cat.includes('belajar') || cat.includes('sarana')) {
      return spec.includes('belajar') || spec.includes('adaptasi');
    }
    return false;
  };

  const defaultClassTeacher = classBkTeacherId
    ? teachers.find(t => t.teacher_id === classBkTeacherId || t.user_id === classBkTeacherId)
    : null;

  const isClassTeacherSelected = defaultClassTeacher && (
    selectedTeacherId === defaultClassTeacher.user_id ||
    selectedTeacherId === defaultClassTeacher.teacher_id ||
    selectedTeacherId === null
  );

  const otherTeachers = defaultClassTeacher
    ? teachers.filter(t => t.teacher_id !== defaultClassTeacher.teacher_id && t.user_id !== defaultClassTeacher.user_id)
    : teachers;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Guru BK Pembimbing
        </span>
        <span className="text-[11px] text-slate-500">
          {isClassTeacherSelected
            ? 'Guru BK Kelas (Default)'
            : 'Guru BK Pilihan Khusus'}
        </span>
      </div>

      {/* 1. Class BK Teacher as Default Option */}
      {defaultClassTeacher ? (
        <div className="space-y-2">
          <div
            onClick={() => onSelectTeacher(defaultClassTeacher.user_id)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 relative ${
              isClassTeacherSelected
                ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-400'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={defaultClassTeacher.avatar}
                alt={defaultClassTeacher.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white ${
                  defaultClassTeacher.is_active !== false ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    {defaultClassTeacher.name}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    Guru BK Kelas {className || 'Anda'} (Default)
                  </span>
                </div>
                {isClassTeacherSelected && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <p className="text-[11px] font-medium text-blue-700 mt-0.5">
                {defaultClassTeacher.specialization} • {defaultClassTeacher.room}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Secara default, seluruh pengaduan dan bimbingan diarahkan langsung ke Guru BK pengampu resmi kelas Anda ({className || 'Rombel'}).
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* 2. Choose Other BK Teacher Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-700">
            {defaultClassTeacher
              ? 'Atau pilih bimbingan dengan Guru BK lain:'
              : 'Pilih Guru BK:'}
          </p>
          {!isClassTeacherSelected && defaultClassTeacher && (
            <button
              type="button"
              onClick={() => onSelectTeacher(defaultClassTeacher.user_id)}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
            >
              ← Kembali ke Guru BK Kelas
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {otherTeachers.map((t) => {
            const isSelected = selectedTeacherId === t.user_id || selectedTeacherId === t.teacher_id;
            const recommended = isRecommended(t);
            const isAvailable = t.is_active !== false;

            return (
              <div
                key={t.teacher_id}
                onClick={() => {
                  if (isAvailable) {
                    onSelectTeacher(t.user_id);
                  }
                }}
                className={`p-3.5 rounded-2xl border-2 transition flex items-start gap-3 relative ${
                  !isAvailable
                    ? 'opacity-60 bg-slate-100/80 border-slate-200 cursor-not-allowed'
                    : isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-2xs cursor-pointer'
                    : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
                }`}
              >
                {recommended && isAvailable && (
                  <span className="absolute -top-2 right-3 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-2xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Rekomendasi
                  </span>
                )}
                {!isAvailable && (
                  <span className="absolute -top-2 right-3 bg-slate-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-2xs">
                    Tidak Aktif
                  </span>
                )}

                <div className="relative shrink-0">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                      isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {t.name}
                    </span>
                    {isSelected && isAvailable && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] font-semibold text-blue-700 truncate mt-0.5">
                    {t.specialization}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span className="truncate">{t.room}</span>
                    {!isAvailable && (
                      <span className="text-rose-500 font-semibold truncate">• Non-aktif</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
