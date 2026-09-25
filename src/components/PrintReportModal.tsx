import React from 'react';
import { Printer, X, Download, Shield, FileText } from 'lucide-react';
import { EnrichedReport, ReportStatusHistory } from '../types/database';
import { db } from '../services/db';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: EnrichedReport;
  history?: (ReportStatusHistory & { changer_name: string })[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  report,
  history = []
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
      case 'terkirim': return 'Terkirim (Menunggu Verifikasi)';
      case 'dibaca': return 'Sedang Ditinjau / Dibaca';
      case 'direspons': return 'Telah Direspons';
      case 'ditindaklanjuti': return 'Sedang Ditindaklanjuti';
      case 'selesai': return 'Selesai Ditangani';
      default: return status;
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'tinggi': return 'Tinggi (Prioritas Utama)';
      case 'sedang': return 'Sedang';
      case 'rendah': return 'Rendah / Normatif';
      default: return urgency;
    }
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case 'anonim': return 'Anonim (Identitas Dirahasiakan Sistem)';
      case 'terbatas': return 'Terbatas (Hanya Guru Terpilih)';
      case 'terbuka': return 'Terbuka';
      default: return privacy;
    }
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const createdFormatted = new Date(report.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container Dialog */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Modal Toolbar (Screen only) */}
        <div className="no-print p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Pratinjau Cetak / Unduh Dokumen PDF Laporan
              </h3>
              <p className="text-[11px] text-slate-500">
                Format resmi rekapitulasi penanganan pengaduan siswa SAPA ({report.report_code})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
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
            id="printable-report-area"
            className="max-w-[210mm] mx-auto bg-white p-6 sm:p-10 shadow-sm border border-slate-200 font-serif text-slate-900 leading-normal"
            style={{ minHeight: '297mm' }}
          >
            {/* KOP SURAT RESMI */}
            <div className="border-b-4 border-double border-slate-900 pb-3 mb-5 text-center relative">
              <div className="flex items-center justify-center gap-4 mb-1">
                <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center shrink-0 font-sans font-extrabold text-xs text-blue-900 bg-slate-50">
                  <Shield className="w-8 h-8 text-blue-800 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-sans font-bold text-slate-700">
                    PEMERINTAH DAERAH PROVINSI • DINAS PENDIDIKAN
                  </h4>
                  <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider font-sans text-slate-950 mt-0.5">
                    {schoolName}
                  </h1>
                  <h2 className="text-xs font-semibold font-sans text-blue-900 tracking-wide">
                    SARANA PENDAMPINGAN DAN ASISTENSI SISWA (SAPA)
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
                LEMBAR PENANGANAN & DISPOSISI ADUAN SISWA
              </h3>
              <p className="text-xs font-mono font-bold text-slate-700 mt-1">
                NO. REGISTER: SAPA/LAP/{new Date().getFullYear()}/{report.report_code}
              </p>
            </div>

            {/* BAGIAN I: DATA PENDAFTARAN & IDENTITAS */}
            <div className="mb-5 font-sans">
              <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase tracking-wider border-l-4 border-blue-700 mb-2">
                I. Identitas Laporan & Pelapor
              </div>
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 px-2 font-bold w-40 text-slate-700">Kode Laporan</td>
                    <td className="py-1.5 px-2 font-mono font-bold text-blue-900">{report.report_code}</td>
                    <td className="py-1.5 px-2 font-bold w-40 text-slate-700">Tanggal Pengajuan</td>
                    <td className="py-1.5 px-2">{createdFormatted} WIB</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 px-2 font-bold text-slate-700">Nama Siswa Pelapor</td>
                    <td className="py-1.5 px-2 font-bold">
                      {report.privacy === 'anonim' ? (
                        <span className="text-slate-600 italic">Anonim (Identitas Dirahasiakan Sistem)</span>
                      ) : (
                        report.student_name
                      )}
                    </td>
                    <td className="py-1.5 px-2 font-bold text-slate-700">Kelas / Rombel</td>
                    <td className="py-1.5 px-2">{report.student_class_name || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 px-2 font-bold text-slate-700">Kategori Masalah</td>
                    <td className="py-1.5 px-2 font-semibold text-slate-900">{report.category?.name || '-'}</td>
                    <td className="py-1.5 px-2 font-bold text-slate-700">Tingkat Urgensi</td>
                    <td className="py-1.5 px-2 font-bold">{getUrgencyLabel(report.urgency)}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 px-2 font-bold text-slate-700">Sifat Kerahasiaan</td>
                    <td className="py-1.5 px-2">{getPrivacyLabel(report.privacy)}</td>
                    <td className="py-1.5 px-2 font-bold text-slate-700">Status Penanganan</td>
                    <td className="py-1.5 px-2 font-bold text-emerald-800">{getStatusLabel(report.status)}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 px-2 font-bold text-slate-700">Ditujukan Kepada</td>
                    <td colSpan={3} className="py-1.5 px-2">
                      {report.assigned_teacher?.specific_name ? (
                        <span className="font-bold text-slate-900">
                          {report.assigned_teacher.specific_name} ({report.assigned_teacher.role_label})
                        </span>
                      ) : (
                        <span className="font-bold text-slate-900">{report.assigned_teacher?.role_label || 'Guru BK'}</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BAGIAN II: POKOK ADUAN & NARASI */}
            <div className="mb-5 font-sans">
              <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase tracking-wider border-l-4 border-blue-700 mb-2">
                II. Uraian Pokok Masalah & Pengaduan Siswa
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Judul Aduan / Kendala:</span>
                  <p className="font-bold text-sm text-slate-950 mt-0.5">{report.title}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800 block">Rincian Narasi Keluhan:</span>
                  <p className="text-slate-800 mt-1 whitespace-pre-wrap leading-relaxed text-xs">
                    {report.description}
                  </p>
                </div>
                {report.attachments && report.attachments.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                    <span className="font-bold block mb-1">Lampiran Berkas ({report.attachments.length} file):</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {report.attachments.map((att: any, idx: number) => (
                        <li key={idx}>
                          {att.name} {att.size ? `(${att.size})` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* BAGIAN III: KRONOLOGI TINDAK LANJUT GURU */}
            <div className="mb-6 font-sans">
              <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase tracking-wider border-l-4 border-blue-700 mb-2">
                III. Riwayat Tindak Lanjut & Catatan Pembimbing
              </div>
              {history.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-2 border border-slate-200 rounded">
                  Belum ada catatan riwayat tindak lanjut formal.
                </p>
              ) : (
                <table className="w-full text-xs border border-slate-200 border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-slate-200 text-left">
                      <th className="p-2 w-36">Waktu</th>
                      <th className="p-2 w-32">Status</th>
                      <th className="p-2 w-40">Petugas / Pendidik</th>
                      <th className="p-2">Catatan Tindak Lanjut & Solusi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {history.map((h, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-2 font-mono text-[11px]">
                          {new Date(h.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-2 font-bold">{getStatusLabel(h.status)}</td>
                        <td className="p-2">{h.changer_name || 'Pendidik'}</td>
                        <td className="p-2 text-slate-800 whitespace-pre-wrap">{h.note || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* BAGIAN IV: PENGESAHAN & TANDA TANGAN */}
            <div className="mt-8 pt-4 font-sans text-xs">
              <div className="text-right mb-6 text-slate-700">
                Dicetak pada: {todayFormatted}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="font-semibold text-slate-700">Siswa Pelapor,</p>
                  <div className="h-16 flex items-end justify-center">
                    <p className="font-bold underline text-slate-900">
                      {report.privacy === 'anonim' ? '(Identitas Anonim)' : report.student_name}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {report.privacy === 'anonim' ? 'Kerahasiaan Terlindungi' : `NIS: ${report.student_nis || '-'}`}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-700">Guru Pemeriksa / Konselor,</p>
                  <div className="h-16 flex items-end justify-center">
                    <p className="font-bold underline text-slate-900">
                      {report.assigned_teacher?.specific_name || report.assigned_teacher?.role_label || 'Guru Pembimbing'}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500">Guru Bimbingan Konseling / Wali Kelas</p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="font-semibold text-slate-700">Mengetahui,</p>
                  <p className="text-[11px] text-slate-600">Koordinator Bimbingan Konseling</p>
                  <div className="h-14 flex items-end justify-center">
                    <p className="font-bold underline text-slate-900">
                      Dra. Hj. Sri Wahyuni, M.Psi
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500">NIP. 197508121999032001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
