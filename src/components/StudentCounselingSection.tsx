import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  X,
  MapPin,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import {
  CounselingAppointment,
  CounselingAppointmentStatus,
  CounselingType,
  BkTeacherProfile
} from '../types/database';

interface StudentCounselingSectionProps {
  onNavigate?: (tab: string, id?: string) => void;
}

export const StudentCounselingSection: React.FC<StudentCounselingSectionProps> = () => {
  const { currentUser, studentProfile } = useAuth();
  const [appointments, setAppointments] = useState<CounselingAppointment[]>([]);
  const [bkTeachers, setBkTeachers] = useState<BkTeacherProfile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);

  // Form State
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [requestedDate, setRequestedDate] = useState<string>('');
  const [requestedTime, setRequestedTime] = useState<string>('10:00');
  const [counselingType, setCounselingType] = useState<CounselingType>('tatap_muka');
  const [topic, setTopic] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const loadAppointments = () => {
    if (!currentUser) return;
    const list = db.getCounselingAppointments({ student_user_id: currentUser.id });
    setAppointments(list);
    const teachers = db.getBkTeachers().filter(t => t.is_active !== false);
    setBkTeachers(teachers);

    // Default select class BK teacher if available
    const classBkId = studentProfile?.class_info?.bk_teacher_id;
    if (classBkId && !selectedTeacherId) {
      setSelectedTeacherId(classBkId);
    } else if (teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].teacher_id);
    }
  };

  useEffect(() => {
    loadAppointments();

    const unsub = db.subscribe(() => {
      loadAppointments();
    });

    return () => unsub();
  }, [currentUser, studentProfile]);

  // Set default date to tomorrow or today
  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setRequestedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  if (!currentUser || currentUser.role !== 'siswa') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId) {
      setFormError('Silakan pilih Guru BK tujuan.');
      return;
    }
    if (!requestedDate) {
      setFormError('Silakan tentukan tanggal sesi konseling.');
      return;
    }
    if (!requestedTime) {
      setFormError('Silakan pilih perkiraan jam konseling.');
      return;
    }
    if (!topic.trim()) {
      setFormError('Mohon tuliskan topik atau hal yang ingin kamu konsultasikan.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      db.createCounselingAppointment(currentUser, {
        teacher_id: selectedTeacherId,
        requested_date: requestedDate,
        requested_time: requestedTime,
        topic: topic.trim(),
        counseling_type: counselingType
      });

      setSubmitSuccess('Pengajuan janji temu konseling berhasil dikirimkan ke Guru BK!');
      setTopic('');
      loadAppointments();
      setTimeout(() => {
        setSubmitSuccess(null);
        setShowModal(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err?.message || 'Gagal mengajukan janji konseling.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: CounselingAppointmentStatus) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Menunggu Persetujuan Guru BK
          </span>
        );
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Jadwal Disetujui
          </span>
        );
      case 'dijadwalkan_ulang':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Calendar className="w-3 h-3 text-blue-600" />
            Dijadwalkan Ulang Guru BK
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            Selesai Dilaksanakan
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  const activeAppointments = appointments.filter(a => a.status !== 'selesai' && a.status !== 'dibatalkan');
  const latestActive = activeAppointments[0];

  return (
    <div className="bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white rounded-3xl border border-blue-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0 mt-0.5">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Janji Temu Konseling BK
              </h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase tracking-wide">
                Privasi Terjamin
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Butuh ruang bicara pribadi? Kamu bisa menjadwalkan sesi konseling tatap muka langsung di Ruang BK atau secara daring bersama Guru BK.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {appointments.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAllModal(true)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition shadow-2xs cursor-pointer"
            >
              Riwayat Janji ({appointments.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setSubmitSuccess(null);
              setShowModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajukan Jadwal Konseling</span>
          </button>
        </div>
      </div>

      {/* Active Upcoming Appointment Highlight if any */}
      {latestActive ? (
        <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-2xs space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Sesi Konseling Aktif
              </span>
              {getStatusBadge(latestActive.status)}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {latestActive.status === 'dijadwalkan_ulang' && latestActive.rescheduled_date
                  ? `${latestActive.rescheduled_date} • Jam ${latestActive.rescheduled_time}`
                  : `${latestActive.requested_date} • Jam ${latestActive.requested_time} WIB`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Guru Pembimbing BK:</span>
              <p className="font-bold text-slate-800">{latestActive.teacher_name || 'Guru BK'}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Bentuk Konseling:</span>
              <p className="font-bold text-slate-800">
                {latestActive.counseling_type === 'tatap_muka'
                  ? '🏛️ Tatap Muka di Ruang BK'
                  : '💬 Konseling Daring'}
              </p>
            </div>
          </div>

          <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block text-[11px] font-semibold">Topik Konseling:</span>
            <p className="text-slate-800 italic mt-0.5 line-clamp-2">"{latestActive.topic}"</p>
          </div>

          {latestActive.status === 'dijadwalkan_ulang' && latestActive.reschedule_reason && (
            <div className="text-xs bg-blue-50 text-blue-900 p-2.5 rounded-xl border border-blue-200">
              <strong className="block font-bold">Catatan Perubahan dari Guru BK:</strong>
              <p className="mt-0.5">{latestActive.reschedule_reason}</p>
            </div>
          )}

          {latestActive.notes && (
            <div className="text-xs bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200">
              <strong className="block font-bold">Catatan Guru BK:</strong>
              <p className="mt-0.5">{latestActive.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-slate-500 bg-white/70 rounded-2xl p-3.5 border border-dashed border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>Belum ada jadwal konseling aktif. Jika membutuhkan bimbingan khusus, kamu dapat mengajukan jadwal kapan saja.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline shrink-0 cursor-pointer"
          >
            Ajukan Sekarang &rarr;
          </button>
        </div>
      )}

      {/* Modal: Ajukan Jadwal Konseling Baru */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Ajukan Jadwal Konseling BK
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Jadwal akan dikonfirmasi langsung oleh Guru BK pilihanmu.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Pilih Guru BK */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Guru Pembimbing BK:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {bkTeachers.map((teacher) => {
                    const isSelected = selectedTeacherId === teacher.teacher_id;
                    const isClassBk = studentProfile?.class_info?.bk_teacher_id === teacher.teacher_id;

                    return (
                      <div
                        key={teacher.teacher_id}
                        onClick={() => setSelectedTeacherId(teacher.teacher_id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-200'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-xs font-bold text-slate-900">{teacher.name}</p>
                              {isClassBk && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                                  BK Kelas Kamu
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {teacher.room || 'Ruang BK Lantai 2'} • {teacher.specialization || 'Bimbingan Siswa'}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Konseling:
                  </label>
                  <input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilihan Jam Konseling:
                  </label>
                  <select
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="08:30">08:30 WIB (Pagi)</option>
                    <option value="09:30">09:30 WIB (Sesi 1)</option>
                    <option value="10:15">10:15 WIB (Jam Istirahat 1)</option>
                    <option value="11:30">11:30 WIB (Siang)</option>
                    <option value="13:00">13:00 WIB (Jam Istirahat 2)</option>
                    <option value="14:30">14:30 WIB (Pulang Sekolah)</option>
                  </select>
                </div>
              </div>

              {/* Bentuk / Jenis Konseling */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Bentuk Sesi Konseling:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={`p-3 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition ${
                      counselingType === 'tatap_muka'
                        ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-200'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="counselingType"
                      value="tatap_muka"
                      checked={counselingType === 'tatap_muka'}
                      onChange={() => setCounselingType('tatap_muka')}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Tatap Muka di Ruang BK</span>
                      <span className="text-[11px] text-slate-500">
                        Diskusi langsung secara privat dan nyaman di ruang konseling sekolah.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition ${
                      counselingType === 'online_chat'
                        ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-200'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="counselingType"
                      value="online_chat"
                      checked={counselingType === 'online_chat'}
                      onChange={() => setCounselingType('online_chat')}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Konseling Daring / Online</span>
                      <span className="text-[11px] text-slate-500">
                        Konsultasi santai melalui pesan obrolan terarah di portal.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Topik / Hal yang ingin dibahas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topik / Kendala yang Ingin Dikonsultasikan:
                </label>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Kesulitan mengatur waktu belajar, masalah pertemanan di kelas, atau butuh arahan pemilihan minat karier..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  required
                />
              </div>

              {/* Info Privasi */}
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-2.5 text-blue-900 text-xs">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Permintaan janji konseling hanya diketahui olehmu dan Guru BK terpilih. Jadwal dapat disesuaikan kembali sesuai ketersediaan jam belajar mengajar di sekolah.
                </span>
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengirimkan...' : 'Kirim Pengajuan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Riwayat Semua Janji Konseling */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Riwayat Janji Konseling BK
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Semua permohonan sesi konseling yang pernah kamu ajukan.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {appointments.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Belum ada riwayat janji konseling.
                </div>
              ) : (
                appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-2.5 hover:border-indigo-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {apt.teacher_name || 'Guru BK'}
                        </span>
                        {getStatusBadge(apt.status)}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Diajukan: {new Date(apt.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Waktu Sesi:</span>
                        <p className="font-bold text-slate-800">
                          {apt.status === 'dijadwalkan_ulang' && apt.rescheduled_date
                            ? `${apt.rescheduled_date} • Jam ${apt.rescheduled_time}`
                            : `${apt.requested_date} • Jam ${apt.requested_time} WIB`}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Bentuk:</span>
                        <p className="font-bold text-slate-800">
                          {apt.counseling_type === 'tatap_muka' ? '🏛️ Tatap Muka di Ruang BK' : '💬 Konseling Daring'}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 block text-[10px] font-semibold">Topik:</span>
                      <p className="text-slate-800 mt-0.5">{apt.topic}</p>
                    </div>

                    {apt.reschedule_reason && (
                      <div className="text-xs bg-blue-50 text-blue-900 p-2.5 rounded-xl border border-blue-200">
                        <strong className="block font-bold text-[11px]">Alasan Penyesuaian Jadwal Guru BK:</strong>
                        <p className="mt-0.5">{apt.reschedule_reason}</p>
                      </div>
                    )}

                    {apt.notes && (
                      <div className="text-xs bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200">
                        <strong className="block font-bold text-[11px]">Catatan Tindak Lanjut Guru BK:</strong>
                        <p className="mt-0.5">{apt.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
