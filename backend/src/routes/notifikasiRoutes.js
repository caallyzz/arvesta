const express = require('express');
const router = express.Router();
const notifikasiController = require('../controllers/notifikasiController');
const auth = require('../middleware/auth');

router.use(auth);

// GET /api/notifikasi
router.get('/', notifikasiController.getAll);

// GET /api/notifikasi/unread
router.get('/unread', notifikasiController.countUnread);

// PUT /api/notifikasi/:id/read  (id bisa 'all')
router.put('/:id/read', notifikasiController.markRead);

module.exports = router;
