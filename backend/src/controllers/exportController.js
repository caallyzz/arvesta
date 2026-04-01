const svc = require('../services/exportService');

module.exports = {
  async exportExcel(req, res, next) {
    try {
      const { dari, sampai } = req.query;
      if (!dari || !sampai) return res.status(400).json({ success: false, message: 'Parameter dari & sampai wajib diisi' });
      await svc.exportExcel(req.user.id, dari, sampai, res);
    } catch (e) { next(e); }
  },

  async exportPDF(req, res, next) {
    try {
      const { dari, sampai } = req.query;
      if (!dari || !sampai) return res.status(400).json({ success: false, message: 'Parameter dari & sampai wajib diisi' });
      await svc.exportPDF(req.user.id, dari, sampai, res);
    } catch (e) { next(e); }
  },

  async getRiwayat(req, res, next) {
    try { res.json({ success: true, data: await svc.getRiwayat(req.user.id) }); }
    catch (e) { next(e); }
  },
};