const db = require('../config/db');

const rekeningService = {

  // GET /rekening — list rekening yang diikuti user
  async getAll(userId) {
    const [rows] = await db.query(
      `SELECT rb.id, rb.nama, rb.target_nominal, rb.nomor_rekening, rb.dibuat_oleh, rb.created_at,
              ar.role,
              COALESCE(SUM(CASE WHEN tr.tipe='deposit' THEN tr.nominal
                                WHEN tr.tipe='withdraw' THEN -tr.nominal END), 0) AS saldo,
              COUNT(DISTINCT ar2.pengguna_id) AS jumlah_anggota
       FROM rekening_bersama rb
       JOIN anggota_rekening ar ON ar.rekening_id = rb.id AND ar.pengguna_id = ?
       LEFT JOIN transaksi_rekening tr ON tr.rekening_id = rb.id
       LEFT JOIN anggota_rekening ar2 ON ar2.rekening_id = rb.id
       GROUP BY rb.id, ar.role
       ORDER BY rb.created_at DESC`,
      [userId]
    );
    return rows;
  },

  // GET /rekening/:id — detail rekening
  async getById(userId, id) {
    const [rows] = await db.query(
      `SELECT rb.id, rb.nama, rb.target_nominal, rb.nomor_rekening, rb.dibuat_oleh, rb.created_at,
              ar.role,
              COALESCE(SUM(CASE WHEN tr.tipe='deposit' THEN tr.nominal
                                WHEN tr.tipe='withdraw' THEN -tr.nominal END), 0) AS saldo
       FROM rekening_bersama rb
       JOIN anggota_rekening ar ON ar.rekening_id = rb.id AND ar.pengguna_id = ?
       LEFT JOIN transaksi_rekening tr ON tr.rekening_id = rb.id
       WHERE rb.id = ?
       GROUP BY rb.id, ar.role`,
      [userId, id]
    );
    if (!rows.length) {
      const error = new Error('Rekening tidak ditemukan atau akses ditolak');
      error.status = 404;
      throw error;
    }
    return rows[0];
  },

  // POST /rekening — buat rekening baru
  async create(userId, { nama, nomor_rekening, passkey, target_nominal }) {
    const [exist] = await db.query(
      'SELECT id FROM rekening_bersama WHERE nomor_rekening = ?',
      [nomor_rekening]
    );
    if (exist.length) {
      const error = new Error('Nomor rekening sudah digunakan');
      error.status = 409;
      throw error;
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      const [res] = await conn.query(
        `INSERT INTO rekening_bersama (nama, target_nominal, nomor_rekening, passkey, dibuat_oleh) 
         VALUES (?, ?, ?, ?, ?)`,
        [nama, target_nominal || 0, nomor_rekening, passkey, userId]
      );
      
      await conn.query(
        `INSERT INTO anggota_rekening (rekening_id, pengguna_id, role) 
         VALUES (?, ?, ?)`,
        [res.insertId, userId, 'owner']
      );
      
      await conn.commit();
      return this.getById(userId, res.insertId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // PUT /rekening/:id — update rekening
  async update(userId, id, { nama, target_nominal }) {
    const rekening = await this.getById(userId, id);
    if (rekening.role !== 'owner') {
      const error = new Error('Hanya pemilik rekening yang bisa mengedit');
      error.status = 403;
      throw error;
    }

    const updates = [];
    const values = [];
    
    if (nama !== undefined) {
      updates.push('nama = ?');
      values.push(nama);
    }
    if (target_nominal !== undefined) {
      updates.push('target_nominal = ?');
      values.push(target_nominal);
    }
    
    if (updates.length === 0) return rekening;
    
    values.push(id);
    await db.query(
      `UPDATE rekening_bersama SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getById(userId, id);
  },

  // POST /rekening/join — join rekening
  async join(userId, { nomor_rekening, passkey }) {
    const [rows] = await db.query(
      'SELECT * FROM rekening_bersama WHERE nomor_rekening = ? AND passkey = ?',
      [nomor_rekening, passkey]
    );
    if (!rows.length) {
      const error = new Error('Nomor rekening atau passkey salah');
      error.status = 400;
      throw error;
    }

    const rekening = rows[0];
    const [already] = await db.query(
      'SELECT id FROM anggota_rekening WHERE rekening_id = ? AND pengguna_id = ?',
      [rekening.id, userId]
    );
    if (already.length) {
      const error = new Error('Kamu sudah menjadi anggota rekening ini');
      error.status = 409;
      throw error;
    }

    await db.query(
      'INSERT INTO anggota_rekening (rekening_id, pengguna_id, role) VALUES (?, ?, ?)',
      [rekening.id, userId, 'member']
    );
    return this.getById(userId, rekening.id);
  },

  // GET /rekening/:id/anggota
  async getAnggota(userId, rekeningId) {
    await this.getById(userId, rekeningId);
    const [rows] = await db.query(
      `SELECT ar.id, ar.rekening_id, ar.pengguna_id, ar.role, ar.bergabung_pada,
              p.username, p.email
       FROM anggota_rekening ar
       JOIN pengguna p ON p.id = ar.pengguna_id
       WHERE ar.rekening_id = ?
       ORDER BY ar.bergabung_pada ASC`,
      [rekeningId]
    );
    return rows;
  },

  // GET /rekening/:id/transaksi
  async getTransaksi(userId, rekeningId, { page = 1, limit = 20 } = {}) {
    await this.getById(userId, rekeningId);
    const lim = Math.min(parseInt(limit) || 20, 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * lim;

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM transaksi_rekening WHERE rekening_id = ?',
      [rekeningId]
    );
    
    const [rows] = await db.query(
      `SELECT tr.*, p.username AS nama_pengguna
       FROM transaksi_rekening tr
       JOIN pengguna p ON p.id = tr.pengguna_id
       WHERE tr.rekening_id = ?
       ORDER BY tr.tanggal DESC, tr.created_at DESC
       LIMIT ? OFFSET ?`,
      [rekeningId, lim, offset]
    );
    
    return { 
      data: rows, 
      total, 
      page: parseInt(page), 
      limit: lim, 
      totalPages: Math.ceil(total / lim) 
    };
  },

  // POST /rekening/:id/transaksi
  async tambahTransaksi(userId, rekeningId, { tipe, nominal, deskripsi, tanggal }) {
    await this.getById(userId, rekeningId);

    if (tipe === 'withdraw') {
      const [r] = await db.query(
        `SELECT COALESCE(SUM(CASE WHEN tipe='deposit' THEN nominal ELSE -nominal END), 0) AS saldo
         FROM transaksi_rekening WHERE rekening_id = ?`,
        [rekeningId]
      );
      if (+nominal > +r[0].saldo) {
        const error = new Error('Saldo rekening tidak cukup');
        error.status = 400;
        throw error;
      }
    }

    const [res] = await db.query(
      `INSERT INTO transaksi_rekening (rekening_id, pengguna_id, tipe, nominal, deskripsi, tanggal) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [rekeningId, userId, tipe, nominal, deskripsi || null, tanggal || new Date().toISOString().split('T')[0]]
    );
    
    return { 
      id: res.insertId, 
      rekening_id: rekeningId, 
      pengguna_id: userId, 
      tipe, 
      nominal, 
      deskripsi, 
      tanggal 
    };
  },
};

module.exports = rekeningService;