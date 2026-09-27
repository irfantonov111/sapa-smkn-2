import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Info,
  Printer,
  MapPin,
  MessageSquare,
  UserCheck,
  Sparkles,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import {
  CounselingAppointment,
  CounselingAppointmentStatus,
  CounselingType,
  BkTeacherProfile
} from '../types/database';
import { PrintCounselingModal } from '../components/PrintCounselingModal';

interface StudentCounselingPageProps {
  onNavigate?: (tab: string, id?: string) => void;
}

export const StudentCounselingPage: React.FC<StudentCounselingPageProps> = () => {
  const { currentUser, studentProfile } = useAuth();
  const [appointments, setAppointments] = useState<CounselingAppointment[]>([]);
  const [bkTeachers, setBkTeachers] = useState<BkTeacherProfile[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [printingAppointment, setPrintingAppointment] = useState<CounselingAppointment | null>(null);

  // Form State
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [requestedDate, setRequestedDate] = useState<string>('');
  const [requestedTime, setRequestedTime] = useState<string>('10:15');
  const [counselingType, setCounselingType] = useState<CounselingType>('tatap_muka');
  const [topic, setTopic] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const loadData = () => {
    if (!currentUser) return;
    const list = db.getCounselingAppointments({ student_user_id: currentUser.id });
    setAppointments(list);
    const teachers = db.getBkTeachers().filter(t => t.is_active !== false);
    setBkTeachers(teachers);

    const classBkId = studentProfile?.class_info?.bk_teacher_id;
    if (classBkId && !selectedTeacherId) {
      setSelectedTeacherId(classBkId);
    } else if (teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].teacher_id);
    }
  };

  useEffect(() => {
    loadData();
    db.syncFromBackend().then(loadData);

    const unsub = db.subscribe(() => {
      loadData();
    });

    const interval = setInterval(async () => {
      await db.syncFromBackend();
      loadData();
    }, 4000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [currentUser, studentProfile]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
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

      setSubmitSuccess('Pengajuan jadwal konseling berhasil dikirimkan ke Guru BK!');
      setTopic('');
      loadData();
      setTimeout(() => {
        setSubmitSuccess(null);
      }, 4000);
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
            Menunggu Konfirmasi Guru BK
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

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return apt.status === 'menunggu' || apt.status === 'disetujui' || apt.status === 'dijadwalkan_ulang';
    return apt.status === filterStatus;
  });

  const pendingCount = appointments.filter(a => a.status === 'menunggu').length;
  const approvedCount = appointments.filter(a => a.status === 'disetujui' || a.status === 'dijadwalkan_ulang').length;
  const completedCount = appointments.filter(a => a.status === 'selesai').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-200">
                  Layanan Bimbingan Konseling • {studentProfile?.class_info?.name || 'Siswa'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white uppercase">
                  Privasi Terjaga
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                Jadwalkan Konseling BK
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-2xl">
                Ajukan jadwal pertemuan tatap muka di Ruang BK atau sesi konsultasi daring bersama Guru BK untuk berdiskusi seputar akademik, pribadi, pertemanan, maupun perencanaan karier.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Pengajuan</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{appointments.length}</p>
          <span className="text-[11px] text-slate-400">Semua jadwal konseling</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-600">Menunggu Konfirmasi</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-slate-400">Sedang ditinjau Guru BK</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-indigo-600">Jadwal Terkonfirmasi</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{approvedCount}</p>
          <span className="text-[11px] text-slate-400">Siap dilaksanakan</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600">Selesai Konseling</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{completedCount}</p>
          <span className="text-[11px] text-slate-400">Telah terlaksana</span>
        </div>
      </div>

      {/* Main Content Grid: Form on Left, History & Active List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Pengajuan Jadwal Konseling */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Formulir Pengajuan Konseling
              </h2>
              <p className="text-[11px] text-slate-500">
                Isi jadwal dan pilih Guru BK yang ingin kamu temui
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                1. Pilih Guru Pembimbing BK:
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                {bkTeachers.map((teacher) => {
                  const isSelected = selectedTeacherId === teacher.teacher_id;
                  const isClassBk = studentProfile?.class_info?.bk_teacher_id === teacher.teacher_id;

                  return (
                    <div
                      key={teacher.teacher_id}
                      onClick={() => setSelectedTeacherId(teacher.teacher_id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-200'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs font-bold text-slate-900 truncate">{teacher.name}</p>
                            {isClassBk && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                                BK Kelasmu
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {teacher.room || 'Ruang BK'} • {teacher.specialization || 'Bimbingan Konseling'}
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
                  2. Tanggal Konseling:
                </label>
                <input
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Pilihan Jam:
                </label>
                <select
                  value={requestedTime}
                  onChange={(e) => setRequestedTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

            {/* Bentuk Sesi Konseling */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                4. Bentuk Sesi Konseling:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  className={`p-3 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition ${
                    counselingType === 'tatap_muka'
                      ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-200'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="pageCounselingType"
                    value="tatap_muka"
                    checked={counselingType === 'tatap_muka'}
                    onChange={() => setCounselingType('tatap_muka')}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Tatap Muka (Ruang BK)</span>
                    <span className="text-[11px] text-slate-500">
                      Pertemuan langsung secara privat di Ruang BK.
                    </span>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition ${
                    counselingType === 'online_chat'
                      ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-200'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="pageCounselingType"
                    value="online_chat"
                    checked={counselingType === 'online_chat'}
                    onChange={() => setCounselingType('online_chat')}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Konseling Daring</span>
                    <span className="text-[11px] text-slate-500">
                      Konsultasi terarah secara daring bersama Guru BK.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Topik Konseling */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                5. Topik / Hal yang Ingin Dikonsultasikan:
              </label>
              <textarea
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ceritakan singkat topik yang ingin kamu bahas bersama Guru BK..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-2 text-blue-900 text-[11px]">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Jadwal yang diajukan bersifat rahasia antara kamu dan Guru BK terpilih. Kamu juga dapat mencetak bukti jadwal konseling untuk izin keluar kelas bila diperlukan.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirimkan Jadwal...' : 'Kirim Pengajuan Jadwal Konseling'}</span>
            </button>
          </form>
        </div>

        {/* Daftar Jadwal & Riwayat Konseling Siswa */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Daftar Jadwal & Riwayat Konseling Kamu
              </h2>
              <p className="text-xs text-slate-500">
                Pantau persetujuan Guru BK atau cetak bukti jadwal janji temu konseling
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'active', label: 'Aktif' },
                { id: 'selesai', label: 'Selesai' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    filterStatus === tab.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Belum Ada Jadwal Konseling</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Silakan isi formulir di samping untuk mengajukan sesi konseling tatap muka atau daring bersama Guru BK.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-white shadow-2xs transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-slate-900">
                        {apt.teacher_name || 'Guru BK'}
                      </span>
                      {getStatusBadge(apt.status)}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPrintingAppointment(apt)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                        title="Cetak Bukti Jadwal Konseling"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Bukti Jadwal</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Jadwal Pelaksanaan</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {apt.status === 'dijadwalkan_ulang' && apt.rescheduled_date
                          ? `${apt.rescheduled_date} • Pukul ${apt.rescheduled_time} WIB`
                          : `${apt.requested_date} • Pukul ${apt.requested_time} WIB`}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Metode Konseling</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {apt.counseling_type === 'tatap_muka'
                          ? '🏛️ Tatap Muka di Ruang BK'
                          : '💬 Konseling Daring / Online'}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs bg-indigo-50/40 p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Topik / Pokok Bahasan:</span>
                    <p className="text-slate-800 font-medium mt-0.5">"{apt.topic}"</p>
                  </div>

                  {apt.reschedule_reason && (
                    <div className="text-xs bg-blue-50 text-blue-900 p-3 rounded-xl border border-blue-200">
                      <strong className="block font-bold text-[11px]">Catatan Penyesuaian Jadwal dari Guru BK:</strong>
                      <p className="mt-0.5">{apt.reschedule_reason}</p>
                    </div>
                  )}

                  {apt.notes && (
                    <div className="text-xs bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200">
                      <strong className="block font-bold text-[11px]">Catatan / Arahan Guru BK:</strong>
                      <p className="mt-0.5">{apt.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Cetak Bukti Jadwal Konseling */}
      {printingAppointment && (
        <PrintCounselingModal
          isOpen={!!printingAppointment}
          onClose={() => setPrintingAppointment(null)}
          appointment={printingAppointment}
        />
      )}
    </div>
  );
};
