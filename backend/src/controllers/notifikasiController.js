const db = require('../config/db');

module.exports = {

  // GET /api/notifikasi
  async getAll(req, res, next) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM notifikasi WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id]
      );
      res.json({ success: true, data: rows });
    } catch (e) { next(e); }
  },

  // GET /api/notifikasi/unread
  async countUnread(req, res, next) {
    try {
      const [rows] = await db.query(
        'SELECT COUNT(*) AS count FROM notifikasi WHERE user_id = ? AND is_read = 0',
        [req.user.id]
      );
      res.json({ success: true, data: { count: rows[0].count } });
    } catch (e) { next(e); }
  },

  // PUT /api/notifikasi/:id/read  (id bisa 'all')
  async markRead(req, res, next) {
    try {
      const { id } = req.params;

      if (id === 'all') {
        await db.query(
          'UPDATE notifikasi SET is_read = 1 WHERE user_id = ?',
          [req.user.id]
        );
      } else {
        await db.query(
          'UPDATE notifikasi SET is_read = 1 WHERE id = ? AND user_id = ?',
          [id, req.user.id]
        );
      }

      res.json({ success: true, message: 'Notifikasi ditandai sudah dibaca' });
    } catch (e) { next(e); }
  },
};