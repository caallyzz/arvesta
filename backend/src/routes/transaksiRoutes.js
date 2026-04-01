const express = require('express');
const router  = express.Router();
const { body, query } = require('express-validator');
const ctrl    = require('../controllers/transaksiController');
const auth    = require('../middleware/auth');

/**
 * TRANSAKSI ROUTES
 * Base: /api/transaksi
 * Semua route butuh token JWT
 */

router.use(auth);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/transaksi
 * Query params:
 *   - tipe        : 'income' | 'expense'
 *   - dari        : YYYY-MM-DD  (tanggal awal)
 *   - sampai      : YYYY-MM-DD  (tanggal akhir)
 *   - search      : string      (cari di kolom deskripsi)
 *   - sortBy      : tanggal | nominal | tipe | created_at  (default: tanggal)
 *   - sortDir     : ASC | DESC                             (default: DESC)
 *   - page        : number                                 (default: 1)
 *   - limit       : number                                 (default: 10, max: 100)
 */
router.get('/', [
  query('tipe').optional().isIn(['income', 'expense']).withMessage('Tipe harus income atau expense'),
  query('dari').optional().isDate().withMessage('Format tanggal dari tidak valid (YYYY-MM-DD)'),
  query('sampai').optional().isDate().withMessage('Format tanggal sampai tidak valid (YYYY-MM-DD)'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page harus angka positif'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit antara 1-100'),
], ctrl.getAll);

/**
 * GET /api/transaksi/summary
 * Query params:
 *   - periode : 'harian' | 'mingguan' | 'bulanan'  (default: bulanan)
 *   - tahun   : YYYY    (default: tahun ini)
 *   - bulan   : 1-12   (default: bulan ini)
 * Response: { summary: {total_income, total_expense, saldo}, chartData, pieData }
 */
router.get('/summary', [
  query('periode').optional().isIn(['harian', 'mingguan', 'bulanan']).withMessage('Periode tidak valid'),
  query('tahun').optional().isInt({ min: 2000 }).withMessage('Tahun tidak valid'),
  query('bulan').optional().isInt({ min: 1, max: 12 }).withMessage('Bulan harus antara 1-12'),
], ctrl.getSummary);

/**
 * GET /api/transaksi/:id
 */
router.get('/:id', ctrl.getById);

/**
 * POST /api/transaksi
 * Body: { tipe, nominal, tanggal, deskripsi?, pemasukan_id? }
 */
router.post('/', [
  body('tipe')
    .isIn(['income', 'expense']).withMessage('Tipe harus income atau expense'),
  body('nominal')
    .isFloat({ min: 0.01 }).withMessage('Nominal harus lebih dari 0'),
  body('tanggal')
    .isDate().withMessage('Format tanggal tidak valid (YYYY-MM-DD)'),
  body('deskripsi')
    .optional().trim().isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
  body('pemasukan_id')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('pemasukan_id harus berupa ID yang valid'),
], ctrl.create);

/**
 * PUT /api/transaksi/:id
 * Body: { tipe, nominal, tanggal, deskripsi?, pemasukan_id? }
 */
router.put('/:id', [
  body('tipe')
    .isIn(['income', 'expense']).withMessage('Tipe harus income atau expense'),
  body('nominal')
    .isFloat({ min: 0.01 }).withMessage('Nominal harus lebih dari 0'),
  body('tanggal')
    .isDate().withMessage('Format tanggal tidak valid (YYYY-MM-DD)'),
  body('deskripsi')
    .optional().trim().isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
  body('pemasukan_id')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('pemasukan_id harus berupa ID yang valid'),
], ctrl.update);

/**
 * DELETE /api/transaksi/:id
 */
router.delete('/:id', ctrl.delete);

module.exports = router;
