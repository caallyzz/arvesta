const svc = require('../services/scanStrukService');

module.exports = {
  async scan(req, res, next) {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'File gambar wajib diupload (field: gambar)' });
      const data = await svc.scan(req.user.id, req.file.path);
      res.status(201).json({ success: true, message: 'Scan diproses', data });
    } catch (e) { next(e); }
  },
  async getAll(req, res, next) {
    try { res.json({ success: true, data: await svc.getAll(req.user.id) }); }
    catch (e) { next(e); }
  },
  async getById(req, res, next) {
    try { res.json({ success: true, data: await svc.getById(req.user.id, req.params.id) }); }
    catch (e) { next(e); }
  },
  async update(req, res, next) {
    try {
      const data = await svc.update(req.user.id, req.params.id, req.body);
      res.json({ success: true, message: 'Hasil scan diperbarui', data });
    } catch (e) { next(e); }
  },
  async simpanKeTransaksi(req, res, next) {
    try {
      const result = await svc.simpanKeTransaksi(req.user.id, req.params.id, req.body);
      res.status(201).json({ success: true, ...result });
    } catch (e) { next(e); }
  },
  async delete(req, res, next) {
    try { res.json({ success: true, ...(await svc.delete(req.user.id, req.params.id)) }); }
    catch (e) { next(e); }
  },
};