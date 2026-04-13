import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from 'react'
import { transaksiAPI } from '../services/api'
import { MOCK_SUMMARY, MOCK_CHART_DATA, MOCK_PIE_DATA, getErrorMessage } from '../utils/mockData'

const TransaksiContext = createContext(null)

export function TransaksiProvider({ children }) {
  const [transaksi,   setTransaksi]   = useState([])
  const [summary,     setSummary]     = useState(null)
  const [chartData,   setChartData]   = useState([])
  const [pieData,     setPieData]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [refreshing,  setRefreshing]  = useState(false)
  const [error,       setError]       = useState(null)

  const activeFilter = useRef({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
  })

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

  useEffect(() => { fetchAll() }, [fetchAll])

  const addTransaksi = useCallback(async (data) => {
    const res = await transaksiAPI.create(data)
    const newTrx = res.data?.data ?? res.data
    setTransaksi(prev => [newTrx, ...prev])
    fetchAll({ isRefresh: true })
    return newTrx
  }, [fetchAll])

  const updateTransaksi = useCallback(async (id, data) => {
    const res = await transaksiAPI.update(id, data)
    const updated = res.data?.data ?? res.data
    setTransaksi(prev => prev.map(t => t.id === id ? updated : t))
    fetchAll({ isRefresh: true })
    return updated
  }, [fetchAll])

  const deleteTransaksi = useCallback(async (id) => {
    await transaksiAPI.delete(id)
    setTransaksi(prev => prev.filter(t => t.id !== id))
    fetchAll({ isRefresh: true })
  }, [fetchAll])

  const refresh = useCallback(() => fetchAll({ isRefresh: true }), [fetchAll])

  const setPeriode = useCallback((bulan, tahun) => {
    fetchAll({ bulan, tahun })
  }, [fetchAll])

  const value = {
    transaksi,
    summary,
    chartData,
    pieData,
    loading,
    refreshing,
    error,

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

export function useTransaksi() {
  const ctx = useContext(TransaksiContext)
  if (!ctx) throw new Error('useTransaksi harus digunakan di dalam TransaksiProvider')
  return ctx
}