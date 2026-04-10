/**
 * FALLBACK DATA — hanya digunakan ketika API tidak tersedia
 * Data ini TIDAK boleh digunakan sebagai pengganti API call
 */

export const MOCK_SUMMARY = {
  total_income:  0,
  total_expense: 0,
  saldo:         0,
}

export const MOCK_TRANSAKSI = []
export const MOCK_PEMASUKAN = []
export const MOCK_REKENING  = []

export const MOCK_CHART_DATA = Array.from({ length: 6 }, (_, i) => ({
  bulan: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'][i],
  income:  0,
  expense: 0,
}))

export const MOCK_PIE_DATA = [
  { name: 'Belum ada data', value: 1, color: '#e5e7eb' },
]

/**
 * Format Rupiah
 */
export const formatRupiah = (amount) => {
  if (amount === null || amount === undefined) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

/**
 * Format tanggal ke string Indonesia
 */
export const formatTanggal = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

/**
 * Format tanggal + jam
 */
export const formatTanggalJam = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', {
    day:    'numeric',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

/**
 * Ambil pesan error dari Axios error response
 */
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Terjadi kesalahan. Silakan coba lagi.'
  )
}

/**
 * Trigger download file dari Blob (untuk export)
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href    = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
