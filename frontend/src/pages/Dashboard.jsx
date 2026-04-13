import React, { useEffect, useState, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Menu, RefreshCw, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { transaksiAPI } from '../services/api'
import { getErrorMessage, MOCK_SUMMARY, MOCK_CHART_DATA, MOCK_PIE_DATA } from '../utils/mockData'
import SummaryCard       from '../components/SummaryCard'
import SavingsTarget     from '../components/SavingsTarget'
import ExpenseDonutChart from '../components/ExpenseDonutChart'
import MonthlyTrendChart from '../components/MonthlyTrendChart'
import TransactionList   from '../components/TransactionList'

const GREETINGS = () => {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
}

const EMOJI = () => {
  const h = new Date().getHours()
  if (h < 11) return '🌤️'
  if (h < 15) return '☀️'
  if (h < 18) return '🌇'
  return '🌙'
}


function normalizeSummary(d) {
  const s = d?.summary ?? d?.data?.summary ?? d?.data ?? d ?? {}
  return {
    saldo:         s.saldo         ?? s.balance         ?? 0,
    total_income:  s.total_income  ?? s.totalIncome     ?? s.pemasukan  ?? 0,
    total_expense: s.total_expense ?? s.totalExpense    ?? s.pengeluaran ?? 0,
  }
}

function normalizeChartData(d) {
  const raw = d?.chartData ?? d?.data?.chartData ?? d?.chart_data ?? d?.data?.chart_data ?? []
  return Array.isArray(raw) ? raw : []
}

function transformChartData(apiChartData, transactions = []) {
  if (apiChartData && apiChartData.length > 0 && apiChartData[0].bulan !== undefined) {
    console.log('[Transform] chartData already in correct format')
    return apiChartData
  }

  if (apiChartData && apiChartData.length > 0 && apiChartData[0].tipe !== undefined) {
    console.log('[Transform] transforming chartData from API flat format')
    const monthlyMap = new Map()

    apiChartData.forEach(item => {
      if (!item.tanggal) return
      const date      = new Date(item.tanggal)
      const monthKey  = `${date.getFullYear()}-${date.getMonth()}`
      const monthName = date.toLocaleDateString('id-ID', { month: 'short' })

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { bulan: monthName, income: 0, expense: 0 })
      }

      const data  = monthlyMap.get(monthKey)
      const total = parseFloat(item.total) || 0

      if (item.tipe === 'income')  data.income  += total
      if (item.tipe === 'expense') data.expense += total
    })

    const result = Array.from(monthlyMap.values())
    console.log('[Transform] chartData result:', result)
    return result
  }

  if (transactions.length > 0) {
    console.log('[Transform] calculating chartData from transactions (fallback)')
    return calculateChartFromTransactions(transactions)
  }

  return []
}


function buildIncomeExpensePie(income = 0, expense = 0, transactions = []) {
  let totalIncome  = parseFloat(income)  || 0
  let totalExpense = parseFloat(expense) || 0

  if (totalIncome === 0 && totalExpense === 0 && transactions.length > 0) {
    transactions.forEach(t => {
      const nominal = parseFloat(t.nominal) || 0
      if (t.tipe === 'income')  totalIncome  += nominal
      if (t.tipe === 'expense') totalExpense += nominal
    })
  }

  if (totalIncome === 0 && totalExpense === 0) return []

  return [
    { name: 'Pemasukan',   value: totalIncome  },
    { name: 'Pengeluaran', value: totalExpense },
  ]
}


function calculateChartFromTransactions(transactions) {
  const monthlyMap = new Map()

  transactions.forEach(t => {
    if (!t.tanggal) return
    const date      = new Date(t.tanggal)
    const monthKey  = `${date.getFullYear()}-${date.getMonth()}`
    const monthName = date.toLocaleDateString('id-ID', { month: 'short' })

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { bulan: monthName, income: 0, expense: 0 })
    }

    const data    = monthlyMap.get(monthKey)
    const nominal = parseFloat(t.nominal) || 0

    if (t.tipe === 'income')  data.income  += nominal
    if (t.tipe === 'expense') data.expense += nominal
  })

  const result = Array.from(monthlyMap.values()).slice(-6)
  console.log('[Transform] chartData from transactions:', result)
  return result
}

