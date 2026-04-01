const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const ctrl    = require('../controllers/authController');
const auth    = require('../middleware/auth');

/**
 * AUTH ROUTES
 * Base: /api/auth
 */

// ── PUBLIC ────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { username?, email, password }
 */
router.post('/register', [
  body('email')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Username minimal 2 karakter'),
], ctrl.register);

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', [
  body('email')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password wajib diisi'),
], ctrl.login);

// ── PROTECTED (butuh token) ───────────────────────────────────────────────────

/**
 * GET /api/auth/profile
 * Headers: Authorization: Bearer <token>
 */
router.get('/profile', auth, ctrl.getProfile);

/**
 * PUT /api/auth/profile
 * Body: { username }
 */
router.put('/profile', auth, [
  body('username')
    .trim()
    .isLength({ min: 2 }).withMessage('Username minimal 2 karakter'),
], ctrl.updateProfile);

/**
 * PUT /api/auth/change-password
 * Body: { oldPassword, newPassword }
 */
router.put('/change-password', auth, [
  body('oldPassword')
    .notEmpty().withMessage('Password lama wajib diisi'),
  body('newPassword')
    .isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
], ctrl.changePassword);

module.exports = router;
