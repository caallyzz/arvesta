import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { BarChart2 } from 'lucide-react'
import { formatRupiah } from '../utils/mockData'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 shadow-float rounded-xl px-3 py-2.5 text-xs">
      <p className="font-semibold text-ink mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
          <span className="text-ink-muted">{p.name === 'income' ? 'Pemasukan' : 'Pengeluaran'}:</span>
          <span className="font-medium text-ink tabular-nums">{formatRupiah(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

const formatYAxis = (v) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}jt`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}rb`
  return String(v)
}

export default function MonthlyTrendChart({ chartData = [], loading, period = 'Bulanan' }) {
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary-700" />
          <h3 className="font-semibold text-ink text-sm">Tren {period}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-700" />
            <span className="text-ink-muted">Pemasukan</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-ink-muted">Pengeluaran</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-end gap-2 h-40 px-2">
          {[60, 80, 45, 90, 70, 55].map((h, i) => (
            <div key={i} className="flex-1 skeleton rounded-t-md" style={{ height: `${h}%` }} />
          ))}
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <BarChart2 className="w-8 h-8 text-gray-200 mb-2" />
          <p className="text-sm text-ink-muted">Belum ada data tren</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barCategoryGap="30%" barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="bulan"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false} tickLine={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey="income"  name="income"  fill="#1B4332" radius={[4,4,0,0]} />
            <Bar dataKey="expense" name="expense" fill="#d41717" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
