const { validationResult } = require('express-validator');
const svc = require('../services/authService');

const validate = (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) { res.status(400).json({ success: false, errors: err.array() }); return false; }
  return true;
};

module.exports = {
  async register(req, res, next) {
    try {
      if (!validate(req, res)) return;
      const data = await svc.register(req.body);
      res.status(201).json({ success: true, message: 'Registrasi berhasil', data });
    } catch (e) { next(e); }
  },

  async login(req, res, next) {
    try {
      if (!validate(req, res)) return;
      const data = await svc.login(req.body);
      res.json({ success: true, message: 'Login berhasil', data });
    } catch (e) { next(e); }
  },

  async getProfile(req, res, next) {
    try {
      const data = await svc.getProfile(req.user.id);
      res.json({ success: true, data });
    } catch (e) { next(e); }
  },

  async updateProfile(req, res, next) {
    try {
      if (!validate(req, res)) return;
      const data = await svc.updateProfile(req.user.id, req.body);
      res.json({ success: true, message: 'Profil diperbarui', data });
    } catch (e) { next(e); }
  },

  async changePassword(req, res, next) {
    try {
      if (!validate(req, res)) return;
      const data = await svc.changePassword(req.user.id, req.body);
      res.json({ success: true, ...data });
    } catch (e) { next(e); }
  },
};