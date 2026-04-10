import React from 'react'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight } from 'lucide-react'
import { formatRupiah } from '../utils/mockData'

const CARD_CONFIG = {
  saldo: {
    label: 'Total Saldo',
    icon:  Wallet,
    bg:    'bg-primary-700',
    text:  'text-white',
    sub:   'text-green-200',
    iconBg: 'bg-white/20',
  },
  income: {
    label: 'Total Pemasukan',
    icon:  TrendingUp,
    bg:    'bg-white',
    text:  'text-ink',
    sub:   'text-ink-muted',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    border: 'border border-gray-100',
  },
  expense: {
    label: 'Total Pengeluaran',
    icon:  TrendingDown,
    bg:    'bg-white',
    text:  'text-ink',
    sub:   'text-ink-muted',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    border: 'border border-gray-100',
  },
}

export default function SummaryCard({ type = 'saldo', amount, change, loading }) {
  const cfg = CARD_CONFIG[type]
  const Icon = cfg.icon

  if (loading) {
    return (
      <div className={`rounded-2xl p-5 shadow-card ${cfg.bg} ${cfg.border || ''}`}>
        <div className="skeleton h-4 w-24 mb-4" />
        <div className="skeleton h-8 w-36 mb-2" />
        <div className="skeleton h-3 w-20" />
      </div>
    )
  }

  return (
    <div className={`
      rounded-2xl p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5
      ${cfg.bg} ${cfg.border || ''}
    `}>
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-medium uppercase tracking-wide ${cfg.sub || cfg.text}`}>
          {cfg.label}
        </span>
        <div className={`p-2 rounded-xl ${cfg.iconBg}`}>
          <Icon className={`w-4 h-4 ${cfg.iconColor || (type === 'saldo' ? 'text-white' : '')}`} />
        </div>
      </div>

      <p className={`font-display text-2xl font-semibold ${cfg.text} mb-1 tabular-nums`}>
        {formatRupiah(amount)}
      </p>

      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${cfg.sub || cfg.text}`}>
          <ArrowUpRight className="w-3 h-3" />
          <span>{change >= 0 ? '+' : ''}{change}% bulan ini</span>
        </div>
      )}
    </div>
  )
}
