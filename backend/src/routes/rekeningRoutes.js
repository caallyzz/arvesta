const express = require('express');
const router  = express.Router();
const { body, query } = require('express-validator');
const ctrl    = require('../controllers/rekeningController');
const auth    = require('../middleware/auth');

/**
 * REKENING BERSAMA ROUTES
 * Base: /api/rekening
 * Semua route butuh token JWT
 *
 * Tabel terkait:
 *   - rekening_bersama   : id, nama, nomor_rekening, passkey, dibuat_oleh, created_at
 *   - anggota_rekening   : id, rekening_id, pengguna_id, role, bergabung_pada
 *   - transaksi_rekening : id, rekening_id, pengguna_id, tipe, nominal, deskripsi, tanggal, created_at
 */

router.use(auth);

// ─────────────────────────────────────────────────────────────────────────────
// REKENING — CRUD & JOIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/rekening
 * List semua rekening yang diikuti user (owner maupun member)
 * Response: [ { id, nama, nomor_rekening, role, saldo, jumlah_anggota, ... } ]
 */
router.get('/', ctrl.getAll);

/**
 * GET /api/rekening/:id
 * Detail satu rekening (hanya bisa diakses anggota)
 * Response: { id, nama, nomor_rekening, role, saldo, dibuat_oleh, created_at }
 */
router.get('/:id', ctrl.getById);

/**
 * POST /api/rekening
 * Buat rekening bersama baru
 * Body: { nama, nomor_rekening, passkey }
 * Otomatis membuat anggota dengan role = 'owner'
 */
router.post('/', [
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama rekening wajib diisi')
    .isLength({ max: 150 }).withMessage('Nama rekening maksimal 150 karakter'),
  body('nomor_rekening')
    .trim()
    .notEmpty().withMessage('Nomor rekening wajib diisi')
    .isLength({ max: 50 }).withMessage('Nomor rekening maksimal 50 karakter'),
  body('passkey')
    .trim()
    .isLength({ min: 4, max: 100 }).withMessage('Passkey minimal 4, maksimal 100 karakter'),
], ctrl.create);

/**
 * POST /api/rekening/join
 * Bergabung ke rekening yang sudah ada
 * Body: { nomor_rekening, passkey }
 * Role otomatis = 'member'
 *
 * ⚠️ Route ini HARUS di atas /:id agar tidak tertangkap sebagai getById
 */
router.post('/join', [
  body('nomor_rekening')
    .trim()
    .notEmpty().withMessage('Nomor rekening wajib diisi'),
  body('passkey')
    .trim()
    .notEmpty().withMessage('Passkey wajib diisi'),
], ctrl.join);

// ─────────────────────────────────────────────────────────────────────────────
// ANGGOTA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/rekening/:id/anggota
 * List semua anggota rekening beserta role dan info pengguna
 * Response: [ { id, rekening_id, pengguna_id, role, bergabung_pada, username, email } ]
 */
router.get('/:id/anggota', ctrl.getAnggota);

// ─────────────────────────────────────────────────────────────────────────────
// TRANSAKSI REKENING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/rekening/:id/transaksi
 * List transaksi pada rekening bersama
 * Query params:
 *   - page  : number (default: 1)
 *   - limit : number (default: 20, max: 100)
 * Response: { data: [...], total, page, limit, totalPages }
 */
router.get('/:id/transaksi', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page harus angka positif'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit antara 1-100'),
], ctrl.getTransaksi);

/**
 * POST /api/rekening/:id/transaksi
 * Tambah transaksi ke rekening bersama
 * Body: { tipe, nominal, tanggal, deskripsi? }
 * tipe: 'deposit' (setor) | 'withdraw' (tarik)
 * Catatan: withdraw akan dicek apakah saldo mencukupi
 */
router.post('/:id/transaksi', [
  body('tipe')
    .isIn(['deposit', 'withdraw']).withMessage('Tipe harus deposit atau withdraw'),
  body('nominal')
    .isFloat({ min: 0.01 }).withMessage('Nominal harus lebih dari 0'),
  body('tanggal')
    .isDate().withMessage('Format tanggal tidak valid (YYYY-MM-DD)'),
  body('deskripsi')
    .optional().trim().isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
], ctrl.tambahTransaksi);

module.exports = router;
