const { validationResult } = require('express-validator');
const svc = require('../services/transaksiService');

const validate = (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) { res.status(400).json({ success: false, errors: err.array() }); return false; }
  return true;
};

module.exports = {
  async getAll(req, res, next) {
    try {
      const data = await svc.getAll(req.user.id, req.query);
      res.json({ success: true, data });
    } catch (e) { next(e); }
  },

  async getSummary(req, res, next) {
    try {
      const data = await svc.getSummary(req.user.id, req.query);
      res.json({ success: true, data });
    } catch (e) { next(e); }
  },

  async getById(req, res, next) {
    try {
      const data = await svc.getById(req.user.id, req.params.id);
      res.json({ success: true, data });
    } catch (e) { next(e); }
  },

  async create(req, res, next) {
    try {
      if (!validate(req, res)) return;
      const data = await svc.create(req.user.id, req.body);
      res.status(201).json({ success: true, message: 'Transaksi ditambahkan', data });
    } catch (e) { next(e); }
  },

  async update(req, res, next) {
    try {
      if (!validate(req, res)) return;
      const data = await svc.update(req.user.id, req.params.id, req.body);
      res.json({ success: true, message: 'Transaksi diperbarui', data });
    } catch (e) { next(e); }
  },

  async delete(req, res, next) {
    try {
      const result = await svc.delete(req.user.id, req.params.id);
      res.json({ success: true, ...result });
    } catch (e) { next(e); }
  },
};