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
    else           setLoading(true)
    setError(null)

    try {
      const now   = new Date()
      const bulan = now.getMonth() + 1
      const tahun = now.getFullYear()

      const [summaryRes, transaksiRes] = await Promise.allSettled([
        transaksiAPI.getSummary({ periode: 'bulanan', bulan, tahun }),
        transaksiAPI.getAll({ limit: 6, sortBy: 'tanggal', sortDir: 'DESC' }),
      ])

      // ── Summary ──────────────────────────────────────────────────────────
      if (summaryRes.status === 'fulfilled') {
        const d = summaryRes.value.data
        // Response: { summary: {total_income, total_expense, saldo}, chartData, pieData }
        setSummary(d.summary   || d.data?.summary   || MOCK_SUMMARY)
        setChartData(d.chartData || d.data?.chartData || MOCK_CHART_DATA)
        setPieData(  d.pieData   || d.data?.pieData   || MOCK_PIE_DATA)
      } else {
        setSummary(MOCK_SUMMARY)
        setChartData(MOCK_CHART_DATA)
        setPieData(MOCK_PIE_DATA)
      }

      // ── Transaksi terkini ─────────────────────────────────────────────────
      if (transaksiRes.status === 'fulfilled') {
        const d = transaksiRes.value.data
        setTransactions(d.data || d.transaksi || d || [])
      } else {
        setTransactions([])
      }

      // If both failed, show error
      if (summaryRes.status === 'rejected' && transaksiRes.status === 'rejected') {
        setError(getErrorMessage(summaryRes.reason))
      }

    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

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
                {new Date().toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
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
        {/* ── Greeting ── */}
        <div className="animate-fade-up">
          <h1 className="font-display text-2xl font-bold text-ink">
            {GREETINGS()}, {name} {EMOJI()}
          </h1>
          <p className="text-ink-muted text-sm mt-1">
            In adalah ringkasan finansial Arvesta kamu hari ini.
          </p>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={() => fetchDashboard()} className="ml-auto text-xs underline">
              Coba lagi
            </button>
          </div>
        )}

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up animate-delay-100">
          <SummaryCard type="saldo"   amount={summary?.saldo         ?? 0} loading={loading} />
          <SummaryCard type="income"  amount={summary?.total_income  ?? 0} loading={loading} />
          <SummaryCard type="expense" amount={summary?.total_expense ?? 0} loading={loading} />
        </div>

        {/* ── Savings + Donut (side by side) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up animate-delay-200">
          <SavingsTarget loading={loading} />
          <ExpenseDonutChart pieData={pieData} loading={loading} />
        </div>

        {/* ── Transactions + Chart ── */}
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
