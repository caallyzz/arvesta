const db       = require('../config/db');
const axios    = require('axios');
const fs       = require('fs');
const path     = require('path');
const FormData = require('form-data');
require('dotenv').config();

const ScanStrukService = {

  /** POST /scan — upload gambar, kirim ke ai-service, simpan hasil */
  async scan(userId, filePath) {
    let nominal = null, tanggal = null, teks = null;

    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      const resp = await axios.post(`${process.env.OCR_API_URL}/scan`, form, {
        headers: form.getHeaders(),
        timeout: 30_000,
      });
      nominal = resp.data.nominal  || null;
      tanggal = resp.data.tanggal  || null;
      teks    = resp.data.teks     || null;
    } catch (e) {
      // ai-service belum aktif → simpan data kosong, user bisa edit manual
      console.warn('⚠️  OCR service tidak tersedia:', e.message);
    }

    // path_gambar: simpan path relatif
    const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

    const [res] = await db.query(
      `INSERT INTO scan_struk (pengguna_id, path_gambar, nominal_terbaca, tanggal_terbaca, teks_terbaca)
       VALUES (?,?,?,?,?)`,
      [userId, relPath, nominal, tanggal, teks]
    );
    return this.getById(userId, res.insertId);
  },

  /** GET /scan */
  async getAll(userId) {
    const [rows] = await db.query(
      'SELECT * FROM scan_struk WHERE pengguna_id = ? ORDER BY created_at DESC', [userId]
    );
    return rows;
  },

  /** GET /scan/:id */
  async getById(userId, id) {
    const [rows] = await db.query(
      'SELECT * FROM scan_struk WHERE id = ? AND pengguna_id = ?', [id, userId]
    );
    if (!rows.length) throw Object.assign(new Error('Scan tidak ditemukan'), { status: 404 });
    return rows[0];
  },

  /** PUT /scan/:id — user edit hasil OCR */
  async update(userId, id, { nominal_terbaca, tanggal_terbaca, teks_terbaca }) {
    await this.getById(userId, id);
    await db.query(
      `UPDATE scan_struk
       SET nominal_terbaca=?, tanggal_terbaca=?, teks_terbaca=?
       WHERE id=? AND pengguna_id=?`,
      [nominal_terbaca, tanggal_terbaca, teks_terbaca, id, userId]
    );
    return this.getById(userId, id);
  },

  /** POST /scan/:id/simpan — simpan ke tabel transaksi sebagai expense */
  async simpanKeTransaksi(userId, id, { deskripsi }) {
    const scan = await this.getById(userId, id);
    if (!scan.nominal_terbaca) {
      throw Object.assign(new Error('Nominal tidak tersedia, edit dulu hasil scan'), { status: 400 });
    }
    const tgl = scan.tanggal_terbaca || new Date().toISOString().split('T')[0];
    const [res] = await db.query(
      'INSERT INTO transaksi (pengguna_id, pemasukan_id, tipe, nominal, deskripsi, tanggal) VALUES (?,NULL,?,?,?,?)',
      [userId, 'expense', scan.nominal_terbaca, deskripsi || scan.teks_terbaca || 'Dari scan struk', tgl]
    );
    return { transaksi_id: res.insertId, message: 'Berhasil disimpan sebagai transaksi' };
  },

  /** DELETE /scan/:id */
  async delete(userId, id) {
    const scan = await this.getById(userId, id);
    try { if (fs.existsSync(scan.path_gambar)) fs.unlinkSync(scan.path_gambar); } catch (_) {}
    await db.query('DELETE FROM scan_struk WHERE id = ? AND pengguna_id = ?', [id, userId]);
    return { message: 'Scan berhasil dihapus' };
  },
};

module.exports = ScanStrukService;