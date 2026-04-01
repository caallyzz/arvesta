const db      = require('../config/db');
const ExcelJS = require('exceljs');
const PDFDoc  = require('pdfkit');

const ExportService = {

  /** Simpan log ke tabel riwayat_export */
  async _log(userId, format, tanggal_mulai, tanggal_selesai) {
    await db.query(
      'INSERT INTO riwayat_export (pengguna_id, format, tanggal_mulai, tanggal_selesai) VALUES (?,?,?,?)',
      [userId, format, tanggal_mulai, tanggal_selesai]
    );
  },

  /** Ambil transaksi user dalam rentang tanggal */
  async _getData(userId, dari, sampai) {
    const [rows] = await db.query(
      `SELECT tipe, nominal, deskripsi, tanggal
       FROM transaksi
       WHERE pengguna_id = ? AND tanggal BETWEEN ? AND ?
       ORDER BY tanggal ASC`,
      [userId, dari, sampai]
    );
    return rows;
  },

  // ── Excel ──────────────────────────────────────────────────────────────────
  async exportExcel(userId, dari, sampai, res) {
    const data = await this._getData(userId, dari, sampai);
    await this._log(userId, 'excel', dari, sampai);

    const wb    = new ExcelJS.Workbook();
    wb.creator  = 'Arvesta';
    const sheet = wb.addWorksheet('Transaksi');

    sheet.columns = [
      { header: 'No',          key: 'no',       width: 6  },
      { header: 'Tanggal',     key: 'tanggal',  width: 15 },
      { header: 'Tipe',        key: 'tipe',     width: 14 },
      { header: 'Nominal (Rp)',key: 'nominal',  width: 22 },
      { header: 'Deskripsi',   key: 'deskripsi',width: 40 },
    ];

    // Style header
    sheet.getRow(1).eachCell(cell => {
      cell.fill       = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1976D2' } };
      cell.font       = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.alignment  = { vertical: 'middle', horizontal: 'center' };
      cell.border     = { bottom: { style: 'thin', color: { argb: 'FFBBDEFB' } } };
    });

    let totalIncome = 0, totalExpense = 0;

    data.forEach((row, i) => {
      const r = sheet.addRow({
        no:       i + 1,
        tanggal:  row.tanggal,
        tipe:     row.tipe === 'income' ? 'Pemasukan' : 'Pengeluaran',
        nominal:  parseFloat(row.nominal),
        deskripsi:row.deskripsi || '-',
      });
      r.getCell('tipe').font = {
        bold:  true,
        color: { argb: row.tipe === 'income' ? 'FF2E7D32' : 'FFC62828' },
      };
      r.getCell('nominal').numFmt = '#,##0.00';
      if (row.tipe === 'income') totalIncome  += +row.nominal;
      else                       totalExpense += +row.nominal;
    });

    // Baris ringkasan
    sheet.addRow([]);
    const addSummaryRow = (label, value, color) => {
      const r = sheet.addRow({ no: '', tanggal: label, tipe: '', nominal: value, deskripsi: '' });
      r.font = { bold: true, color: { argb: color } };
      r.getCell('nominal').numFmt = '#,##0.00';
    };
    addSummaryRow('Total Pemasukan',  totalIncome,               'FF2E7D32');
    addSummaryRow('Total Pengeluaran',totalExpense,              'FFC62828');
    addSummaryRow('Saldo',            totalIncome - totalExpense, 'FF1565C0');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="transaksi_${dari}_${sampai}.xlsx"`);
    await wb.xlsx.write(res);
  },

  // ── PDF ────────────────────────────────────────────────────────────────────
  async exportPDF(userId, dari, sampai, res) {
    const data = await this._getData(userId, dari, sampai);
    await this._log(userId, 'pdf', dari, sampai);

    const doc = new PDFDoc({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="transaksi_${dari}_${sampai}.pdf"`);
    doc.pipe(res);

    // Header
    doc.fontSize(18).font('Helvetica-Bold')
       .text('Laporan Transaksi Arvesta', { align: 'center' });
    doc.fontSize(11).font('Helvetica')
       .text(`Periode: ${dari}  s/d  ${sampai}`, { align: 'center' });
    doc.moveDown(1.5);

    // Kolom posisi
    const X = { no: 50, tanggal: 70, tipe: 160, nominal: 240, deskripsi: 370 };

    // Table header
    doc.fontSize(10).font('Helvetica-Bold')
       .fillColor('#1565C0')
       .text('No',        X.no,       doc.y)
       .text('Tanggal',   X.tanggal,  doc.y - 12, { width: 90 })
       .text('Tipe',      X.tipe,     doc.y - 12, { width: 80 })
       .text('Nominal',   X.nominal,  doc.y - 12, { width: 130 })
       .text('Deskripsi', X.deskripsi,doc.y - 12, { width: 175 });

    doc.fillColor('#000000');
    doc.moveTo(50, doc.y + 2).lineTo(545, doc.y + 2).stroke('#1565C0');
    doc.moveDown(0.3);

    let totalIncome = 0, totalExpense = 0;

    data.forEach((row, i) => {
      if (doc.y > 720) doc.addPage();

      const y   = doc.y;
      const nom = `Rp ${parseFloat(row.nominal).toLocaleString('id-ID')}`;
      const col = row.tipe === 'income' ? '#2E7D32' : '#C62828';

      doc.fontSize(9).font('Helvetica')
         .fillColor('#000')
         .text(String(i + 1),        X.no,       y, { width: 18 })
         .text(String(row.tanggal),  X.tanggal,  y, { width: 90 })
         .fillColor(col)
         .text(row.tipe === 'income' ? 'Pemasukan' : 'Pengeluaran', X.tipe, y, { width: 80 })
         .fillColor('#000')
         .text(nom,                  X.nominal,  y, { width: 130 })
         .text(row.deskripsi || '-', X.deskripsi,y, { width: 175 });

      if (row.tipe === 'income') totalIncome  += +row.nominal;
      else                       totalExpense += +row.nominal;
    });

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#1565C0');
    doc.moveDown(0.5);

    doc.fontSize(10).font('Helvetica-Bold');
    const fmt = (n) => `Rp ${n.toLocaleString('id-ID')}`;
    doc.fillColor('#2E7D32').text(`Total Pemasukan   : ${fmt(totalIncome)}`);
    doc.fillColor('#C62828').text(`Total Pengeluaran  : ${fmt(totalExpense)}`);
    doc.fillColor('#1565C0').text(`Saldo              : ${fmt(totalIncome - totalExpense)}`);

    doc.end();
  },

  // ── Riwayat export ────────────────────────────────────────────────────────
  async getRiwayat(userId) {
    const [rows] = await db.query(
      'SELECT * FROM riwayat_export WHERE pengguna_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },
};

module.exports = ExportService;