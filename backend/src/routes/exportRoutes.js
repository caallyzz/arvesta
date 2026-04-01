const express = require('express');
const router  = express.Router();
const { query } = require('express-validator');
const ctrl    = require('../controllers/exportController');
const auth    = require('../middleware/auth');

/**
 * EXPORT ROUTES
 * Base: /api/export
 * Semua route butuh token JWT
 *
 * Tabel riwayat_export: id, pengguna_id, format, tanggal_mulai, tanggal_selesai, created_at
 */

router.use(auth);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/export/excel?dari=2024-01-01&sampai=2024-01-31
 * Mendownload file .xlsx berisi transaksi dalam rentang tanggal
 * Response: file binary (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
 */
router.get('/excel', [
  query('dari')
    .notEmpty().withMessage('Parameter dari wajib diisi')
    .isDate().withMessage('Format tanggal dari tidak valid (YYYY-MM-DD)'),
  query('sampai')
    .notEmpty().withMessage('Parameter sampai wajib diisi')
    .isDate().withMessage('Format tanggal sampai tidak valid (YYYY-MM-DD)'),
], ctrl.exportExcel);

/**
 * GET /api/export/pdf?dari=2024-01-01&sampai=2024-01-31
 * Mendownload file .pdf berisi laporan transaksi
 * Response: file binary (application/pdf)
 */
router.get('/pdf', [
  query('dari')
    .notEmpty().withMessage('Parameter dari wajib diisi')
    .isDate().withMessage('Format tanggal dari tidak valid (YYYY-MM-DD)'),
  query('sampai')
    .notEmpty().withMessage('Parameter sampai wajib diisi')
    .isDate().withMessage('Format tanggal sampai tidak valid (YYYY-MM-DD)'),
], ctrl.exportPDF);

/**
 * GET /api/export/riwayat
 * Menampilkan riwayat export yang pernah dilakukan user
 */
router.get('/riwayat', ctrl.getRiwayat);

module.exports = router;
