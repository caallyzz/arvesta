const db = require('../config/db');

class NotifikasiService {
  // Simpan notif baru (dipanggil internal)
  async create(userId, { judul, pesan, tipe = 'transaksi' }) {
    await db.query(
      'INSERT INTO notifikasi (pengguna_id, judul, pesan, tipe) VALUES (?, ?, ?, ?)',
      [userId, judul, pesan, tipe]
    );
  }

  // Get notif user
  async getAll(userId) {
    const [rows] = await db.query(
      'SELECT * FROM notifikasi WHERE pengguna_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    return rows;
  }

  // Tandai dibaca
  async markRead(userId, id) {
    if (id === 'all') {
      await db.query('UPDATE notifikasi SET is_read = 1 WHERE pengguna_id = ?', [userId]);
    } else {
      await db.query('UPDATE notifikasi SET is_read = 1 WHERE id = ? AND pengguna_id = ?', [id, userId]);
    }
    return { message: 'Notifikasi ditandai dibaca' };
  }

  // Jumlah notif belum dibaca
  async countUnread(userId) {
    const [[{ count }]] = await db.query(
      'SELECT COUNT(*) as count FROM notifikasi WHERE pengguna_id = ? AND is_read = 0',
      [userId]
    );
    return { count };
  }
}

module.exports = new NotifikasiService();