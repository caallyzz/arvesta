import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { formatRupiah } from '../utils/mockData'

const COLOR_MAP = {
  'Pemasukan':   '#2D6A4F', 
  'Pengeluaran': '#DC2626',  
}

const FALLBACK_COLORS = ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2', '#D4A017', '#F4C430']

const getColor = (name, index) => COLOR_MAP[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white border border-gray-100 shadow-float rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-ink">{d.name}</p>
      <p className="text-ink-muted">{formatRupiah(d.value)}</p>
      <p className="font-medium" style={{ color: getColor(d.name, 0) }}>{d.payload.pct}%</p>
    </div>
  )
}

export default function ExpenseDonutChart({ pieData = [], loading }) {
  const total = pieData.reduce((s, d) => s + (d.value || 0), 0)
  const data  = pieData.map(d => ({
    ...d,
    pct: total > 0 ? Math.round((d.value / total) * 100) : 0,
  }))

  return (
    <div className="card h-full">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-4 h-4 text-primary-700" />
        <h3 className="font-semibold text-ink text-sm">Analisis Pengeluaran</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="skeleton rounded-full w-32 h-32" />
        </div>
      ) : data.length === 0 || (data.length === 1 && data[0].value === 0) ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <PieIcon className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-sm text-ink-muted">Belum ada data pengeluaran</p>
          <p className="text-xs text-ink-light mt-1">Mulai catat transaksimu</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={52} outerRadius={76}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={getColor(entry.name, i)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="w-full space-y-1.5 mt-1">
            {data.slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getColor(d.name, i) }}
                />
                <span className="flex-1 text-ink-muted truncate">{d.name}</span>
                <span className="font-semibold text-ink tabular-nums">{d.pct}%</span>
              </div>
            ))}
            {data.length > 4 && (
              <p className="text-xs text-ink-light text-right">
                +{data.length - 4} lainnya
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}