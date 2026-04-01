const db = require('../config/db');

const PemasukanService = {

  async getAll(userId) {
    const [rows] = await db.query(
      'SELECT * FROM pemasukan WHERE pengguna_id = ? ORDER BY created_at DESC', [userId]
    );
    return rows;
  },

  async getById(userId, id) {
    const [rows] = await db.query(
      'SELECT * FROM pemasukan WHERE id = ? AND pengguna_id = ?', [id, userId]
    );
    if (!rows.length) throw Object.assign(new Error('Pemasukan tidak ditemukan'), { status: 404 });
    return rows[0];
  },

  async create(userId, { nominal }) {
    const [res] = await db.query(
      'INSERT INTO pemasukan (pengguna_id, nominal, is_aktif) VALUES (?, ?, 1)', [userId, nominal]
    );
    return this.getById(userId, res.insertId);
  },

  async update(userId, id, { nominal, is_aktif }) {
    await this.getById(userId, id);
    // is_aktif di DB: tinyint(1), default '0' — kita simpan 0/1
    const aktif = is_aktif !== undefined ? (is_aktif ? 1 : 0) : 1;
    await db.query(
      'UPDATE pemasukan SET nominal = ?, is_aktif = ? WHERE id = ? AND pengguna_id = ?',
      [nominal, aktif, id, userId]
    );
    return this.getById(userId, id);
  },

  async delete(userId, id) {
    await this.getById(userId, id);
    await db.query('DELETE FROM pemasukan WHERE id = ? AND pengguna_id = ?', [id, userId]);
    return { message: 'Pemasukan berhasil dihapus' };
  },
};

module.exports = PemasukanService;
