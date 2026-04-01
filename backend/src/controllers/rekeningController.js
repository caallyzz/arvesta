const { validationResult } = require('express-validator');
const svc = require('../services/rekeningService');

const validate = (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) { res.status(400).json({ success: false, errors: err.array() }); return false; }
  return true;
};

module.exports = {
  async getAll(req, res, next) {
    try { res.json({ success: true, data: await svc.getAll(req.user.id) }); }
    catch (e) { next(e); }
  },
  async getById(req, res, next) {
    try { res.json({ success: true, data: await svc.getById(req.user.id, req.params.id) }); }
    catch (e) { next(e); }
  },
  async create(req, res, next) {
    try {
      if (!validate(req, res)) return;
      const data = await svc.create(req.user.id, req.body);
      res.status(201).json({ success: true, message: 'Rekening berhasil dibuat', data });
    } catch (e) { next(e); }
  },
  async join(req, res, next) {
    try {
      if (!validate(req, res)) return;
      const data = await svc.join(req.user.id, req.body);
      res.json({ success: true, message: 'Berhasil bergabung ke rekening', data });
    } catch (e) { next(e); }
  },
  async getAnggota(req, res, next) {
    try { res.json({ success: true, data: await svc.getAnggota(req.user.id, req.params.id) }); }
    catch (e) { next(e); }
  },
  async getTransaksi(req, res, next) {
    try { res.json({ success: true, data: await svc.getTransaksi(req.user.id, req.params.id, req.query) }); }
    catch (e) { next(e); }
  },
  async tambahTransaksi(req, res, next) {
    try {
      if (!validate(req, res)) return;
      const data = await svc.tambahTransaksi(req.user.id, req.params.id, req.body);
      res.status(201).json({ success: true, message: 'Transaksi rekening ditambahkan', data });
    } catch (e) { next(e); }
  },
};