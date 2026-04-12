const db      = require('../config/db');
const fs      = require('fs');
const path    = require('path');
const Tesseract = require('tesseract.js');
require('dotenv').config();

function parseNominal(teks) {
  if (!teks) return null;
  const matches = [...teks.matchAll(/(?:grand\s*total|total\s*payment|total\s*bayar|total\s*jumlah|jumlah\s*bayar|total|bayar|payment)[^\d]*(?:rp\.?\s*)?(\d[\d.,]+)/gi)];
  if (matches.length > 0) {
    const raw = matches[matches.length - 1][1];
    const cleaned = raw.replace(/\./g, '').replace(',', '.');
    const nominal = parseFloat(cleaned);
    if (!isNaN(nominal) && nominal > 0) return nominal;
  }
  const allNumbers = [...teks.matchAll(/(?:rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{0,2})?|\d{4,})/gi)];
  if (allNumbers.length > 0) {
    const parsed = allNumbers
      .map(m => parseFloat(m[1].replace(/\./g, '').replace(',', '.')))
      .filter(n => !isNaN(n) && n > 0);
    if (parsed.length > 0) return Math.max(...parsed);
  }
  return null;
}

function parseTanggal(teks) {
  if (!teks) return null;
  const bulanMap = {
    jan:'01',feb:'02',mar:'03',apr:'04',mei:'05',may:'05',
    jun:'06',jul:'07',agu:'08',aug:'08',sep:'09',
    okt:'10',oct:'10',nov:'11',des:'12',dec:'12',
  };
  let m = teks.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  m = teks.match(/(\d{4})[\/\-](\d{2})[\/\-](\d{2})/);
  if (m && parseInt(m[1]) >= 2000) return `${m[1]}-${m[2]}-${m[3]}`;
  m = teks.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|Mei|May|Jun|Jul|Agu|Aug|Sep|Okt|Oct|Nov|Des|Dec)[a-z]*\s+(\d{4})/i);
  if (m) {
    const bln = bulanMap[m[2].toLowerCase().slice(0,3)];
    if (bln) return `${m[3]}-${bln}-${m[1].padStart(2,'0')}`;
  }
  return null;
}

function parseMerchant(teks) {
  if (!teks) return null;
  const lines = teks.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  for (const line of lines.slice(0, 5)) {
    if (!/^\d+$/.test(line) && !/^[=\-*]+$/.test(line)) {
      return line.slice(0, 100);
    }
  }
  return null;
}

function parseKategori(teks) {
  if (!teks) return 'Lainnya';
  const t = teks.toLowerCase();
  if (/kopi|cafe|coffee|resto|restoran|makan|food|burger|pizza|bakso|mie|nasi|drink|minuman|warung|kedai/.test(t)) return 'Makanan & Minuman';
  if (/indomaret|alfamart|supermarket|hypermart|giant|hero|shop|toko|market|mall|belanja/.test(t)) return 'Belanja';
  if (/grab|gojek|ojek|taxi|taksi|parkir|toll|tol|bensin|bbm|pertamina|shell/.test(t)) return 'Transportasi';
  if (/apotek|apotik|klinik|rumah sakit|rs |dokter|medis|health|obat/.test(t)) return 'Kesehatan';
  if (/bioskop|cinema|game|hiburan|hotel|resort|wisata/.test(t)) return 'Hiburan';
  if (/listrik|pln|pdam|air|telepon|telkom|internet|tagihan|bill/.test(t)) return 'Tagihan';
  return 'Lainnya';
}

const ScanStrukService = {

  async scan(userId, filePath) {
    let nominal = null, tanggal = null, teks = null, merchant = null, kategori = null;
    try {
      console.log('🔍 Mulai OCR Tesseract...');
      const result = await Tesseract.recognize(filePath, 'ind+eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            process.stdout.write(`\r   Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
      teks     = result.data.text || null;
      nominal  = parseNominal(teks);
      tanggal  = parseTanggal(teks);
      merchant = parseMerchant(teks);
      kategori = parseKategori(teks);
      console.log('\n✅ OCR selesai');
      console.log('   Merchant :', merchant);
      console.log('   Nominal  :', nominal);
      console.log('   Tanggal  :', tanggal);
      console.log('   Kategori :', kategori);
    } catch (e) {
      console.error('❌ OCR Tesseract gagal:', e.message);
    }

    const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const [res] = await db.query(
      `INSERT INTO scan_struk (pengguna_id, path_gambar, merchant, nominal_terbaca, tanggal_terbaca, teks_terbaca, kategori)
       VALUES (?,?,?,?,?,?,?)`,
      [userId, relPath, merchant, nominal, tanggal, teks, kategori]
    );
    return this.getById(userId, res.insertId);
  },

  async getAll(userId) {
    const [rows] = await db.query(
      'SELECT * FROM scan_struk WHERE pengguna_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async getById(userId, id) {
    const [rows] = await db.query(
      'SELECT * FROM scan_struk WHERE id = ? AND pengguna_id = ?',
      [id, userId]
    );
    if (!rows.length) throw Object.assign(new Error('Scan tidak ditemukan'), { status: 404 });
    return rows[0];
  },

  async update(userId, id, { nominal_terbaca, tanggal_terbaca, teks_terbaca, merchant, kategori }) {
    await this.getById(userId, id);
    await db.query(
      `UPDATE scan_struk SET nominal_terbaca=?, tanggal_terbaca=?, teks_terbaca=?, merchant=?, kategori=?
       WHERE id=? AND pengguna_id=?`,
      [nominal_terbaca, tanggal_terbaca, teks_terbaca, merchant, kategori, id, userId]
    );
    return this.getById(userId, id);
  },

  async simpanKeTransaksi(userId, id, { deskripsi }) {
    const scan = await this.getById(userId, id);
    if (!scan.nominal_terbaca) {
      throw Object.assign(new Error('Nominal tidak tersedia, edit dulu hasil scan'), { status: 400 });
    }
    const tgl = scan.tanggal_terbaca || new Date().toISOString().split('T')[0];
    const [res] = await db.query(
      'INSERT INTO transaksi (pengguna_id, pemasukan_id, tipe, nominal, deskripsi, tanggal) VALUES (?,NULL,?,?,?,?)',
      [userId, 'expense', scan.nominal_terbaca, deskripsi || scan.merchant || scan.teks_terbaca || 'Dari scan struk', tgl]
    );
    return { transaksi_id: res.insertId, message: 'Berhasil disimpan sebagai transaksi' };
  },

  async delete(userId, id) {
    const scan = await this.getById(userId, id);
    try { if (fs.existsSync(scan.path_gambar)) fs.unlinkSync(scan.path_gambar); } catch (_) {}
    await db.query('DELETE FROM scan_struk WHERE id = ? AND pengguna_id = ?', [id, userId]);
    return { message: 'Scan berhasil dihapus' };
  },
};

module.exports = ScanStrukService;