const svc = require('../services/pemasukanService');

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
      const data = await svc.create(req.user.id, req.body);
      res.status(201).json({ success: true, message: 'Pemasukan ditambahkan', data });
    } catch (e) { next(e); }
  },
  async update(req, res, next) {
    try {
      const data = await svc.update(req.user.id, req.params.id, req.body);
      res.json({ success: true, message: 'Pemasukan diperbarui', data });
    } catch (e) { next(e); }
  },
  async delete(req, res, next) {
    try { res.json({ success: true, ...(await svc.delete(req.user.id, req.params.id)) }); }
    catch (e) { next(e); }
  },
};