# 🚀 Panduan Deployment SAPA ke Vercel

Dokumen ini berisi panduan lengkap langkah demi langkah untuk melakukan deploy aplikasi **SAPA (Sarana Pendampingan dan Asistensi Siswa)** ke platform **Vercel** dengan basis data **PostgreSQL (Supabase, Neon, atau Vercel Postgres)**.

---

## 📋 Ikhtisar Arsitektur di Vercel

- **Frontend:** React 19 + Vite + Tailwind CSS (di-build otomatis ke direktori `dist/` sebagai Static Single Page Application).
- **Backend API:** Express Serverless Functions via file `api/index.ts` yang menangani semua endpoint `/api/*`.
- **Database:** PostgreSQL Relasional (mendukung Supabase, Neon.tech, Vercel Postgres, Railway, atau AWS RDS).
- **Konfigurasi Routing:** Ditangani oleh `vercel.json` untuk meneruskan API dan SPA fallback.

---

## 🛠️ Langkah 1: Persiapkan Database PostgreSQL

Pilih salah satu penyedia PostgreSQL cloud gratis:

### Opsi A: Neon.tech (Sangat Direkomendasikan - Cepat & Gratis)
1. Kunjungi [neon.tech](https://neon.tech) dan login/daftar akun.
2. Buat proyek baru (misalnya: `advocare-db`).
3. Pada halaman dashboard, salin **Connection String** yang berformat:
   ```env
   postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require
   ```

### Opsi B: Supabase (Alternatif Populer)
1. Kunjungi [supabase.com](https://supabase.com) dan buat proyek baru.
2. Buka menu **Project Settings** > **Database** > **Connection string** (pilih mode *URI* / *Session pooler*).
3. Salin URL database tersebut.

---

## 🗄️ Langkah 2: Eksekusi Skema & Data Master

Buka **SQL Query Editor** pada dashboard Neon atau Supabase Anda, lalu jalankan file SQL sesuai urutan berikut:

### 1. Jalankan Skema Tabel (`database/schema.sql`)
Salin dan jalankan seluruh isi file `database/schema.sql`:
- Membuat tabel relasional: `users`, `students`, `teachers`, `classes`, `categories`, `reports`, `messages`, `report_status_history`, dan `notifications`.
- Dilengkapi index dan foreign key constraint.

### 2. Jalankan Data Master Sekolah (`database/seed.sql`)
Salin dan jalankan seluruh isi file `database/seed.sql`:
- **1 Akun Administrator**: `admin@advocare.test` (Sandi: `admin123`)
- **10 Guru BK**: Lengkap dengan NIP 18-digit, ruangan bimbingan, spesialisasi konseling (Sandi: `bk123`)
- **40 Wali Kelas**: Lengkap dengan NIP 18-digit dan kelas binaan (Sandi: `wali123`)
- **40 Kelas Rombel**: Jurusan RPL, TKJ, DKV, Akuntansi, dsb.
- **100 Siswa Aktif**: Lengkap dengan NIS 8-digit (Sandi: `siswa123`)
- **5 Kategori Layanan**: Perundungan, Akademik, Fasilitas, Kedisiplinan, Karir/Pribadi.

> *Catatan: Server SAPA juga memiliki auto-migration bawaan yang otomatis membuat tabel dan mengisi data master jika tabel terdeteksi masih kosong saat backend pertama kali dijalankan.*

---

## 🌐 Langkah 3: Hubungkan Proyek ke GitHub

1. Buka terminal di direktori proyek lokal Anda:
   ```bash
   git init
   git add .
   git commit -m "feat: SAPA production ready for Vercel deployment"
   ```
2. Buat repository baru di GitHub (misalnya: `sapa-smk`).
3. Hubungkan remote dan push:
   ```bash
   git remote add origin https://github.com/USERNAME/advocare-smk.git
   git branch -M main
   git push -u origin main
   ```

---

## ⚡ Langkah 4: Deploy di Vercel Dashboard

1. Kunjungi [vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Cari dan pilih repository `advocare-smk` yang baru saja Anda push, lalu klik **"Import"**.
4. Di bagian **Configure Project**:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (biarkan default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Buka bagian **Environment Variables** dan tambahkan variabel berikut:
   | Key | Value | Keterangan |
   |---|---|---|
   | `DATABASE_URL` | `postgresql://...` | Connection String PostgreSQL dari Neon/Supabase |
   | `NODE_ENV` | `production` | Menandakan lingkungan produksi |
   | `GEMINI_API_KEY` | *(Opsional)* | Jika menggunakan fitur ringkasan cerdas Gemini |
6. Klik tombol **"Deploy"** dan tunggu proses build selesai (sekitar 1–2 menit).

---

## 📁 File Pendukung Deployment di Direktori Proyek

Di dalam direktori proyek ini telah disiapkan file-file khusus pendukung Vercel:

1. **`vercel.json`**
   Mengatur routing serverless API dan fallback SPA:
   ```json
   {
     "version": 2,
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "/api/index.ts"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. **`api/index.ts`**
   Menghubungkan serverless function Vercel ke aplikasi backend Express (`server/app.ts`).

3. **`database/schema.sql`**
   Skrip DDL tabel relasional PostgreSQL.

4. **`database/seed.sql`**
   Skrip SQL pengisian 100 siswa, 10 Guru BK, 40 Wali Kelas, dan 40 Kelas.

---

## 🔑 Kredensial untuk Pengujian Login di Vercel

Setelah aplikasi aktif di domain Vercel Anda (misal: `https://advocare-smk.vercel.app`), Anda dapat menguji login untuk seluruh 4 peran pengguna:

### 1. Akun Siswa (Dapat login via NIS atau Email)
- **Identifier:** `24250101` (atau `siswa@advocare.test`)
- **Kata Sandi:** `siswa123`
- **Fitur:** Membuat pengaduan baru dengan 3 tingkat privasi (Terbuka, Terbatas, Anonim), memilih guru BK/Wali Kelas, chat real-time, pantau histori status.

### 2. Akun Guru BK (Dapat login via NIP atau Email)
- **Identifier:** `197503151999032001` (atau `sri.wahyuni@smk-advocare.sch.id`)
- **Kata Sandi:** `bk123`
- **Fitur:** Menerima laporan siswa, verifikasi kasus darurat, memberikan respons & tindak lanjut bimbingan, hapus laporan massal dengan multi-centang.

### 3. Akun Wali Kelas (Dapat login via NIP atau Email)
- **Identifier:** `197906122005011001` (atau `budi.santoso@smk-advocare.sch.id`)
- **Kata Sandi:** `wali123`
- **Fitur:** Memantau laporan khusus kelas binaan, koordinasi bimbingan belajar, respon pesan dua arah, hapus laporan massal.

### 4. Akun Administrator Sekolah
- **Identifier:** `admin@advocare.test`
- **Kata Sandi:** `admin123`
- **Fitur:** Mengelola seluruh master data pengguna (100 Siswa, Guru BK, Wali Kelas, Kategori), memantau dan mengelola seluruh pengaduan sekolah pada menu baris tunggal, sinkronisasi data master.

---

## ❓ Pemecahan Masalah (Troubleshooting)

- **Masalah:** API mengembalikan error 500 saat pertama kali dibuka.
  - **Solusi:** Pastikan variabel `DATABASE_URL` di Vercel Dashboard sudah benar dan mencakup parameter `?sslmode=require` jika menggunakan Neon atau Supabase.
- **Masalah:** Error *table does not exist*.
  - **Solusi:** Jalankan file `database/schema.sql` di SQL Query Editor penyedia database Anda, atau refresh server agar auto-migration berjalan.
- **Masalah:** Data pengaduan hilang saat serverless function restart.
  - **Solusi:** Pastikan `DATABASE_URL` telah terisi di environment variable Vercel agar backend otomatis menggunakan PostgreSQL cloud, bukan in-memory fallback.
