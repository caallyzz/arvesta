const rekeningService = require('../services/rekeningService');

// GET /api/rekening
exports.getAll = async (req, res, next) => {
  try {
    const result = await rekeningService.getAll(req.user.id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/rekening/:id
exports.getById = async (req, res, next) => {
  try {
    const result = await rekeningService.getById(req.user.id, req.params.id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/rekening
exports.create = async (req, res, next) => {
  try {
    const { nama, nomor_rekening, passkey, target_nominal } = req.body;
    const result = await rekeningService.create(req.user.id, {
      nama,
      nomor_rekening,
      passkey,
      target_nominal: target_nominal || 0
    });
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
};

// PUT /api/rekening/:id (TAMBAHKAN INI)
exports.update = async (req, res, next) => {
  try {
    const { nama, target_nominal } = req.body;
    const result = await rekeningService.update(req.user.id, req.params.id, {
      nama,
      target_nominal
    });
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/rekening/join
exports.join = async (req, res, next) => {
  try {
    const { nomor_rekening, passkey } = req.body;
    const result = await rekeningService.join(req.user.id, { nomor_rekening, passkey });
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/rekening/:id/anggota
exports.getAnggota = async (req, res, next) => {
  try {
    const result = await rekeningService.getAnggota(req.user.id, req.params.id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/rekening/:id/transaksi
exports.getTransaksi = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await rekeningService.getTransaksi(
      req.user.id,
      req.params.id,
      { page, limit }
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/rekening/:id/transaksi
exports.tambahTransaksi = async (req, res, next) => {
  try {
    const { tipe, nominal, deskripsi, tanggal } = req.body;
    const result = await rekeningService.tambahTransaksi(
      req.user.id,
      req.params.id,
      { tipe, nominal, deskripsi, tanggal }
    );
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
};