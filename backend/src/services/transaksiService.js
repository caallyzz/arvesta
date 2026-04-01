const db = require('../config/db');

const TransaksiService = {

  /** GET /transaksi — list + filter + search + pagination */
  async getAll(userId, query) {
    const {
      tipe, dari, sampai, search,
      sortBy = 'tanggal', sortDir = 'DESC',
      page = 1, limit = 10,
    } = query;

    let where  = 'WHERE t.pengguna_id = ?';
    const vals = [userId];

    if (tipe)   { where += ' AND t.tipe = ?';         vals.push(tipe); }
    if (dari)   { where += ' AND t.tanggal >= ?';     vals.push(dari); }
    if (sampai) { where += ' AND t.tanggal <= ?';     vals.push(sampai); }
    if (search) { where += ' AND t.deskripsi LIKE ?'; vals.push(`%${search}%`); }

    const col    = ['tanggal','nominal','tipe','created_at'].includes(sortBy) ? sortBy : 'tanggal';
    const dir    = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const lim    = Math.min(parseInt(limit) || 10, 100);
    const offset = (Math.max(parseInt(page), 1) - 1) * lim;

    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM transaksi t ${where}`, vals);

    const [rows] = await db.query(
      `SELECT t.id, t.pengguna_id, t.pemasukan_id, t.tipe, t.nominal,
              t.deskripsi, t.tanggal, t.created_at,
              p.nominal AS pemasukan_nominal, p.is_aktif AS pemasukan_aktif
       FROM transaksi t
       LEFT JOIN pemasukan p ON t.pemasukan_id = p.id
       ${where}
       ORDER BY t.${col} ${dir}
       LIMIT ? OFFSET ?`,
      [...vals, lim, offset]
    );

    return { data: rows, total, page: parseInt(page), limit: lim, totalPages: Math.ceil(total / lim) };
  },

  /** GET /transaksi/:id */
  async getById(userId, id) {
    const [rows] = await db.query(
      'SELECT * FROM transaksi WHERE id = ? AND pengguna_id = ?', [id, userId]
    );
    if (!rows.length) throw Object.assign(new Error('Transaksi tidak ditemukan'), { status: 404 });
    return rows[0];
  },

  /** POST /transaksi */
  async create(userId, { tipe, nominal, deskripsi, tanggal, pemasukan_id }) {
    // Validasi pemasukan_id jika dikirim
    if (pemasukan_id) {
      const [p] = await db.query(
        'SELECT id, is_aktif FROM pemasukan WHERE id = ? AND pengguna_id = ?', [pemasukan_id, userId]
      );
      if (!p.length)    throw Object.assign(new Error('Pemasukan tidak ditemukan'), { status: 404 });
      if (!p[0].is_aktif) throw Object.assign(new Error('Pemasukan tidak aktif'), { status: 400 });
    }

    const [result] = await db.query(
      'INSERT INTO transaksi (pengguna_id, pemasukan_id, tipe, nominal, deskripsi, tanggal) VALUES (?,?,?,?,?,?)',
      [userId, pemasukan_id || null, tipe, nominal, deskripsi || null, tanggal]
    );
    return this.getById(userId, result.insertId);
  },

  /** PUT /transaksi/:id */
  async update(userId, id, { tipe, nominal, deskripsi, tanggal, pemasukan_id }) {
    await this.getById(userId, id); // pastikan milik user
    await db.query(
      'UPDATE transaksi SET tipe=?, nominal=?, deskripsi=?, tanggal=?, pemasukan_id=? WHERE id=? AND pengguna_id=?',
      [tipe, nominal, deskripsi || null, tanggal, pemasukan_id || null, id, userId]
    );
    return this.getById(userId, id);
  },

  /** DELETE /transaksi/:id */
  async delete(userId, id) {
    await this.getById(userId, id);
    await db.query('DELETE FROM transaksi WHERE id = ? AND pengguna_id = ?', [id, userId]);
    return { message: 'Transaksi berhasil dihapus' };
  },

  /**
   * GET /transaksi/summary
   * Mengembalikan total income, expense, saldo + chart data 30 hari terakhir.
   * Periode: harian | mingguan | bulanan (default)
   */
  async getSummary(userId, { periode = 'bulanan', tahun, bulan }) {
    const now   = new Date();
    const yr    = parseInt(tahun)  || now.getFullYear();
    const mo    = parseInt(bulan)  || (now.getMonth() + 1);

    let dateFilter = '';
    const p        = [userId];

    if (periode === 'harian') {
      dateFilter = 'AND tanggal = CURDATE()';
    } else if (periode === 'mingguan') {
      dateFilter = 'AND YEARWEEK(tanggal, 1) = YEARWEEK(CURDATE(), 1)';
    } else {
      dateFilter = 'AND YEAR(tanggal) = ? AND MONTH(tanggal) = ?';
      p.push(yr, mo);
    }

    const [[summary]] = await db.query(
      `SELECT
         COALESCE(SUM(CASE WHEN tipe='income'  THEN nominal ELSE 0 END), 0) AS total_income,
         COALESCE(SUM(CASE WHEN tipe='expense' THEN nominal ELSE 0 END), 0) AS total_expense,
         COALESCE(SUM(CASE WHEN tipe='income'  THEN nominal ELSE -nominal END), 0) AS saldo
       FROM transaksi
       WHERE pengguna_id = ? ${dateFilter}`,
      p
    );

    // Data chart: income & expense per hari selama 30 hari terakhir
    const [chartData] = await db.query(
      `SELECT tanggal, tipe, SUM(nominal) AS total
       FROM transaksi
       WHERE pengguna_id = ?
         AND tanggal >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY tanggal, tipe
       ORDER BY tanggal ASC`,
      [userId]
    );

    // Distribusi kategori tipe untuk pie chart
    const [pieData] = await db.query(
      `SELECT tipe, SUM(nominal) AS total
       FROM transaksi
       WHERE pengguna_id = ? ${dateFilter}
       GROUP BY tipe`,
      p
    );

    return { summary, chartData, pieData };
  },
};

module.exports = TransaksiService;