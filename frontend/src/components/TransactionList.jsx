import React from 'react'
import { ArrowUpRight, ArrowDownLeft, ChevronRight, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatRupiah, formatTanggal } from '../utils/mockData'

function TransactionItem({ t }) {
  const isIncome = t.tipe === 'income'
  return (
    <div className="flex items-center gap-3 py-3 px-1 hover:bg-surface-muted rounded-xl transition-colors cursor-pointer group">
      <div className={`
        w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
        ${isIncome ? 'bg-green-50' : 'bg-red-50'}
      `}>
        {isIncome
          ? <ArrowDownLeft className="w-4 h-4 text-green-600" />
          : <ArrowUpRight  className="w-4 h-4 text-red-500"  />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">
          {t.deskripsi || (isIncome ? 'Pemasukan' : 'Pengeluaran')}
        </p>
        <p className="text-xs text-ink-muted">{formatTanggal(t.tanggal)}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-green-600' : 'text-red-500'}`}>
          {isIncome ? '+' : '-'}{formatRupiah(t.nominal)}
        </p>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
          isIncome ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
        }`}>
          {isIncome ? 'income' : 'expense'}
        </span>
      </div>
    </div>
  )
}

export default function TransactionList({ transactions = [], loading, limit = 5 }) {
  const navigate = useNavigate()
  const items = transactions.slice(0, limit)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-primary-700" />
          <h3 className="font-semibold text-ink text-sm">Transaksi Terkini</h3>
        </div>
        <button
          onClick={() => navigate('/pelacakan')}
          className="text-xs text-primary-700 font-medium flex items-center gap-0.5 hover:gap-1.5 transition-all"
        >
          Lihat Semua <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="skeleton w-9 h-9 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3.5 w-32 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
              <div className="skeleton h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <Receipt className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-ink-muted">Belum ada transaksi</p>
          <p className="text-xs text-ink-light mt-1">Mulai catat pemasukan atau pengeluaranmu</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {items.map((t) => <TransactionItem key={t.id} t={t} />)}
        </div>
      )}
    </div>
  )
}
