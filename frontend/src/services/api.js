import axios from 'axios'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('arvesta_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

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

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),

  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
}

export const pengaturanAPI = {
  getProfile: () => authAPI.getProfile(),
  updateProfile: (data) => authAPI.updateProfile(data),
  changePassword: (data) => authAPI.changePassword(data),
}

export const transaksiAPI = {
  getAll: (params = {}) => api.get('/transaksi', { params }),
  getSummary: (params = {}) => api.get('/transaksi/summary', { params }),
  getById: (id) => api.get(`/transaksi/${id}`),
  create: (data) => api.post('/transaksi', data),
  update: (id, data) => api.put(`/transaksi/${id}`, data),
  delete: (id) => api.delete(`/transaksi/${id}`),
}

export const pemasukanAPI = {
  getAll: () => api.get('/pemasukan'),
  getById: (id) => api.get(`/pemasukan/${id}`),
  create: (data) => api.post('/pemasukan', data),
  update: (id, data) => api.put(`/pemasukan/${id}`, data),
  delete: (id) => api.delete(`/pemasukan/${id}`),
}

export const rekeningAPI = {
  getAll: () => api.get('/rekening'),
  getById: (id) => api.get(`/rekening/${id}`),
  create: (data) => api.post('/rekening', data),
  update: (id, data) => api.put(`/rekening/${id}`, data), // ✅ TAMBAHKAN INI
  join: (data) => api.post('/rekening/join', data),
  getAnggota: (id) => api.get(`/rekening/${id}/anggota`),
  getTransaksi: (id, params) => api.get(`/rekening/${id}/transaksi`, { params }),
  tambahTransaksi: (id, data) => api.post(`/rekening/${id}/transaksi`, data),
}

export const notifikasiAPI = {
  getAll: () => api.get('/notifikasi'),
  countUnread: () => api.get('/notifikasi/unread'),
  markRead: (id) => api.put(`/notifikasi/${id}/read`),
  markAllRead: () => api.put('/notifikasi/all/read'),
}

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

export default api