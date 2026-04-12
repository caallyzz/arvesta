import React, { useEffect, useState, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Menu, Plus, Search, Filter, ArrowUpRight, ArrowDownLeft,
  Trash2, Edit2, X, ChevronLeft, ChevronRight, Download
} from 'lucide-react'
import { transaksiAPI, pemasukanAPI, exportAPI } from '../services/api'
import { formatRupiah, formatTanggal, getErrorMessage, downloadBlob } from '../utils/mockData'

/* ── Modal Tambah/Edit Transaksi ───────────────────────────────────────────── */
function TransaksiModal({ open, onClose, onSaved, editData, pemasukans }) {
  const isEdit = !!editData
  const [form, setForm] = useState({ tipe:'expense', nominal:'', tanggal:'', deskripsi:'', pemasukan_id:'' })
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState('')

  useEffect(() => {
    if (editData) {
      setForm({
        tipe:        editData.tipe        || 'expense',
        nominal:     editData.nominal     || '',
        tanggal:     editData.tanggal?.slice(0,10) || '',
        deskripsi:   editData.deskripsi   || '',
        pemasukan_id: editData.pemasukan_id || '',
      })
    } else {
      setForm({ tipe:'expense', nominal:'', tanggal: new Date().toISOString().slice(0,10), deskripsi:'', pemasukan_id:'' })
    }
    setErr('')
  }, [editData, open])

  const set = (k) => (e) => setForm(v => ({ ...v, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nominal || !form.tanggal) { setErr('Nominal dan tanggal wajib diisi'); return }
    setSaving(true); setErr('')
    try {
      const payload = {
        tipe:     form.tipe,
        nominal:  parseFloat(form.nominal),
        tanggal:  form.tanggal,
        deskripsi: form.deskripsi || undefined,
        pemasukan_id: form.pemasukan_id ? parseInt(form.pemasukan_id) : undefined,
      }
      if (isEdit) await transaksiAPI.update(editData.id, payload)
      else        await transaksiAPI.create(payload)
      onSaved()
      onClose()
    } catch (e) { setErr(getErrorMessage(e)) }
    finally { setSaving(false) }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-float w-full max-w-md animate-fade-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-ink">{isEdit ? 'Edit Transaksi' : 'Catat Transaksi'}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Tipe toggle */}
          <div className="flex bg-surface-muted rounded-xl p-1">
            {['income','expense'].map(t => (
              <button key={t} type="button" onClick={() => setForm(v => ({...v, tipe:t}))}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${form.tipe===t ? 'bg-white shadow-card text-primary-700' : 'text-ink-muted'}`}>
                {t === 'income' ? '💰 Pemasukan' : '💸 Pengeluaran'}
              </button>
            ))}
          </div>

          {/* Nominal */}
          <div>
            <label className="input-label">Nominal (Rp)</label>
            <input type="number" value={form.nominal} onChange={set('nominal')}
              placeholder="0" min="0.01" step="any"
              className="input-field font-mono text-lg" required />
          </div>

          {/* Tanggal */}
          <div>
            <label className="input-label">Tanggal</label>
            <input type="date" value={form.tanggal} onChange={set('tanggal')} className="input-field" required />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="input-label">Deskripsi <span className="text-ink-light">(opsional)</span></label>
            <input type="text" value={form.deskripsi} onChange={set('deskripsi')}
              placeholder="Belanja bulanan, gaji, dll..." className="input-field" maxLength={500} />
          </div>

          {/* Pemasukan link (opsional) */}
          {form.tipe === 'income' && pemasukans.length > 0 && (
            <div>
              <label className="input-label">Sumber Pemasukan <span className="text-ink-light">(opsional)</span></label>
              <select value={form.pemasukan_id} onChange={set('pemasukan_id')} className="input-field">
                <option value="">-- Pilih sumber --</option>
                {pemasukans.map(p => (
                  <option key={p.id} value={p.id}>{formatRupiah(p.nominal)}</option>
                ))}
              </select>
            </div>
          )}

          {err && <p className="text-sm text-red-500">{err}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */
export default function PelacakanUang() {
  const { toggleSidebar } = useOutletContext()

  const [transaksi,   setTransaksi]   = useState([])
  const [pemasukans,  setPemasukans]  = useState([])
  const [summary,     setSummary]     = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [total,       setTotal]       = useState(0)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editData,    setEditData]    = useState(null)
  const [delId,       setDelId]       = useState(null)
  const [exporting,   setExporting]   = useState(false)
  const [filters, setFilters] = useState({ tipe:'', search:'', dari:'', sampai:'' })
  const LIMIT = 10

  const fetchAll = useCallback(async (pg = 1) => {
    setLoading(true)
    try {
      const params = { page: pg, limit: LIMIT, sortBy:'tanggal', sortDir:'DESC' }
      if (filters.tipe)   params.tipe   = filters.tipe
      if (filters.search) params.search = filters.search
      if (filters.dari)   params.dari   = filters.dari
      if (filters.sampai) params.sampai = filters.sampai

      const [txRes, sumRes] = await Promise.allSettled([
        transaksiAPI.getAll(params),
        transaksiAPI.getSummary(),
      ])

      if (txRes.status === 'fulfilled') {
      const d = txRes.value.data
      const list = d.data ?? d.transaksi ?? d ?? []
      setTransaksi(Array.isArray(list) ? list : [])  // ← guard
      setTotal(d.total || 0)
      setTotalPages(d.totalPages || 1)
      setPage(pg)
    }
    
      if (sumRes.status === 'fulfilled') {
        const d = sumRes.value.data
        setSummary(d.summary || d.data?.summary || null)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => {
    fetchAll(1)
    pemasukanAPI.getAll().then(({ data }) => setPemasukans(data.data || data || [])).catch(() => {})
  }, [fetchAll])

  const handleDelete = async (id) => {
    try { await transaksiAPI.delete(id); fetchAll(page) }
    catch (e) { alert(getErrorMessage(e)) }
    finally { setDelId(null) }
  }

  const handleExport = async (fmt) => {
    if (!filters.dari || !filters.sampai) {
      alert('Pilih rentang tanggal (dari & sampai) untuk export')
      return
    }
    setExporting(true)
    try {
      const fn = fmt === 'excel' ? exportAPI.excel : exportAPI.pdf
      const res = await fn(filters.dari, filters.sampai)
      downloadBlob(res.data, `transaksi_arvesta_${filters.dari}_${filters.sampai}.${fmt === 'excel' ? 'xlsx' : 'pdf'}`)
    } catch (e) { alert(getErrorMessage(e)) }
    finally { setExporting(false) }
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-gray-100 px-5 py-3.5">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="lg:hidden btn-ghost p-2"><Menu className="w-5 h-5" /></button>
            <h2 className="font-semibold text-ink">Pelacakan Uang</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleExport('excel')} disabled={exporting} className="btn-ghost text-xs gap-1.5 hidden sm:flex">
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
            <button onClick={() => handleExport('pdf')} disabled={exporting} className="btn-ghost text-xs gap-1.5 hidden sm:flex">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button onClick={() => { setEditData(null); setModalOpen(true) }} className="btn-primary text-sm px-4 py-2.5">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-5 py-6 space-y-5">
        {/* Summary strip */}
        {summary && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label:'Saldo', val: summary.saldo,         color:'text-ink' },
              { label:'Pemasukan', val: summary.total_income,  color:'text-green-600' },
              { label:'Pengeluaran', val: summary.total_expense, color:'text-red-500' },
            ].map(c => (
              <div key={c.label} className="card text-center">
                <p className="text-xs text-ink-muted">{c.label}</p>
                <p className={`font-display font-bold text-lg tabular-nums mt-0.5 ${c.color}`}>{formatRupiah(c.val)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="card flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" />
            <input
              type="text" placeholder="Cari deskripsi..."
              value={filters.search}
              onChange={e => setFilters(v => ({...v, search: e.target.value}))}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
          <select value={filters.tipe} onChange={e => setFilters(v => ({...v, tipe: e.target.value}))}
            className="input-field py-2 text-sm w-auto min-w-[120px]">
            <option value="">Semua Tipe</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
          <input type="date" value={filters.dari} onChange={e => setFilters(v => ({...v, dari: e.target.value}))}
            className="input-field py-2 text-sm w-auto" placeholder="Dari" />
          <input type="date" value={filters.sampai} onChange={e => setFilters(v => ({...v, sampai: e.target.value}))}
            className="input-field py-2 text-sm w-auto" placeholder="Sampai" />
          <button onClick={() => fetchAll(1)} className="btn-primary text-sm px-4 py-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          {(filters.tipe || filters.search || filters.dari || filters.sampai) && (
            <button onClick={() => { setFilters({tipe:'',search:'',dari:'',sampai:''}); }}
              className="btn-ghost text-sm px-3 py-2 text-red-500">
              <X className="w-4 h-4" /> Reset
            </button>
          )}
        </div>

        {/* Table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-surface-muted">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wide">Tanggal</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wide">Deskripsi</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wide">Tipe</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wide">Nominal</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({length:5}).map((_,i) => (
                    <tr key={i}>
                      {[1,2,3,4,5].map(j => (
                        <td key={j} className="px-5 py-4"><div className="skeleton h-4 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : transaksi.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-16 text-ink-muted">Tidak ada transaksi</td></tr>
                ) : transaksi.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-muted transition-colors">
                    <td className="px-5 py-3.5 text-ink-muted text-xs">{formatTanggal(t.tanggal)}</td>
                    <td className="px-5 py-3.5 text-ink font-medium max-w-[200px] truncate">
                      {t.deskripsi || <span className="text-ink-light italic">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={t.tipe === 'income' ? 'badge-income' : 'badge-expense'}>
                        {t.tipe === 'income'
                          ? <><ArrowDownLeft className="w-3 h-3" /> income</>
                          : <><ArrowUpRight  className="w-3 h-3" /> expense</>
                        }
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-right font-semibold tabular-nums ${t.tipe === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                      {t.tipe === 'income' ? '+' : '-'}{formatRupiah(t.nominal)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setEditData(t); setModalOpen(true) }}
                          className="btn-ghost p-1.5 text-ink-muted hover:text-primary-700">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDelId(t.id)}
                          className="btn-ghost p-1.5 text-ink-muted hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <p className="text-xs text-ink-muted">
                Menampilkan {((page-1)*LIMIT)+1}–{Math.min(page*LIMIT, total)} dari {total} transaksi
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => fetchAll(page-1)} disabled={page<=1} className="btn-ghost p-2 disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-ink px-2">{page} / {totalPages}</span>
                <button onClick={() => fetchAll(page+1)} disabled={page>=totalPages} className="btn-ghost p-2 disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <TransaksiModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null) }}
        onSaved={() => fetchAll(page)}
        editData={editData}
        pemasukans={pemasukans}
      />

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-float p-6 w-full max-w-sm animate-fade-up">
            <h3 className="font-semibold text-ink mb-2">Hapus Transaksi?</h3>
            <p className="text-sm text-ink-muted mb-5">Transaksi ini akan dihapus permanen dan tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="btn-secondary flex-1">Batal</button>
              <button onClick={() => handleDelete(delId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
