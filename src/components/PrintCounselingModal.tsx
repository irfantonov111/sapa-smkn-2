import React from 'react';
import { Printer, X, Shield, Calendar, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { CounselingAppointment } from '../types/database';
import { db } from '../services/db';

interface PrintCounselingModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: CounselingAppointment;
}

export const PrintCounselingModal: React.FC<PrintCounselingModalProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  if (!isOpen) return null;

  const systemSettings = db.getSystemSettings();
  const schoolName = systemSettings?.school_name || 'SMK NEGERI 1';
  const schoolAddress = systemSettings?.address || 'Jl. Pendidikan No. 1, Kompleks Pendidikan Kejuruan';
  const schoolEmail = systemSettings?.contact_email || 'info@smk.sch.id';
  const schoolPhone = systemSettings?.contact_phone || '021-12345678';

  const handlePrint = () => {
    window.print();
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'menunggu': return 'Menunggu Konfirmasi Guru BK';
      case 'disetujui': return 'Disetujui / Terjadwal';
      case 'dijadwalkan_ulang': return 'Dijadwalkan Ulang (Rescheduled)';
      case 'selesai': return 'Selesai Dilaksanakan';
      case 'dibatalkan': return 'Dibatalkan';
      default: return status;
    }
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const scheduledDate = appointment.confirmed_date || appointment.requested_date;
  const scheduledTime = appointment.confirmed_time || appointment.requested_time;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container Dialog */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Modal Toolbar (Screen only) */}
        <div className="no-print p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Pratinjau Cetak / Unduh Dokumen PDF Jadwal Konseling
              </h3>
              <p className="text-[11px] text-slate-500">
                Surat bukti agenda bimbingan konseling peserta didik ({appointment.student_name})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70">
          <div
            id="printable-counseling-area"
            className="max-w-[210mm] mx-auto bg-white p-6 sm:p-10 shadow-sm border border-slate-200 font-serif text-slate-900 leading-normal"
            style={{ minHeight: '297mm' }}
          >
            {/* KOP SURAT RESMI */}
            <div className="border-b-4 border-double border-slate-900 pb-3 mb-5 text-center relative">
              <div className="flex items-center justify-center gap-4 mb-1">
                <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center shrink-0 font-sans font-extrabold text-xs text-indigo-900 bg-slate-50">
                  <Shield className="w-8 h-8 text-indigo-800 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-sans font-bold text-slate-700">
                    PEMERINTAH DAERAH PROVINSI • DINAS PENDIDIKAN
                  </h4>
                  <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider font-sans text-slate-950 mt-0.5">
                    {schoolName}
                  </h1>
                  <h2 className="text-xs font-semibold font-sans text-indigo-900 tracking-wide">
                    UNIT LAYANAN BIMBINGAN DAN KONSELING (BK) • APLIKASI SAPA
                  </h2>
                  <p className="text-[10px] font-sans text-slate-600 mt-0.5">
                    {schoolAddress} • Telp: {schoolPhone} • Email: {schoolEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* DOKUMEN TITLE */}
            <div className="text-center mb-6">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wide underline font-sans">
                LEMBAR BUKTI JADWAL TEMU BIMBINGAN KONSELING SISWA
              </h3>
              <p className="text-xs font-mono font-bold text-slate-700 mt-1">
                NO. AGENDA: BK-SAPA/{new Date().getFullYear()}/{appointment.id.replace('apt-', '')}
              </p>
            </div>

            {/* BAGIAN I: DATA PESERTA DIDIK */}
            <div className="mb-5 font-sans">
              <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase tracking-wider border-l-4 border-indigo-700 mb-2">
                I. Identitas Peserta Didik (Konseli)
              </div>
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 px-2 font-bold w-40 text-slate-700">Nama Siswa</td>
                    <td className="py-1.5 px-2 font-bold text-sm text-slate-950">{appointment.student_name}</td>
                    <td className="py-1.5 px-2 font-bold w-36 text-slate-700">Kelas / Rombel</td>
                    <td className="py-1.5 px-2 font-bold">{appointment.student_class_name || 'Siswa SMK'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 px-2 font-bold text-slate-700">ID Siswa</td>
                    <td className="py-1.5 px-2 font-mono text-slate-600">{appointment.student_id}</td>
                    <td className="py-1.5 px-2 font-bold text-slate-700">Status Agenda</td>
                    <td className="py-1.5 px-2 font-bold text-indigo-800">{getStatusLabel(appointment.status)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BAGIAN II: JADWAL & PELAKSANAAN */}
            <div className="mb-5 font-sans">
              <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase tracking-wider border-l-4 border-indigo-700 mb-2">
                II. Detail Pertemuan Bimbingan Konseling
              </div>
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Tanggal Pelaksanaan:</span>
                  <p className="font-bold text-sm text-slate-900 mt-0.5">{scheduledDate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Waktu / Jam Pertemuan:</span>
                  <p className="font-bold text-sm text-slate-900 mt-0.5">Jam {scheduledTime} WIB</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Metode Bimbingan:</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {appointment.counseling_type === 'tatap_muka' ? '🏛️ Tatap Muka di Ruang BK Sekolah' : '💬 Daring / Konsultasi Online'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Guru Pembimbing BK:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{appointment.teacher_name || 'Guru Bimbingan Konseling'}</p>
                </div>
              </div>
            </div>

            {/* BAGIAN III: TOPIK & MATERI BIMBINGAN */}
            <div className="mb-5 font-sans">
              <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase tracking-wider border-l-4 border-indigo-700 mb-2">
                III. Pokok Masalah & Keperluan Bimbingan
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Topik Bimbingan Konseling:</span>
                  <p className="text-slate-900 font-semibold mt-0.5 leading-relaxed">{appointment.topic}</p>
                </div>

                {appointment.reschedule_reason && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-bold text-blue-800 block">Catatan Penyesuaian Jadwal:</span>
                    <p className="text-slate-800 mt-0.5">{appointment.reschedule_reason}</p>
                  </div>
                )}

                {appointment.notes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-bold text-emerald-800 block">Catatan / Rekomendasi Hasil Sesi Konseling:</span>
                    <p className="text-slate-800 mt-0.5 whitespace-pre-wrap leading-relaxed">{appointment.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* BAGIAN IV: PERNYATAAN & TANDA TANGAN */}
            <div className="mt-8 pt-4 font-sans text-xs">
              <div className="text-right mb-6 text-slate-700">
                Dicetak di Sekolah pada: {todayFormatted}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="font-semibold text-slate-700">Peserta Didik (Konseli),</p>
                  <div className="h-16 flex items-end justify-center">
                    <p className="font-bold underline text-slate-900">{appointment.student_name}</p>
                  </div>
                  <p className="text-[11px] text-slate-500">Kelas: {appointment.student_class_name || '-'}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-700">Guru Pembimbing BK,</p>
                  <div className="h-16 flex items-end justify-center">
                    <p className="font-bold underline text-slate-900">
                      {appointment.teacher_name || 'Guru BK'}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500">Guru Bimbingan Konseling</p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="font-semibold text-slate-700">Mengetahui,</p>
                  <p className="text-[11px] text-slate-600">Wali Kelas / Koordinator BK</p>
                  <div className="h-14 flex items-end justify-center">
                    <p className="font-bold underline text-slate-900">
                      Koordinator Layanan BK
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500">{schoolName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
