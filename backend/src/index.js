require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

// ── Import semua routes ───────────────────────────────────────────────────────
const authRoutes      = require('./routes/authRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');
const pemasukanRoutes = require('./routes/pemasukanRoutes');
const exportRoutes    = require('./routes/exportRoutes');
const rekeningRoutes  = require('./routes/rekeningRoutes');
const scanStrukRoutes = require('./routes/scanStrukRoutes');
const errorHandler    = require('./middleware/errorHandler');

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors({
  origin:         process.env.CORS_ORIGIN || '*',
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files — gambar struk yang diupload bisa diakses langsung
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);       // register, login, profile
app.use('/api/transaksi', transaksiRoutes);  // income & expense pribadi
app.use('/api/pemasukan', pemasukanRoutes);  // sumber pemasukan
app.use('/api/export',    exportRoutes);     // export excel / pdf
app.use('/api/rekening',  rekeningRoutes);   // tabungan bersama
app.use('/api/scan',      scanStrukRoutes);  // OCR scan struk

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: '🚀 Arvesta API is running', timestamp: new Date() });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} tidak ditemukan`,
  });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Arvesta Backend  →  http://localhost:${PORT}`);
  console.log(`📋 Environment      →  ${process.env.NODE_ENV || 'development'}`);
  console.log('─'.repeat(50));
  console.log('📡 Registered Routes:');
  console.log('   /api/auth        → register, login, profile');
  console.log('   /api/transaksi   → income & expense pribadi');
  console.log('   /api/pemasukan   → sumber pemasukan');
  console.log('   /api/export      → export excel / pdf');
  console.log('   /api/rekening    → tabungan bersama');
  console.log('   /api/scan        → OCR scan struk');
  console.log('─'.repeat(50));
});

module.exports = app;
