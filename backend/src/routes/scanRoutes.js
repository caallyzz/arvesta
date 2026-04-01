const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const ctrl    = require('../controllers/scanStrukController');
const auth    = require('../middleware/auth');
const upload  = require('../middleware/upload');

/**
 * SCAN STRUK ROUTES
 * Base: /api/scan
 * Semua route butuh token JWT
 *
 * Tabel scan_struk:
 *   id, pengguna_id, path_gambar, nominal_terbaca, tanggal_terbaca, teks_terbaca, created_at
 *
 * Alur OCR:
 *   1. User upload gambar → POST /api/scan
 *   2. Backend kirim ke ai-service → hasil disimpan ke scan_struk
 *   3. User bisa edit hasil → PUT /api/scan/:id
 *   4. User simpan ke transaksi expense → POST /api/scan/:id/simpan
 */

router.use(auth);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/scan
 * Upload gambar struk & proses OCR
 * Content-Type: multipart/form-data
 * Field  : gambar (file gambar: jpeg/jpg/png/webp, max 5MB)
 * Response: data scan_struk yang baru dibuat
 *
 * Jika ai-service belum aktif, nominal/tanggal/teks akan NULL
 * dan user bisa mengisinya manual via PUT /api/scan/:id
 */
router.post(
  '/',
  upload.single('gambar'),
  ctrl.scan
);

/**
 * GET /api/scan
 * List riwayat scan milik user, urut terbaru di atas
 */
router.get('/', ctrl.getAll);

/**
 * GET /api/scan/:id
 * Detail satu hasil scan
 */
router.get('/:id', ctrl.getById);

/**
 * PUT /api/scan/:id
 * Edit hasil OCR secara manual (jika OCR kurang akurat)
 * Body: { nominal_terbaca?, tanggal_terbaca?, teks_terbaca? }
 */
router.put('/:id', [
  body('nominal_terbaca')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Nominal harus berupa angka positif'),
  body('tanggal_terbaca')
    .optional({ nullable: true })
    .isDate().withMessage('Format tanggal tidak valid (YYYY-MM-DD)'),
  body('teks_terbaca')
    .optional({ nullable: true })
    .isString().withMessage('Teks harus berupa string'),
], ctrl.update);

/**
 * POST /api/scan/:id/simpan
 * Simpan hasil scan ke tabel transaksi sebagai expense
 * Body: { deskripsi? }  — jika kosong, diisi dari teks_terbaca atau 'Dari scan struk'
 * Syarat: nominal_terbaca pada scan tidak boleh NULL
 */
router.post('/:id/simpan', [
  body('deskripsi')
    .optional().trim().isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
], ctrl.simpanKeTransaksi);

/**
 * DELETE /api/scan/:id
 * Hapus data scan + file gambar dari disk
 */
router.delete('/:id', ctrl.delete);

module.exports = router;
