# Goceng - Personal Finance Tracker

Website ini dibuat untuk **pemakaian pribadi** sebagai pencatat keuangan harian yang sederhana namun lengkap.

![Goceng Finance Tracker](https://img.shields.io/badge/Status-Personal_Project-blue)

---

## 🚀 Panduan Pengembangan (Developer)

Jika Anda ingin mengembangkan atau menjalankan project ini di komputer Anda sendiri, silakan ikuti langkah-langkah berikut:

### 1. Prasyarat
Pastikan Anda sudah menginstall:
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- [Git](https://git-scm.com/)

### 2. Install Project
Buka terminal/command prompt dan jalankan perintah:

```bash
# 1. Clone repository ini
git clone https://github.com/udinvoldigoad/goceng-financial.git

# 2. Masuk ke folder project
cd goceng-financial

# 3. Install dependencies
npm install
```

### 3. Konfigurasi Backend (Supabase)
Website ini membutuhkan backend **Supabase** untuk login dan penyimpanan data cloud.
1. Buat file `.env` (duplikat dari `.env.example`).
2. Isi dengan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=paste_url_supabase_anda_disini
   VITE_SUPABASE_ANON_KEY=paste_anon_key_anda_disini
   ```

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Buka browser dan akses: `http://localhost:5173`

---

**Catatan:** Project ini menggunakan `localStorage` untuk mode tamu dan `Supabase` untuk sinkronisasi cloud. Hati-hati saat menghapus data browser jika belum login.

*Dibuat oleh Udin Voldigoad*
