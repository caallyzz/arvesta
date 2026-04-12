# 🏦 Arvesta Finance

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.3.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

</div>

> Aplikasi manajemen keuangan pribadi dengan scan struk otomatis (OCR)

## 📋 Daftar Isi

- [Tentang Aplikasi](#-tentang-aplikasi)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Instalasi](#-instalasi)
- [Struktur Folder](#-struktur-folder)
- [API Endpoints](#-api-endpoints)
- [Penggunaan](#-penggunaan)
- [Penulis](#-penulis)

## 🧐 Tentang Aplikasi

**Arvesta Finance** membantu Anda mencatat dan mengelola keuangan dengan mudah. Cukup upload foto struk, AI akan membaca otomatis merchant, tanggal, dan total belanja.

**Cocok untuk:**
- Melacak pengeluaran harian
- Mendigitalkan struk belanja
- Analisis pola keuangan
- Export data ke Excel/PDF

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🔍 Scan Struk Otomatis | OCR membaca merchant, tanggal, nominal |
| 📊 Dashboard Analitik | Visualisasi pemasukan & pengeluaran |
| 📝 Catat Transaksi | Tambah/edit/hapus transaksi |
| 📜 Riwayat Transaksi | Filter, cari, urutkan transaksi |
| 📎 Export Data | Excel & PDF |
| 🔄 Sinkronisasi Real-time | Update otomatis semua halaman |

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Frontend | React 18, React Router |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| HTTP | Axios |
| OCR | Tesseract.js |
| Backend | Node.js, Express |

## 🏁 Instalasi

### Prasyarat
- Node.js v16+
- npm atau yarn

### Langkah-langkah

```bash
# Clone project
git clone https://github.com/username/arvesta.git
cd arvesta

# Install dependencies
npm install

# Jalankan app
npm start
```

### Environment Variables

Buat file `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOAD_URL=http://localhost:5000/uploads
```

Aplikasi berjalan di `http://localhost:3000`

## 📁 Struktur Folder

```
src/
├── components/
│   └── Layout.jsx
├── pages/
│   ├── PelacakanUang.jsx    # Dashboard & transaksi
│   ├── ScanStruk.jsx        # Upload & OCR
│   └── VerifikasiStruk.jsx  # Verifikasi scan
├── services/
│   └── api.js               # API calls
├── utils/
│   ├── mockData.js          # Helpers
│   └── eventSync.js         # Event sync
└── App.jsx
```

## 🔌 API Endpoints

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/transaksi` | Ambil semua transaksi |
| POST | `/api/transaksi` | Tambah transaksi |
| PUT | `/api/transaksi/:id` | Update transaksi |
| DELETE | `/api/transaksi/:id` | Hapus transaksi |
| GET | `/api/transaksi/summary` | Ringkasan keuangan |
| POST | `/api/scan/upload` | Upload & OCR struk |
| GET | `/api/scan` | Ambil hasil scan |
| DELETE | `/api/scan/:id` | Hapus scan |
| POST | `/api/scan/:id/simpan` | Simpan ke transaksi |
| GET | `/api/export/excel` | Export Excel |
| GET | `/api/export/pdf` | Export PDF |

## 🎈 Penggunaan

### 1. Dashboard
Lihat ringkasan saldo, pemasukan, pengeluaran, dan grafik.

### 2. Scan Struk
- Upload gambar struk (drag & drop)
- Tunggu proses OCR
- Verifikasi hasil
- Simpan ke pengeluaran

### 3. Catat Transaksi
- Pilih tipe (pemasukan/pengeluaran)
- Isi nominal, kategori, deskripsi

### 4. Riwayat
- Cari, filter, edit, atau hapus transaksi

## ⚡ Quick Tips

| Shortcut | Fungsi |
|----------|--------|
| Drag & drop | Upload struk |
| Klik row tabel | Lihat detail transaksi |
| Klik edit/hapus | Kelola transaksi |

## ✍️ Penulis

**Tim Arvesta** - [@arvesta](https://github.com/arvesta)

---

<div align="center">
  Made with ❤️ by Arvesta Team
</div>
```

## Cara pakai:

1. **Copy semua kode di atas**
2. **Buka VSCode** → `Ctrl + N` (file baru)
3. **Paste** (`Ctrl + V`)
4. **Save** (`Ctrl + S`) → beri nama `README.md`
5. **Preview** (`Ctrl + Shift + V`) → lihat hasilnya

Selesai! README langsung jadi dan siap pakai 🎉
