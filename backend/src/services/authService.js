const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');
require('dotenv').config();

// ── helpers ───────────────────────────────────────────────────────────────────
const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const safeUser = (u) => ({ id: u.id, username: u.username, email: u.email, created_at: u.created_at });

// ── service ───────────────────────────────────────────────────────────────────
const AuthService = {

  /** POST /auth/register */
  async register({ username, email, password }) {
    const [exist] = await db.query('SELECT id FROM pengguna WHERE email = ?', [email]);
    if (exist.length) throw Object.assign(new Error('Email sudah terdaftar'), { status: 409 });

    const hashed = await bcrypt.hash(password, 12);
    const name   = username?.trim() || email.split('@')[0];

    const [res] = await db.query(
      'INSERT INTO pengguna (username, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );
    return { user: { id: res.insertId, username: name, email }, token: sign({ id: res.insertId, email }) };
  },

  /** POST /auth/login */
  async login({ email, password }) {
    const [rows] = await db.query('SELECT * FROM pengguna WHERE email = ?', [email]);
    if (!rows.length) throw Object.assign(new Error('Email atau password salah'), { status: 401 });

    const user    = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Object.assign(new Error('Email atau password salah'), { status: 401 });

    return { user: safeUser(user), token: sign({ id: user.id, email: user.email }) };
  },

  /** GET /auth/profile */
  async getProfile(userId) {
    const [rows] = await db.query(
      'SELECT id, username, email, created_at FROM pengguna WHERE id = ?', [userId]
    );
    if (!rows.length) throw Object.assign(new Error('User tidak ditemukan'), { status: 404 });
    return rows[0];
  },

  /** PUT /auth/profile */
  async updateProfile(userId, { username }) {
    await db.query('UPDATE pengguna SET username = ? WHERE id = ?', [username.trim(), userId]);
    return this.getProfile(userId);
  },

  /** PUT /auth/change-password */
  async changePassword(userId, { oldPassword, newPassword }) {
    const [rows] = await db.query('SELECT password FROM pengguna WHERE id = ?', [userId]);
    if (!rows.length) throw Object.assign(new Error('User tidak ditemukan'), { status: 404 });

    const ok = await bcrypt.compare(oldPassword, rows[0].password);
    if (!ok) throw Object.assign(new Error('Password lama tidak sesuai'), { status: 400 });

    await db.query('UPDATE pengguna SET password = ? WHERE id = ?', [await bcrypt.hash(newPassword, 12), userId]);
    return { message: 'Password berhasil diubah' };
  },
};

module.exports = AuthService;