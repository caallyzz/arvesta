const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const ctrl    = require('../controllers/pemasukanController');
const auth    = require('../middleware/auth');

/**
 * PEMASUKAN ROUTES
 * Base: /api/pemasukan
 * Semua route butuh token JWT
 *
 * Tabel pemasukan: id, pengguna_id, nominal, is_aktif, created_at
 * Digunakan sebagai "sumber income" yang bisa dilinkkan ke transaksi
 */

router.use(auth);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/pemasukan
 * List semua pemasukan milik user yang login
 */
router.get('/', ctrl.getAll);

/**
 * GET /api/pemasukan/:id
 */
router.get('/:id', ctrl.getById);

/**
 * POST /api/pemasukan
 * Body: { nominal }
 * Otomatis is_aktif = 1 saat pertama dibuat
 */
router.post('/', [
  body('nominal')
    .isFloat({ min: 0.01 }).withMessage('Nominal harus lebih dari 0'),
], ctrl.create);

/**
 * PUT /api/pemasukan/:id
 * Body: { nominal, is_aktif? }
 * is_aktif: 1 = aktif, 0 = nonaktif
 */
router.put('/:id', [
  body('nominal')
    .isFloat({ min: 0.01 }).withMessage('Nominal harus lebih dari 0'),
  body('is_aktif')
    .optional()
    .isIn([0, 1, true, false]).withMessage('is_aktif harus 0 atau 1'),
], ctrl.update);

/**
 * DELETE /api/pemasukan/:id
 * Pemasukan yang terhubung ke transaksi akan di-set NULL (ON DELETE SET NULL)
 */
router.delete('/:id', ctrl.delete);

module.exports = router;
