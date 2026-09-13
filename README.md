# SAPA - Sarana Pendampingan dan Asistensi Siswa di Sekolah

> **"Sarana Pendampingan dan Asistensi Siswa"**  
> Platform digital ramah siswa untuk menyampaikan aduan, keluhan belajar, perundungan (*bullying*), dan kendala pribadi kepada Guru Bimbingan Konseling (BK) maupun Wali Kelas secara aman, transparan, dan terpercaya.

---

## 📋 Daftar Isi
1. [Tentang Proyek](#-tentang-proyek)
2. [Fitur Utama Berdasarkan Peran](#-fitur-utama-berdasarkan-peran)
3. [Alur Status Laporan (State Lifecycle)](#-alur-status-laporan-state-lifecycle)
4. [Teknologi yang Digunakan (Tech Stack)](#-teknologi-yang-digunakan-tech-stack)
5. [Prasyarat Sistem (Prerequisites)](#-prasyarat-sistem-prerequisites)
6. [Panduan Langkah Instalasi Lokal](#-panduan-langkah-instalasi-lokal)
7. [Daftar Akun Demo untuk Pengujian](#-daftar-akun-demo-untuk-pengujian)
8. [Daftar Skrip NPM](#-daftar-skrip-npm)
9. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
10. [Arsitektur Skema Database (ERD)](#-arsitektur-skema-database-erd)
11. [Troubleshooting & Solusi Masalah Umum](#-troubleshooting--solusi-masalah-umum)

---

## 🌟 Tentang Proyek

Banyak siswa sekolah menghadapi berbagai tantangan psikologis, akademik, dan sosial—mulai dari perundungan (*bullying*), tekanan nilai, absensi, hingga masalah keluarga. Namun, mereka seringkali ragu atau takut untuk datang langsung ke ruang Bimbingan Konseling (BK) karena malu, takut dicap "bermasalah", atau cemas akan reaksi teman sebaya.

**SAPA (Sarana Pendampingan dan Asistensi Siswa)** hadir untuk memecahkan masalah tersebut dengan menyediakan:
- **Pilihan Kerahasiaan Penuh**: Siswa dapat memilih mode identitas **Terbuka**, **Terbatas**, atau **Anonim** (nama & NIS disamarkan sepenuhnya kepada guru penerima).
- **Target yang Tepat**: Siswa dapat memilih langsung apakah aduan ingin ditujukan kepada **Guru BK** atau **Wali Kelas** mereka.
- **Transparansi Penanganan**: Siswa dapat memantau setiap tahapan perkembangan laporan secara *real-time* tanpa ketidakpastian.
- **Ruang Obrolan Interaktif**: Diskusi dua arah yang aman antara siswa dan guru pendamping untuk koordinasi tindak lanjut.

---

## 🎯 Fitur Utama Berdasarkan Peran

### 1. 🎓 Siswa (Student)
- **Formulir Laporan Terstruktur**:
  - Pilihan kategori: *Kesulitan Belajar*, *Bullying / Perundungan*, *Masalah Pribadi & Emosional*, *Kendala Absensi & Sekolah*, atau *Saran & Fasilitas*.
  - Pemilihan tingkat urgensi: *Rendah*, *Sedang*, *Tinggi*, atau *Mendesak / Darurat*.
  - Opsi privasi identitas (*Terbuka*, *Terbatas*, atau *Anonim*).
- **Pelacakan Status Real-time**: Memantau badge status dan riwayat tindakan guru.
- **Fitur Chat Dua Arah**: Bertanya dan merespons bimbingan guru di dalam detail laporan.
- **Pusat Notifikasi**: Menerima peringatan saat guru membaca, merespons, atau memperbarui status laporan.

### 2. 💼 Guru Bimbingan Konseling (BK)
- **Dashboard & Antrean Kasus**: Filter laporan berdasarkan kategori, tingkat urgensi (kasus darurat berada di antrean teratas), dan status.
- **Tindak Lanjut Konseling**: Memperbarui status laporan ke *Ditindaklanjuti* dan memberikan catatan konseling (*counseling notes*).
- **Penanganan Anonimitas**: Identitas siswa anonim terlindungi sebagai *"Siswa Anonim"* tanpa mengurangi efektivitas bimbingan.
- **Resolusi Masalah**: Menutup laporan dengan status *Selesai* disertai resume penanganan.

### 3. 📋 Wali Kelas
- **Fokus Kelas Binaan**: Secara otomatis memantau siswa dari rombongan belajar (rombel) binaannya.
- **Koordinasi Belajar & Absensi**: Menindaklanjuti kendala nilai, kehadiran, dan kedisiplinan siswa secara cepat.
- **Eskalasi ke Guru BK**: Bekerja sama dengan Guru BK jika ditemukan indikasi masalah psikologis atau perundungan berat.

### 4. ⚙️ Administrator Sekolah
- **Dashboard Statistik & Metrik**: Total laporan, persentase penyelesaian, sebaran urgensi, dan perbandingan kategori.
- **Manajemen Data Pengguna & Kelas**: Mengelola akun siswa, guru, dan rombel kelas.
- **Kategori Laporan Dinamis**: Mengaktifkan atau menonaktifkan kategori sesuai kebutuhan sekolah.
- **Manajemen & Reset Database**: Simulator database dengan data awal (*seed data*) dan fitur reset sistem.

---

## 🔄 Alur Status Laporan (State Lifecycle)

Setiap laporan yang diajukan oleh siswa melalui siklus status yang terdefinisi secara jelas:

```
[ TERKIRIM ] ──(Guru membuka aduan)──> [ DIBACA ]
                                           │
                                  (Guru membalas obrolan)
                                           │
                                           ▼
[ SELESAI ] <──(Kasus tuntas)── [ DITINDAKLANJUTI ] <── [ DIRESPONS ]
                                 (Diberi catatan BK)
```

1. **TERKIRIM**: Siswa telah mengirimkan laporan ke sistem. Notifikasi terkirim ke Guru BK/Wali Kelas.
2. **DIBACA**: Guru telah membuka dan meninjau laporan siswa untuk pertama kalinya.
3. **DIRESPONS**: Guru telah membalas atau mengirimkan pesan respon pertama ke siswa.
4. **DITINDAKLANJUTI**: Guru memberikan tindakan konseling, bimbingan, pemanggilan, atau koordinasi lanjutan.
5. **SELESAI**: Masalah telah tuntas, solusi telah disepakati, dan laporan ditutup dengan aman.

---

## 💻 Teknologi yang Digunakan (Tech Stack)

| Bagian | Teknologi | Keterangan |
|---|---|---|
| **Framework UI** | [React 19](https://react.dev/) | Library antarmuka web modern dengan functional components & hooks |
| **Bahasa Pemrograman** | [TypeScript](https://www.typescriptlang.org/) | Type safety tinggi untuk keandalan kode |
| **Styling & CSS** | [Tailwind CSS v4](https://tailwindcss.com/) | Utilitas CSS modern dan responsif |
| **Ikonografi** | [Lucide React](https://lucide.dev/) | Kumpulan ikon vektor modern dan konsisten |
| **Animasi** | [Motion](https://motion.dev/) | Transisi mulus antar status dan dialog interaktif |
| **Tooling & Bundler** | [Vite 6](https://vitejs.dev/) | Build tool super cepat dengan Instant Dev Server |
| **Runtime Lingkungan** | [Node.js](https://nodejs.org/) | Node.js runtime environment (v18+ atau v20+) |

---

## ⚙️ Prasyarat Sistem (Prerequisites)

Sebelum menginstal proyek di komputer/laptop Anda, pastikan telah menginstal:
1. **Node.js**: Versi **18.x** atau **20.x LTS** (direkomendasikan versi 20+).  
   *Unduh installer di: [https://nodejs.org](https://nodejs.org)*
2. **NPM**: Versi **9.x** atau **10.x** (otomatis terpasang bersama Node.js).
3. **Web Browser Modern**: Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari versi terkini.
4. **Text Editor (Opsional)**: [Visual Studio Code](https://code.visualstudio.com/) sangat disarankan.

Untuk memeriksa apakah Node.js dan NPM sudah terpasang, buka Command Prompt / Terminal lalu ketik:
```bash
node -v
npm -v
```

---

## 🚀 Panduan Langkah Instalasi Lokal

Ikuti langkah-langkah mudah di bawah ini untuk menjalankan SAPA di laptop Anda:

### Langkah 1: Unduh atau Clone Kode Proyek
- **Cara A (Download ZIP dari Google AI Studio)**:
  1. Klik tombol menu di pojok kanan atas aplikasi AI Studio, pilih **Export** / **Download as ZIP**.
  2. Ekstrak file ZIP hasil unduhan ke folder pilihan Anda (misalnya: `D:\Projects\sapa`).
- **Cara B (Clone dari Git Repository)**:
  ```bash
  git clone https://github.com/username/sapa.git
  cd sapa
  ```

### Langkah 2: Buka Folder Proyek di Terminal / VS Code
Buka aplikasi **Visual Studio Code**, pilih **File > Open Folder**, lalu pilih folder proyek SAPA.  
Kemudian buka terminal terintegrasi (`Ctrl + ~` pada Windows/Linux atau `Cmd + ~` pada Mac).

Atau buka Command Prompt / PowerShell dan navigasikan ke direktori proyek:
```bash
cd path/ke/folder/sapa
```

### Langkah 3: Instalasi Seluruh Paket Dependensi
Jalankan perintah berikut di terminal untuk mengunduh semua paket yang dibutuhkan:
```bash
npm install
```
*Tunggu proses pengunduhan selesai hingga muncul folder `node_modules`.*

### Langkah 4: Menjalankan Server Pengembangan (Development Server)
Setelah instalasi selesai, jalankan server pengembangan dengan perintah:
```bash
npm run dev
```

Terminal akan menampilkan pesan konfirmasi bahwa server telah aktif:
```text
  VITE v6.2.3  ready in 280 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

### Langkah 5: Buka Aplikasi di Browser
Buka browser favorit Anda (Google Chrome, Microsoft Edge, dll.), lalu akses alamat:
```
http://localhost:3000
```
Selamat! Website **SAPA** sekarang sudah berjalan penuh di laptop Anda.

---

## 🔑 Daftar Akun Demo untuk Pengujian

Aplikasi telah dilengkapi fitur **Quick Switcher (Tombol 1-Klik)** di bagian bilah hitam paling atas, atau Anda dapat masuk menggunakan akun demo berikut:

| Peran | Nama Pengguna | Email Demo | Password Demo | Hak Akses |
|---|---|---|---|---|
| 🎓 **Siswa** | Rian Pratama (X RPL 1) | `siswa@advocare.test` | *(Bebas / 1-Klik)* | Membuat aduan, obrolan dua arah, melihat status aduan sendiri |
| 💼 **Guru BK** | Ibu Sri Wahyuni, S.Psi | `bk@advocare.test` | *(Bebas / 1-Klik)* | Menangani kasus prioritas tinggi/darurat, memberikan catatan BK, mengubah status |
| 📋 **Wali Kelas** | Pak Budi Santoso, S.Kom | `wali@advocare.test` | *(Bebas / 1-Klik)* | Menangani aduan siswa rombel binaan X RPL 1, bimbingan akademik & absensi |
| ⚙️ **Administrator** | Administrator Sekolah | `admin@advocare.test` | *(Bebas / 1-Klik)* | Manajemen akun guru/siswa, kategori aduan, reset simulasi data |

---

## 📜 Daftar Skrip NPM

Anda dapat menjalankan skrip berikut melalui terminal:

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan aplikasi dalam mode pengembangan (*hot-reload*, port 3000) |
| `npm run build` | Melakukan kompilasi produksi ke dalam folder `dist/` |
| `npm run preview` | Menjalankan server lokal untuk menguji hasil build produksi `dist/` |
| `npm run lint` | Melakukan validasi tipe TypeScript (`tsc --noEmit`) untuk memastikan bebas error |

---

## 📁 Struktur Direktori Proyek

```text
advocare/
├── index.html                   # Entry point HTML utama aplikasi
├── metadata.json                # Konfigurasi metadata aplikasi (nama, kapabilitas)
├── package.json                 # Konfigurasi paket dependensi & skrip NPM
├── README.md                    # Dokumentasi lengkap proyek & panduan instalasi
├── vite.config.ts               # Konfigurasi bundler Vite & Tailwind CSS
├── tsconfig.json                # Konfigurasi compiler TypeScript
│
└── src/
    ├── main.tsx                 # Entry point JavaScript/React
    ├── App.tsx                  # Komponen utama aplikasi & perutean tampilan
    ├── index.css                # Konfigurasi global Tailwind CSS (@import "tailwindcss")
    │
    ├── components/              # Komponen antarmuka yang dapat digunakan kembali
    │   ├── ArchitectureModal.tsx# Modal dokumentasi sistem, panduan instalasi & ERD
    │   ├── Header.tsx           # Bilah navigasi atas, status akun, demo switcher & notifikasi
    │   ├── Navigation.tsx       # Menu navigasi samping (desktop) & bilah navigasi bawah (mobile)
    │   ├── ReportChat.tsx       # Komponen ruang obrolan dua arah siswa & guru
    │   ├── StatusBadges.tsx     # Komponen penanda status laporan & tingkat urgensi
    │   └── StatusTimeline.tsx   # Visualisasi linimasa tahapan perkembangan laporan
    │
    ├── context/
    │   └── AuthContext.tsx      # Manajemen state autentikasi & sesi pengguna aktif
    │
    ├── pages/                   # Halaman-halaman antarmuka aplikasi
    │   ├── LandingPage.tsx      # Halaman utama (beranda edukatif & tombol mulai)
    │   ├── LoginPage.tsx        # Halaman masuk dengan kredensial & pemilih akun demo
    │   ├── StudentDashboard.tsx # Dashboard siswa (daftar aduan & tombol buat laporan)
    │   ├── TeacherDashboard.tsx # Dashboard guru BK & wali kelas (antrean & filter aduan)
    │   ├── AdminDashboard.tsx   # Panel admin (statistik, master data, & manajemen DB)
    │   ├── CreateReportPage.tsx # Formulir pembuatan laporan/curhat baru
    │   ├── ReportsListPage.tsx  # Halaman daftar filter laporan masuk & riwayat
    │   ├── ReportDetailPage.tsx # Halaman detail laporan, catatan bimbingan, & chat
    │   ├── NotificationsPage.tsx# Halaman daftar lengkap notifikasi
    │   └── ProfilePage.tsx      # Halaman data profil pengguna & pengaturan akun
    │
    ├── services/
    │   └── db.ts                # Layer data relasional, seed data simulasi & local persistence
    │
    └── types/
        └── index.ts             # Definisi antarmuka & tipe data TypeScript terpusat
```

---

## 🗄️ Arsitektur Skema Database (ERD)

Aplikasi dirancang mengikuti skema relasional standar PostgreSQL:

1. **`users`**: Data kredensial pengguna (`id`, `name`, `email`, `role`, `avatar`, `phone`).
2. **`students`**: Data profil siswa (`id`, `user_id`, `nis`, `class_id`).
3. **`teachers`**: Data profil guru (`id`, `user_id`, `nip`, `teacher_type`: `'guru_bk' | 'wali_kelas'`).
4. **`classes`**: Rombongan belajar (`id`, `name`, `grade`, `major`, `homeroom_teacher_id`).
5. **`categories`**: Kategori aduan (`id`, `name`, `description`, `icon`, `color`, `active`).
6. **`reports`**: Laporan siswa (`id`, `report_code`, `student_id`, `category_id`, `assigned_to`, `title`, `description`, `urgency`, `privacy`, `status`, `created_at`, `closed_at`).
7. **`messages`**: Pesan obrolan dua arah (`id`, `report_id`, `sender_id`, `message`, `created_at`).
8. **`report_status_history`**: Audit trail riwayat perbaruan status (`id`, `report_id`, `status`, `changed_by`, `note`).
9. **`notifications`**: Peringatan notifikasi pengguna (`id`, `user_id`, `report_id`, `title`, `message`, `is_read`).

---

## 🛠️ Troubleshooting & Solusi Masalah Umum

### 1. Pesan Error: `Port 3000 is already in use`
Jika port 3000 sedang dipakai oleh aplikasi lain di laptop Anda, Anda dapat menjalankan pada port lain dengan perintah:
```bash
npx vite --port 3001
```

### 2. Pesan Error: `'vite' is not recognized as an internal or external command`
Hal ini terjadi jika Anda belum menjalankan instalasi paket dependensi. Solusinya:
```bash
npm install
```
Setelah proses selesai, ulangi `npm run dev`.

### 3. Ingin Mengembalikan Data Simulasi ke Kondisi Awal?
Bila Anda ingin mereset seluruh laporan uji coba ke data bawaan awal:
- Masuk sebagai **Administrator** (klik tombol *Admin* di bar atas).
- Buka tab **Database & SQL**.
- Klik tombol **"Reset ke Data Bawaan Awal"**.

---

## 📄 Lisensi & Hak Cipta
Dikembangkan untuk mendukung program Bimbingan Konseling Sekolah yang ramah anak, aman, dan berintegritas.  
© 2026 **SAPA (Sarana Pendampingan dan Asistensi Siswa)**. Hak Cipta Dilindungi.
