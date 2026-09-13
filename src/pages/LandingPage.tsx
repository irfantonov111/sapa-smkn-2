import React from 'react';
import {
  Shield,
  BookOpen,
  AlertTriangle,
  Users,
  Lightbulb,
  MessageCircle,
  Lock,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 fill-blue-500/20" />
              <span>Platform Komunikasi & Dukungan Siswa Terpercaya</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Suarakan Ceritamu, <br className="hidden sm:inline" />
              <span className="text-blue-600">Temukan Dukunganmu.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              <strong className="text-slate-900">SAPA (Sarana Pendampingan dan Asistensi Siswa)</strong> membantu siswa menyampaikan kendala belajar, perundungan, atau masalah pertemanan kepada{' '}
              <strong className="text-slate-800">Guru BK</strong> atau{' '}
              <strong className="text-slate-800">Wali Kelas</strong> secara aman, transparan, dan terpantau hingga tuntas.
            </p>

            {/* Portal Action CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Masuk ke Portal Layanan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Disclaimer pill */}
            <p className="text-xs text-slate-500 pt-2 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Bukan pengganti konseling tatap muka & bukan alat diagnosis psikologis.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Kategori Laporan */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Apa yang Ingin Kamu Ceritakan?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Pilih kategori yang sesuai. Setiap laporan ditangani secara profesional dengan jaminan privasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Kesulitan Belajar</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tugas berat, materi sulit, kendala laptop praktik, atau rasa cemas bertanya di kelas.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Bullying / Perundungan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ejekan verbal, intimidasi fisik, pengucilan, atau ancaman siber yang mengganggu kenyamananmu.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Masalah Pertemanan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kesalahpahaman kelompok, perselisihan sahabat, atau kesulitan membaur di lingkungan kelas.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Masukan & Saran</h3>
              <p className="text-xs text-slate-500 mt-1">
                Aspirasi fasilitas belajar, Wi-Fi lab, kebersihan, atau usulan kegiatan sekolah.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Masalah Lainnya</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kejenuhan/burnout, kegelisahan masa depan karier/kuliah, atau masalah keluarga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Transparan 5 Tahap */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Pantau Setiap Tahap Secara Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Tidak ada lagi laporan yang hilang tanpa kabar. Siswa selalu mengetahui status laporan mereka.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold mx-auto flex items-center justify-center mb-2 text-xs">
                1
              </div>
              <h4 className="font-bold text-xs text-slate-800">Terkirim</h4>
              <p className="text-[11px] text-slate-500 mt-1">Laporan berhasil tersimpan dan diteruskan ke guru tujuan.</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 font-bold mx-auto flex items-center justify-center mb-2 text-xs">
                2
              </div>
              <h4 className="font-bold text-xs text-amber-900">Dibaca</h4>
              <p className="text-[11px] text-amber-700 mt-1">Guru membuka detail cerita dan mempelajari duduk masalah.</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 font-bold mx-auto flex items-center justify-center mb-2 text-xs">
                3
              </div>
              <h4 className="font-bold text-xs text-blue-900">Direspons</h4>
              <p className="text-[11px] text-blue-700 mt-1">Guru memberikan balasan pesan dan saran melalui chat aman.</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-800 font-bold mx-auto flex items-center justify-center mb-2 text-xs">
                4
              </div>
              <h4 className="font-bold text-xs text-purple-900">Ditindaklanjuti</h4>
              <p className="text-[11px] text-purple-700 mt-1">Proses konseling, mediasi, atau perbaikan fasilitas dilakukan.</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 font-bold mx-auto flex items-center justify-center mb-2 text-xs">
                5
              </div>
              <h4 className="font-bold text-xs text-emerald-900">Selesai</h4>
              <p className="text-[11px] text-emerald-700 mt-1">Masalah teratasi dan siswa mendapatkan resolusi yang aman.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Tingkat Kerahasiaan */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 text-center mb-6">
              Privasi & Keamanan Siswa Adalah Prioritas Utama
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  Pilihan 1
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">Identitas Terbuka</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Nama, NIS, dan kelasmu terlihat oleh guru yang dituju agar tindak lanjut bimbingan belajar berlangsung lebih mudah.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                  Pilihan 2
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">Identitas Terbatas</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Hanya Guru BK atau Wali Kelas penerima langsung yang dapat melihat identitasmu, terlindungi dari pihak lain.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                  Pilihan 3
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">Anonim</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Nama dan NIS kamu disamarkan sepenuhnya kepada guru penerima laporan. Cocok untuk kasus perundungan yang membutuhkan keamanan ekstra.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                Buat Laporan Pertamamu Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">SAPA - Sarana Pendampingan dan Asistensi Siswa.</p>
        <p className="text-[11px] text-slate-400 mt-1">Platform Komunikasi Bimbingan Konseling & Pendampingan Siswa Sekolah</p>
      </footer>
    </div>
  );
};
