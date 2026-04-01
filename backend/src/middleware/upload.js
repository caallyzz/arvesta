const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
require('dotenv').config();

const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase())
          && /image/.test(file.mimetype);
  ok ? cb(null, true) : cb(new Error('Hanya file gambar yang diperbolehkan'));
};

module.exports = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });