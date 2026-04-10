import axios from 'axios'

// ── Base instance ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('arvesta_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 globally ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('arvesta_token')
      localStorage.removeItem('arvesta_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// AUTH  /api/auth
// ─────────────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getProfile:     () => api.get('/auth/profile'),
  updateProfile:  (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSAKSI  /api/transaksi
// ─────────────────────────────────────────────────────────────────────────────
export const transaksiAPI = {
  /**
   * @param {Object} params - tipe, dari, sampai, search, sortBy, sortDir, page, limit
   */
  getAll: (params = {}) => api.get('/transaksi', { params }),

  /**
   * @param {Object} params - periode, tahun, bulan
   * Response: { summary: {total_income, total_expense, saldo}, chartData, pieData }
   */
  getSummary: (params = {}) => api.get('/transaksi/summary', { params }),

  getById: (id) => api.get(`/transaksi/${id}`),

  /**
   * @param {Object} data - { tipe, nominal, tanggal, deskripsi?, pemasukan_id? }
   */
  create: (data) => api.post('/transaksi', data),

  /**
   * @param {number} id
   * @param {Object} data - { tipe, nominal, tanggal, deskripsi?, pemasukan_id? }
   */
  update: (id, data) => api.put(`/transaksi/${id}`, data),

  delete: (id) => api.delete(`/transaksi/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// PEMASUKAN  /api/pemasukan
// ─────────────────────────────────────────────────────────────────────────────
export const pemasukanAPI = {
  getAll:  ()        => api.get('/pemasukan'),
  getById: (id)      => api.get(`/pemasukan/${id}`),
  create:  (data)    => api.post('/pemasukan', data),           // { nominal }
  update:  (id, data) => api.put(`/pemasukan/${id}`, data),    // { nominal, is_aktif? }
  delete:  (id)      => api.delete(`/pemasukan/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// REKENING BERSAMA  /api/rekening
// ─────────────────────────────────────────────────────────────────────────────
export const rekeningAPI = {
  getAll:  ()        => api.get('/rekening'),
  getById: (id)      => api.get(`/rekening/${id}`),
  create:  (data)    => api.post('/rekening', data),            // { nama, nomor_rekening, passkey }
  join:    (data)    => api.post('/rekening/join', data),       // { nomor_rekening, passkey }

  getAnggota:       (id)         => api.get(`/rekening/${id}/anggota`),
  getTransaksi:     (id, params) => api.get(`/rekening/${id}/transaksi`, { params }),
  tambahTransaksi:  (id, data)   => api.post(`/rekening/${id}/transaksi`, data),
  // data: { tipe: 'deposit'|'withdraw', nominal, tanggal, deskripsi? }
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFIKASI  /api/notifikasi
// ─────────────────────────────────────────────────────────────────────────────
export const notifikasiAPI = {
  getAll:     ()   => api.get('/notifikasi'),
  countUnread: ()  => api.get('/notifikasi/unread'),
  markRead:   (id) => api.put(`/notifikasi/${id}/read`),   // id bisa 'all'
  markAllRead: ()  => api.put('/notifikasi/all/read'),
}

// ─────────────────────────────────────────────────────────────────────────────
// SCAN STRUK  /api/scan
// ─────────────────────────────────────────────────────────────────────────────
export const scanAPI = {
  getAll:  ()        => api.get('/scan'),
  getById: (id)      => api.get(`/scan/${id}`),

  /**
   * Upload gambar struk (multipart/form-data)
   * @param {FormData} formData — field: 'gambar'
   */
  scan: (formData) => api.post('/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  /**
   * Edit hasil OCR manual
   * @param {Object} data - { nominal_terbaca?, tanggal_terbaca?, teks_terbaca? }
   */
  update: (id, data) => api.put(`/scan/${id}`, data),

  /**
   * Simpan scan ke transaksi expense
   * @param {Object} data - { deskripsi? }
   */
  simpanKeTransaksi: (id, data = {}) => api.post(`/scan/${id}/simpan`, data),

  delete: (id) => api.delete(`/scan/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT  /api/export
// ─────────────────────────────────────────────────────────────────────────────
export const exportAPI = {
  /**
   * @param {string} dari   - YYYY-MM-DD
   * @param {string} sampai - YYYY-MM-DD
   */
  excel: (dari, sampai) => api.get('/export/excel', {
    params: { dari, sampai },
    responseType: 'blob',
  }),

  pdf: (dari, sampai) => api.get('/export/pdf', {
    params: { dari, sampai },
    responseType: 'blob',
  }),

  getRiwayat: () => api.get('/export/riwayat'),
}

export default api
