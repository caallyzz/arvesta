<<<<<<< HEAD
=======
/**
 * TransaksiContext.jsx
 * Single source of truth untuk data transaksi.
 * Taruh file ini di: src/context/TransaksiContext.jsx
 *
 * CARA PAKAI:
 * 1. Wrap App (atau layout) dengan <TransaksiProvider>
 * 2. Di setiap halaman: const { transaksi, summary, addTransaksi, ... } = useTransaksi()
 */

>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from 'react'
import { transaksiAPI } from '../services/api'
import { MOCK_SUMMARY, MOCK_CHART_DATA, MOCK_PIE_DATA, getErrorMessage } from '../utils/mockData'

<<<<<<< HEAD
const TransaksiContext = createContext(null)

=======
/* ─── Context ──────────────────────────────────────────────────────────────── */
const TransaksiContext = createContext(null)

/* ─── Provider ─────────────────────────────────────────────────────────────── */
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
export function TransaksiProvider({ children }) {
  const [transaksi,   setTransaksi]   = useState([])
  const [summary,     setSummary]     = useState(null)
  const [chartData,   setChartData]   = useState([])
  const [pieData,     setPieData]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [refreshing,  setRefreshing]  = useState(false)
  const [error,       setError]       = useState(null)

<<<<<<< HEAD
=======
  // Simpan bulan/tahun aktif agar bisa di-refresh dari mana saja
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  const activeFilter = useRef({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
  })

<<<<<<< HEAD
=======
  /* ── Fetch semua data sekaligus ─────────────────────────────────────────── */
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  const fetchAll = useCallback(async (opts = {}) => {
    const { bulan, tahun, isRefresh = false } = {
      ...activeFilter.current,
      ...opts,
    }
    activeFilter.current = { bulan, tahun }

    if (isRefresh) setRefreshing(true)
    else           setLoading(true)
    setError(null)

    try {
      const [summaryRes, listRes] = await Promise.allSettled([
        transaksiAPI.getSummary({ periode: 'bulanan', bulan, tahun }),
        transaksiAPI.getAll({ sortBy: 'tanggal', sortDir: 'DESC', limit: 100 }),
      ])

      if (summaryRes.status === 'fulfilled') {
        const d = summaryRes.value.data
        setSummary(d.summary   ?? d.data?.summary   ?? MOCK_SUMMARY)
        setChartData(d.chartData ?? d.data?.chartData ?? MOCK_CHART_DATA)
        setPieData(  d.pieData   ?? d.data?.pieData   ?? MOCK_PIE_DATA)
      } else {
        setSummary(MOCK_SUMMARY)
        setChartData(MOCK_CHART_DATA)
        setPieData(MOCK_PIE_DATA)
      }

      if (listRes.status === 'fulfilled') {
        const d    = listRes.value.data
        const list = d.data ?? d.transaksi ?? d ?? []
        setTransaksi(Array.isArray(list) ? list : [])
      } else {
        setTransaksi([])
      }

      if (summaryRes.status === 'rejected' && listRes.status === 'rejected') {
        setError(getErrorMessage(summaryRes.reason))
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

<<<<<<< HEAD
  useEffect(() => { fetchAll() }, [fetchAll])

  const addTransaksi = useCallback(async (data) => {
    const res = await transaksiAPI.create(data)
    const newTrx = res.data?.data ?? res.data
    setTransaksi(prev => [newTrx, ...prev])
=======
  /* ── Fetch on mount ─────────────────────────────────────────────────────── */
  useEffect(() => { fetchAll() }, [fetchAll])

  /* ── CRUD helpers — otomatis re-fetch summary setelah mutasi ─────────────── */

  /** Tambah transaksi baru */
  const addTransaksi = useCallback(async (data) => {
    const res = await transaksiAPI.create(data)
    // Optimistic: tambah ke list lokal dulu, lalu re-fetch summary
    const newTrx = res.data?.data ?? res.data
    setTransaksi(prev => [newTrx, ...prev])
    // Re-fetch summary agar angka dashboard akurat
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    fetchAll({ isRefresh: true })
    return newTrx
  }, [fetchAll])

<<<<<<< HEAD
=======
  /** Edit transaksi */
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  const updateTransaksi = useCallback(async (id, data) => {
    const res = await transaksiAPI.update(id, data)
    const updated = res.data?.data ?? res.data
    setTransaksi(prev => prev.map(t => t.id === id ? updated : t))
    fetchAll({ isRefresh: true })
    return updated
  }, [fetchAll])

<<<<<<< HEAD
=======
  /** Hapus transaksi */
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  const deleteTransaksi = useCallback(async (id) => {
    await transaksiAPI.delete(id)
    setTransaksi(prev => prev.filter(t => t.id !== id))
    fetchAll({ isRefresh: true })
  }, [fetchAll])

<<<<<<< HEAD
  const refresh = useCallback(() => fetchAll({ isRefresh: true }), [fetchAll])

=======
  /** Manual refresh (misal: dari tombol Refresh di header) */
  const refresh = useCallback(() => fetchAll({ isRefresh: true }), [fetchAll])

  /** Ganti periode bulan/tahun */
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  const setPeriode = useCallback((bulan, tahun) => {
    fetchAll({ bulan, tahun })
  }, [fetchAll])

<<<<<<< HEAD
  const value = {
=======
  /* ── Value ──────────────────────────────────────────────────────────────── */
  const value = {
    // Data
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    transaksi,
    summary,
    chartData,
    pieData,
<<<<<<< HEAD
    loading,
    refreshing,
    error,

=======
    // Status
    loading,
    refreshing,
    error,
    // Actions
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    addTransaksi,
    updateTransaksi,
    deleteTransaksi,
    refresh,
    setPeriode,
  }

  return (
    <TransaksiContext.Provider value={value}>
      {children}
    </TransaksiContext.Provider>
  )
}

<<<<<<< HEAD
=======
/* ─── Hook ──────────────────────────────────────────────────────────────────── */
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
export function useTransaksi() {
  const ctx = useContext(TransaksiContext)
  if (!ctx) throw new Error('useTransaksi harus digunakan di dalam TransaksiProvider')
  return ctx
}