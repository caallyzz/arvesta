import React, { useEffect, useState } from 'react'
import { Target, Plus, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { rekeningAPI } from '../services/api'
import { formatRupiah } from '../utils/mockData'

function ProgressRing({ pct = 0, size = 44, stroke = 4, color = '#1B4332' }) {
  const r   = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * Math.min(pct / 100, 1)

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  )
}

export default function SavingsTarget({ loading }) {
  const [rekening, setRekening] = useState([])
  const [err, setErr]           = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    rekeningAPI.getAll()
      .then(({ data }) => setRekening(data.data || data || []))
      .catch(() => setErr('Gagal memuat tabungan'))
  }, [loading])

  const items = rekening.slice(0, 3)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary-700" />
          <h3 className="font-semibold text-ink text-sm">Target Tabungan</h3>
        </div>
        <button
          onClick={() => navigate('/tabungan-bersama')}
          className="text-xs text-primary-700 font-medium flex items-center gap-0.5 hover:gap-1.5 transition-all"
        >
          Kelola <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
        </div>
      ) : err ? (
        <p className="text-sm text-red-500 text-center py-4">{err}</p>
      ) : items.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-ink-muted mb-3">Belum ada tabungan bersama</p>
          <button
            onClick={() => navigate('/tabungan-bersama')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Buat Tabungan
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => {
            const target = r.target_nominal || r.saldo_target || 0
            const saldo  = r.saldo || 0
            const pct    = target > 0 ? Math.min((saldo / target) * 100, 100) : 0

            return (
              <button
                key={r.id}
                onClick={() => navigate('/tabungan-bersama')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-muted hover:bg-green-50 transition-colors text-left"
              >
                <div className="relative flex-shrink-0">
                  <ProgressRing pct={pct} />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary-700">
                    {Math.round(pct)}%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{r.nama}</p>
                  <p className="text-xs text-ink-muted">
                    {formatRupiah(saldo)}
                    {target > 0 && <span className="text-ink-light"> / {formatRupiah(target)}</span>}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  r.role === 'owner'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-ink-muted'
                }`}>
                  {r.role === 'owner' ? 'Owner' : 'Member'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