export default function Dashboard() {
  const { user } = useAuth()
  const { toggleSidebar } = useOutletContext()

  const [summary,      setSummary]      = useState(null)
  const [chartData,    setChartData]    = useState([])
  const [pieData,      setPieData]      = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [refreshing,   setRefreshing]   = useState(false)

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const now   = new Date()
      const bulan = now.getMonth() + 1
      const tahun = now.getFullYear()

      const [summaryRes, transaksiRes] = await Promise.allSettled([
        transaksiAPI.getSummary({ periode: 'bulanan', bulan, tahun }),
        transaksiAPI.getAll({ limit: 100, sortBy: 'tanggal', sortDir: 'DESC' }),
      ])

      // ── Ambil transaksi terlebih dahulu ──
      let transactionsList = []
      if (transaksiRes.status === 'fulfilled') {
        const d    = transaksiRes.value.data
        const list = d?.data?.data ?? d?.data?.transaksi ?? d?.data ?? d?.transaksi ?? d ?? []
        transactionsList = Array.isArray(list) ? list : []
        setTransactions(transactionsList)
        console.log('[Dashboard] transactions loaded:', transactionsList.length)
      } else {
        console.warn('[Dashboard] getAll gagal:', transaksiRes.reason)
        setTransactions([])
      }

      if (summaryRes.status === 'fulfilled') {
        const d           = summaryRes.value.data
        const normalizedS = normalizeSummary(d)
        console.log('[Dashboard] getSummary full response:', d)

        setSummary(normalizedS)

        const rawChart         = normalizeChartData(d)
        const transformedChart = transformChartData(rawChart, transactionsList)
        console.log('[Dashboard] transformedChart:', transformedChart)
        setChartData(transformedChart.length > 0 ? transformedChart : MOCK_CHART_DATA)

        const incomeExpensePie = buildIncomeExpensePie(
          normalizedS.total_income,
          normalizedS.total_expense,
          transactionsList
        )
        console.log('[Dashboard] incomeExpensePie:', incomeExpensePie)
        setPieData(incomeExpensePie.length > 0 ? incomeExpensePie : MOCK_PIE_DATA)

      } else {
        console.warn('[Dashboard] getSummary gagal:', summaryRes.reason)
        setSummary(MOCK_SUMMARY)

        const fallbackChart = transformChartData([], transactionsList)
        const fallbackPie   = buildIncomeExpensePie(0, 0, transactionsList)

        setChartData(fallbackChart.length > 0 ? fallbackChart : MOCK_CHART_DATA)
        setPieData(fallbackPie.length   > 0 ? fallbackPie   : MOCK_PIE_DATA)
      }

      if (summaryRes.status === 'rejected' && transaksiRes.status === 'rejected') {
        setError(getErrorMessage(summaryRes.reason))
      }

    } catch (err) {
      console.error('[Dashboard] fetch error:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  useEffect(() => {
    const handleUpdate = () => {
      console.log('[Dashboard] transaksi:updated diterima, refresh...')
      fetchDashboard(true)
    }
    window.addEventListener('transaksi:updated', handleUpdate)
    return () => window.removeEventListener('transaksi:updated', handleUpdate)
  }, [fetchDashboard])

  const name = user?.username || user?.email?.split('@')[0] || 'Pengguna'

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-gray-100 px-5 py-3.5">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-surface-muted text-ink-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-semibold text-ink text-sm leading-tight">Dashboard</h2>
              <p className="text-xs text-ink-muted">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="btn-ghost p-2"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="btn-ghost p-2 relative">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-5 py-6 space-y-6">
        <div className="animate-fade-up">
          <h1 className="font-display text-2xl font-bold text-ink">
            {GREETINGS()}, {name} {EMOJI()}
          </h1>
          <p className="text-ink-muted text-sm mt-1">
            Ini adalah ringkasan finansial Arvesta kamu hari ini.
          </p>
        </div>
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={() => fetchDashboard()} className="ml-auto text-xs underline">
              Coba lagi
            </button>
          </div>
        )}

        {refreshing && !loading && (
          <div className="flex items-center gap-2 text-xs text-ink-muted animate-fade-up">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Memperbarui data dashboard...</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up animate-delay-100">
          <SummaryCard type="saldo"   amount={summary?.saldo         ?? 0} loading={loading} />
          <SummaryCard type="income"  amount={summary?.total_income  ?? 0} loading={loading} />
          <SummaryCard type="expense" amount={summary?.total_expense ?? 0} loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up animate-delay-200">
          <SavingsTarget loading={loading} />
          <ExpenseDonutChart pieData={pieData} loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-up animate-delay-300">
          <div className="lg:col-span-3">
            <TransactionList transactions={transactions} loading={loading} limit={5} />
          </div>
          <div className="lg:col-span-2">
            <MonthlyTrendChart chartData={chartData} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}