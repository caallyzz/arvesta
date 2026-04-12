import axios from 'axios'

// ── Base instance ─────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT ───────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('arvesta_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 ──────────────────────────
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


// ─────────────────────────────────────────────────────────────
// AUTH (PROFILE & PASSWORD = PENGATURAN)
// ─────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),

  // 🔥 INI YANG DIPAKAI DI HALAMAN PENGATURAN
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
}


// ─────────────────────────────────────────────────────────────
// 🔥 TAMBAHAN: PENGATURAN API (BIAR GA ERROR)
// ─────────────────────────────────────────────────────────────
export const pengaturanAPI = {
  getProfile: () => authAPI.getProfile(),
  updateProfile: (data) => authAPI.updateProfile(data),
  changePassword: (data) => authAPI.changePassword(data),
}


// ─────────────────────────────────────────────────────────────
// TRANSAKSI
// ─────────────────────────────────────────────────────────────
export const transaksiAPI = {
  getAll: (params = {}) => api.get('/transaksi', { params }),
  getSummary: (params = {}) => api.get('/transaksi/summary', { params }),
  getById: (id) => api.get(`/transaksi/${id}`),
  create: (data) => api.post('/transaksi', data),
  update: (id, data) => api.put(`/transaksi/${id}`, data),
  delete: (id) => api.delete(`/transaksi/${id}`),
}


// ─────────────────────────────────────────────────────────────
// PEMASUKAN
// ─────────────────────────────────────────────────────────────
export const pemasukanAPI = {
  getAll: () => api.get('/pemasukan'),
  getById: (id) => api.get(`/pemasukan/${id}`),
  create: (data) => api.post('/pemasukan', data),
  update: (id, data) => api.put(`/pemasukan/${id}`, data),
  delete: (id) => api.delete(`/pemasukan/${id}`),
}


// ─────────────────────────────────────────────────────────────
// REKENING BERSAMA
// ─────────────────────────────────────────────────────────────
export const rekeningAPI = {
  getAll: () => api.get('/rekening'),
  getById: (id) => api.get(`/rekening/${id}`),
  create: (data) => api.post('/rekening', data),
  join: (data) => api.post('/rekening/join', data),

  getAnggota: (id) => api.get(`/rekening/${id}/anggota`),
  getTransaksi: (id, params) => api.get(`/rekening/${id}/transaksi`, { params }),
  tambahTransaksi: (id, data) => api.post(`/rekening/${id}/transaksi`, data),
}


// ─────────────────────────────────────────────────────────────
// NOTIFIKASI
// ─────────────────────────────────────────────────────────────
export const notifikasiAPI = {
  getAll: () => api.get('/notifikasi'),
  countUnread: () => api.get('/notifikasi/unread'),
  markRead: (id) => api.put(`/notifikasi/${id}/read`),
  markAllRead: () => api.put('/notifikasi/all/read'),
}


// ─────────────────────────────────────────────────────────────
// SCAN STRUK
// ─────────────────────────────────────────────────────────────
export const scanAPI = {
  getAll: () => api.get('/scan'),
  getById: (id) => api.get(`/scan/${id}`),

  scan: (formData) =>
    api.post('/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, data) => api.put(`/scan/${id}`, data),
  simpanKeTransaksi: (id, data = {}) =>
    api.post(`/scan/${id}/simpan`, data),

  delete: (id) => api.delete(`/scan/${id}`),
}


// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────
export const exportAPI = {
  excel: (dari, sampai) =>
    api.get('/export/excel', {
      params: { dari, sampai },
      responseType: 'blob',
    }),

  pdf: (dari, sampai) =>
    api.get('/export/pdf', {
      params: { dari, sampai },
      responseType: 'blob',
    }),

  getRiwayat: () => api.get('/export/riwayat'),
}


// ─────────────────────────────────────────────────────────────
export default api