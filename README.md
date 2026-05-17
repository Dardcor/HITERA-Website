# Hitera - Website Dashboard

Hitera adalah platform manajemen kesehatan dan produktivitas terintegrasi premium yang dirancang untuk membantu pengguna melacak aktivitas kesehatan harian (air minum, jam tidur, olahraga, dan catatan) serta mengelola tugas harian secara efisien dengan sinkronisasi waktu nyata.

Repository ini berisi kode sumber untuk **Website Dashboard** yang dibangun menggunakan teknologi modern berbasis Next.js.

---

## 🚀 Fitur Utama

- **Dashboard Finansial & Keuangan**: Pemantauan transaksi pendapatan dan pengeluaran secara visual dan dinamis dengan diagram interaktif.
- **Manajemen Kesehatan (Health Tracker)**:
  - Pelacakan jumlah gelas air minum harian.
  - Pelacakan durasi tidur (jam).
  - Pelacakan durasi olahraga (jam & menit).
  - Catatan harian kesehatan dengan penulisan markdown/teks biasa.
  - Grafik tren dan visualisasi riwayat kesehatan lengkap.
- **Manajemen Tugas & Produktivitas (Task Management)**:
  - Pembuatan tugas dengan prioritas (Rendah, Sedang, Tinggi).
  - Penentuan batas waktu (tanggal dan jam deadline).
  - Status tugas real-time (Aktif, Selesai, Ditunda).
  - Tampilan informasi waktu pembuatan tugas yang presisi dan sinkron dengan aplikasi mobile.
- **Sistem Notifikasi Real-time**: Pemberitahuan untuk aktivitas penting, perubahan data, dan pengingat deadline tugas.
- **Multi-bahasa Premium (Localization)**: Dukungan penuh 5 bahasa: Indonesia, Inggris, Melayu, Jepang, dan Mandarin secara real-time.

---

## 🛠️ Stack Teknologi

- **Framework Utama**: Next.js 14 (App Router)
- **Bahasa Pemrograman**: TypeScript
- **Styling**: Tailwind CSS & CSS Variables (Sistem warna kustom bertema gelap premium)
- **Komponen UI**: Shadcn UI (Card, Input, Button, Modal)
- **Database & Otentikasi**: Supabase (PostgreSQL, Supabase Auth, Real-time Real-time Engine)
- **Manajemen Tanggal & Waktu**: `date-fns` untuk pemformatan tanggal lokal yang konsisten.
- **Ikon**: Lucide React

---

## ⚙️ Persyaratan Sistem

Pastikan Anda telah menginstal perangkat lunak berikut sebelum memulai:
- [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru direkomendasikan)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- Akun [Supabase](https://supabase.com/) untuk manajemen database dan otentikasi.

---

## 💻 Cara Instalasi & Menjalankan Project

### 1. Clone Repository & Masuk ke Direktori
```bash
git clone <repository-url>
cd Hitera-Website
```

### 2. Instalasi Dependensi
Instal semua pustaka pihak ketiga yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file konfigurasi contoh `.env.example` menjadi `.env` baru:
```bash
cp .env.example .env
```
Buka file `.env` dan masukkan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Menjalankan Server Pengembangan Lokal
Jalankan dev server lokal:
```bash
npm run dev
```
Setelah server berjalan, buka browser Anda dan akses halaman di [http://localhost:3000](http://localhost:3000).

### 5. Membuat Build Produksi
Untuk mengompilasi dan mengoptimalkan aplikasi untuk lingkungan produksi:
```bash
npm run build
npm run start
```

---

## 📂 Struktur Direktori Utama

```text
Hitera-Website/
├── public/              # Aset statis (ikon, gambar, manifes web)
├── src/
│   ├── app/             # Routing Next.js App Router (Layouts, Pages)
│   │   ├── dashboard/   # Dashboard (Kesehatan, Tugas, Keuangan, Pengaturan)
│   │   └── page.tsx     # Landing Page Utama
│   ├── components/      # Komponen UI Reusable (Keuangan, Kesehatan, Tugas, UI Card/Modal)
│   ├── contexts/        # React Contexts (LanguageContext untuk lokalisasi multi-bahasa)
│   ├── hooks/           # Custom React Hooks (useAuth, useTugas, useKeuangan)
│   ├── lib/             # Konfigurasi utilitas (Supabase client, format tanggal, translations)
│   └── types/           # Definisi tipe data TypeScript (DataKesehatan, Tugas, Transaksi)
├── .env.example         # File contoh environment variables
├── package.json         # Konfigurasi dependensi dan skrip proyek
└── tailwind.config.ts   # Konfigurasi tema Tailwind CSS
```
