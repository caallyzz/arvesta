import React, { useEffect, useState, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Menu, Plus, Users, X, ChevronRight, ArrowDownLeft, ArrowUpRight, LogIn } from 'lucide-react'
import { rekeningAPI } from '../services/api'
import { formatRupiah, formatTanggal, getErrorMessage } from '../utils/mockData'

/* ── Progress Ring ── */
function Ring({ pct = 0, size = 72 }) {
  const s = 6, r = (size - s) / 2, c = 2 * Math.PI * r
  const d = c * Math.min(pct / 100, 1)
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={s} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1B4332" strokeWidth={s}
        strokeDasharray={`${d} ${c}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }} />
    </svg>
  )
}

/* ── Modal Buat Rekening ── */
function BuatRekeningModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ nama:'', nomor_rekening:'', passkey:'' })
  const [err, setErr]   = useState(''); const [saving, setSaving] = useState(false)
  const set = k => e => setForm(v => ({...v,[k]:e.target.value}))
  const handleSubmit = async e => {
    e.preventDefault(); if (!form.nama || !form.nomor_rekening || form.passkey.length < 4) { setErr('Semua field wajib diisi. Passkey min 4 karakter.'); return }
    setSaving(true); setErr('')
    try { await rekeningAPI.create(form); onSaved(); onClose() }
    catch (e) { setErr(getErrorMessage(e)) }
    finally { setSaving(false) }
  }
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-float w-full max-w-md animate-fade-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-ink">Buat Circle Baru</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div><label className="input-label">Nama Circle</label>
            <input value={form.nama} onChange={set('nama')} placeholder="Dana Liburan 2025" className="input-field" required /></div>
          <div><label className="input-label">Nomor Rekening</label>
            <input value={form.nomor_rekening} onChange={set('nomor_rekening')} placeholder="REK-001" className="input-field" required /></div>
          <div><label className="input-label">Passkey <span className="text-ink-light">(min 4 karakter)</span></label>
            <input type="password" value={form.passkey} onChange={set('passkey')} placeholder="••••" className="input-field" minLength={4} required /></div>
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Membuat...' : 'Buat Circle'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Modal Join Rekening ── */
function JoinRekeningModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ nomor_rekening:'', passkey:'' })
  const [err, setErr]   = useState(''); const [saving, setSaving] = useState(false)
  const set = k => e => setForm(v => ({...v,[k]:e.target.value}))
  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true); setErr('')
    try { await rekeningAPI.join(form); onSaved(); onClose() }
    catch (e) { setErr(getErrorMessage(e)) }
    finally { setSaving(false) }
  }
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-float w-full max-w-md animate-fade-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-ink">Gabung Circle</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div><label className="input-label">Nomor Rekening</label>
            <input value={form.nomor_rekening} onChange={set('nomor_rekening')} placeholder="REK-001" className="input-field" required /></div>
          <div><label className="input-label">Passkey</label>
            <input type="password" value={form.passkey} onChange={set('passkey')} placeholder="••••" className="input-field" required /></div>
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Bergabung...' : 'Gabung'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Detail Rekening Panel ── */
function DetailPanel({ rekening, onClose }) {
  const [anggota,   setAnggota]   = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [txForm, setTxForm]       = useState({ tipe:'deposit', nominal:'', tanggal: new Date().toISOString().slice(0,10), deskripsi:'' })
  const [saving, setSaving]       = useState(false)
  const [err, setErr]             = useState('')

  useEffect(() => {
    if (!rekening) return
    setLoading(true)
    Promise.allSettled([
      rekeningAPI.getAnggota(rekening.id),
      rekeningAPI.getTransaksi(rekening.id, { limit:10 }),
    ]).then(([aRes, tRes]) => {
      if (aRes.status === 'fulfilled') setAnggota(aRes.value.data.data || aRes.value.data || [])
      if (tRes.status === 'fulfilled') {
        const d = tRes.value.data
        setTransaksi(d.data || d.transaksi || [])
      }
    }).finally(() => setLoading(false))
  }, [rekening])

  const handleTx = async e => {
    e.preventDefault()
    if (!txForm.nominal || !txForm.tanggal) { setErr('Nominal dan tanggal wajib'); return }
    setSaving(true); setErr('')
    try {
      await rekeningAPI.tambahTransaksi(rekening.id, {
        tipe:     txForm.tipe,
        nominal:  parseFloat(txForm.nominal),
        tanggal:  txForm.tanggal,
        deskripsi: txForm.deskripsi || undefined,
      })
      // Refresh transaksi
      const res = await rekeningAPI.getTransaksi(rekening.id, { limit:10 })
      const d = res.data; setTransaksi(d.data || d.transaksi || [])
      setTxForm(v => ({...v, nominal:'', deskripsi:''}))
    } catch (e) { setErr(getErrorMessage(e)) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-float w-full sm:max-w-lg max-h-[90vh] overflow-y-auto animate-fade-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-5 border-b border-gray-100 z-10">
          <div>
            <h2 className="font-semibold text-ink">{rekening?.nama}</h2>
            <p className="text-xs text-ink-muted">{rekening?.nomor_rekening} · {rekening?.role}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Saldo */}
          <div className="bg-primary-700 rounded-2xl p-5 flex items-center gap-4">
            <div className="relative"><Ring pct={rekening?.saldo && rekening?.target_nominal ? (rekening.saldo/rekening.target_nominal*100) : 0} />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white rotate-90">
                {rekening?.saldo && rekening?.target_nominal ? Math.round(rekening.saldo/rekening.target_nominal*100) : 0}%
              </span>
            </div>
            <div>
              <p className="text-green-200 text-xs">Saldo Circle</p>
              <p className="font-display text-2xl font-bold text-white tabular-nums">{formatRupiah(rekening?.saldo)}</p>
              <p className="text-xs text-green-300 mt-0.5">{anggota.length} anggota</p>
            </div>
          </div>

          {/* Setor / Tarik form */}
          <form onSubmit={handleTx} className="card space-y-3">
            <h3 className="font-medium text-ink text-sm">Setor / Tarik Dana</h3>
            <div className="flex bg-surface-muted rounded-xl p-1">
              {['deposit','withdraw'].map(t => (
                <button key={t} type="button" onClick={() => setTxForm(v => ({...v,tipe:t}))}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${txForm.tipe===t ? 'bg-white shadow-card text-primary-700' : 'text-ink-muted'}`}>
                  {t === 'deposit' ? '📥 Setor' : '📤 Tarik'}
                </button>
              ))}
            </div>
            <input type="number" value={txForm.nominal} onChange={e => setTxForm(v => ({...v,nominal:e.target.value}))}
              placeholder="Nominal" className="input-field" min="0.01" step="any" required />
            <input type="date" value={txForm.tanggal} onChange={e => setTxForm(v => ({...v,tanggal:e.target.value}))}
              className="input-field" required />
            <input type="text" value={txForm.deskripsi} onChange={e => setTxForm(v => ({...v,deskripsi:e.target.value}))}
              placeholder="Deskripsi (opsional)" className="input-field" />
            {err && <p className="text-sm text-red-500">{err}</p>}
            <button type="submit" disabled={saving} className="btn-primary w-full text-sm disabled:opacity-60">
              {saving ? 'Menyimpan...' : txForm.tipe === 'deposit' ? 'Setor Dana' : 'Tarik Dana'}
            </button>
          </form>

          {/* Anggota */}
          <div>
            <h3 className="font-medium text-ink text-sm mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> Anggota</h3>
            {loading ? <div className="skeleton h-10 rounded-xl" /> : (
              <div className="space-y-2">
                {anggota.map(a => (
                  <div key={a.id} className="flex items-center gap-3 bg-surface-muted px-3 py-2.5 rounded-xl">
                    <div className="w-8 h-8 bg-primary-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {(a.username || a.email)?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{a.username || a.email}</p>
                      <p className="text-xs text-ink-muted">Bergabung {formatTanggal(a.bergabung_pada)}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.role==='owner' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-ink-muted'}`}>{a.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Riwayat */}
          <div>
            <h3 className="font-medium text-ink text-sm mb-2">Riwayat Transaksi</h3>
            {loading ? <div className="skeleton h-20 rounded-xl" /> : transaksi.length === 0 ? (
              <p className="text-sm text-ink-muted text-center py-4">Belum ada transaksi</p>
            ) : (
              <div className="space-y-2">
                {transaksi.map(t => (
                  <div key={t.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${t.tipe==='deposit' ? 'bg-green-50' : 'bg-red-50'}`}>
                      {t.tipe==='deposit' ? <ArrowDownLeft className="w-3.5 h-3.5 text-green-600" /> : <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink truncate">{t.deskripsi || t.tipe}</p>
                      <p className="text-[10px] text-ink-muted">{formatTanggal(t.tanggal)}</p>
                    </div>
                    <p className={`text-xs font-semibold tabular-nums ${t.tipe==='deposit' ? 'text-green-600' : 'text-red-500'}`}>
                      {t.tipe==='deposit' ? '+' : '-'}{formatRupiah(t.nominal)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */
export default function TabunganBersama() {
  const { toggleSidebar } = useOutletContext()
  const [rekening, setRekening] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [buatOpen, setBuatOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const fetchRekening = useCallback(async () => {
    setLoading(true)
    try { const { data } = await rekeningAPI.getAll(); setRekening(data.data || data || []) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchRekening() }, [fetchRekening])

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-gray-100 px-5 py-3.5">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="lg:hidden btn-ghost p-2"><Menu className="w-5 h-5" /></button>
            <h2 className="font-semibold text-ink">Tabungan Bersama</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setJoinOpen(true)} className="btn-secondary text-sm px-4 py-2.5 gap-1.5">
              <LogIn className="w-4 h-4" /> Gabung
            </button>
            <button onClick={() => setBuatOpen(true)} className="btn-primary text-sm px-4 py-2.5">
              <Plus className="w-4 h-4" /> Buat Circle
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-5 py-6">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
          </div>
        ) : rekening.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-primary-700" />
            </div>
            <h3 className="font-display text-xl font-semibold text-ink mb-2">Belum Ada Circle Tabungan</h3>
            <p className="text-sm text-ink-muted mb-6 max-w-sm">Buat circle tabungan bersama keluarga atau teman, atau gabung ke circle yang sudah ada.</p>
            <div className="flex gap-3">
              <button onClick={() => setJoinOpen(true)} className="btn-secondary">Gabung Circle</button>
              <button onClick={() => setBuatOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> Buat Circle</button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rekening.map(r => {
              const target = r.target_nominal || 0
              const saldo  = r.saldo || 0
              const pct    = target > 0 ? Math.min((saldo/target)*100, 100) : 0
              return (
                <button key={r.id} onClick={() => setSelected(r)}
                  className="card-hover text-left space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-700" />
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.role==='owner' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-ink-muted'}`}>{r.role}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">{r.nama}</h3>
                    <p className="text-xs text-ink-muted mt-0.5">{r.nomor_rekening}</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-ink-muted">Saldo</span>
                      <span className="font-medium text-primary-700">{Math.round(pct)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-700 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="font-display text-lg font-bold text-ink mt-2 tabular-nums">{formatRupiah(saldo)}</p>
                    {target > 0 && <p className="text-xs text-ink-muted">dari {formatRupiah(target)}</p>}
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span>{r.jumlah_anggota || 0} anggota</span>
                    <span className="flex items-center gap-0.5">Detail <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <BuatRekeningModal open={buatOpen} onClose={() => setBuatOpen(false)} onSaved={fetchRekening} />
      <JoinRekeningModal open={joinOpen} onClose={() => setJoinOpen(false)} onSaved={fetchRekening} />
      {selected && <DetailPanel rekening={selected} onClose={() => { setSelected(null); fetchRekening() }} />}
    </div>
  )
}
