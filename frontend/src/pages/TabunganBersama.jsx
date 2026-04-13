import React, { useEffect, useState, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
<<<<<<< HEAD
import { 
  Menu, Plus, Users, X, ChevronRight, ArrowDownLeft, ArrowUpRight, 
  LogIn, Target, Clock, Download, Bell, Settings, TrendingUp, 
  UserPlus, Copy, Check, AlertCircle, Loader, Search, Edit2
} from 'lucide-react'
import { rekeningAPI } from '../services/api'
import { formatRupiah, formatTanggal, getErrorMessage } from '../utils/mockData'

/* ────────────────────────────────────────────────────────────────────────── */
/* PROGRESS RING COMPONENT                                                    */
/* ────────────────────────────────────────────────────────────────────────── */
=======
import { Menu, Plus, Users, X, ChevronRight, ArrowDownLeft, ArrowUpRight, LogIn, Target, Calendar, Clock, Download, Bell, Settings, Circle, TrendingUp, UserPlus } from 'lucide-react'
import { rekeningAPI } from '../services/api'
import { formatRupiah, formatTanggal, getErrorMessage } from '../utils/mockData'

/* ── Progress Ring Komponen ── */
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
function Ring({ pct = 0, size = 80, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const safePct = isNaN(pct) ? 0 : Math.min(pct, 100)
  const offset = circumference - (safePct / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          fill="none"
          stroke="#E8E0D4"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          fill="none"
          stroke="#1B3A2D"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-[#1B3A2D]">{Math.round(safePct)}%</span>
      </div>
    </div>
  )
}

<<<<<<< HEAD
/* ────────────────────────────────────────────────────────────────────────── */
/* TOAST NOTIFICATION COMPONENT                                               */
/* ────────────────────────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-right-5 ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-[#1B3A2D] text-white'
    }`}>
      {type === 'success' && <Check className="w-5 h-5" />}
      {type === 'error' && <AlertCircle className="w-5 h-5" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* MODAL BUAT CIRCLE (DENGAN TARGET)                                          */
/* ────────────────────────────────────────────────────────────────────────── */
function BuatCircleModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ 
    nama: '', 
    nomor_rekening: '', 
    passkey: '',
    target_nominal: '' 
  })
=======
/* ── Modal Buat Circle ── */
function BuatCircleModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ nama: '', target: '', passkey: '' })
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)
  
  const handleSubmit = async e => {
    e.preventDefault()
<<<<<<< HEAD
    if (!form.nama || !form.nomor_rekening || form.passkey.length < 4) {
      setErr('Semua field wajib diisi. Passkey min 4 karakter.')
      return
    }
    if (!form.target_nominal || parseFloat(form.target_nominal) <= 0) {
      setErr('Target nominal wajib diisi dan lebih dari 0')
      return
    }
=======
    if (!form.nama || !form.target || form.passkey.length < 4) {
      setErr('Semua field wajib diisi. Passkey min 4 karakter.')
      return
    }
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    setSaving(true)
    setErr('')
    try {
      await rekeningAPI.create({
        nama: form.nama,
<<<<<<< HEAD
        nomor_rekening: form.nomor_rekening,
        passkey: form.passkey,
        target_nominal: parseFloat(form.target_nominal)
      })
      onSaved()
      onClose()
      setForm({ nama: '', nomor_rekening: '', passkey: '', target_nominal: '' })
=======
        target_nominal: parseFloat(form.target),
        passkey: form.passkey
      })
      onSaved()
      onClose()
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    } catch (e) {
      setErr(getErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F5F0E8]">
          <h2 className="text-lg font-semibold text-[#1B3A2D]">Buat Circle Baru</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F5F0E8] rounded-lg transition">
            <X className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Nama Circle</label>
            <input
              value={form.nama}
              onChange={e => setForm({...form, nama: e.target.value})}
              placeholder="Contoh: Liburan ke Jepang"
              className="w-full px-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
            />
          </div>
          <div>
<<<<<<< HEAD
            <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Nomor Rekening</label>
            <input
              value={form.nomor_rekening}
              onChange={e => setForm({...form, nomor_rekening: e.target.value})}
              placeholder="Contoh: REK-001 atau TAB-2025"
              className="w-full px-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Target Tabungan</label>
=======
            <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Target Nominal</label>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9E9E]">Rp</span>
              <input
                type="number"
<<<<<<< HEAD
                value={form.target_nominal}
                onChange={e => setForm({...form, target_nominal: e.target.value})}
                placeholder="Contoh: 10000000"
                className="w-full pl-10 pr-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
              />
            </div>
            <p className="text-xs text-[#9E9E9E] mt-1">Target yang ingin dicapai bersama</p>
=======
                value={form.target}
                onChange={e => setForm({...form, target: e.target.value})}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
              />
            </div>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Passkey</label>
            <input
              type="password"
              value={form.passkey}
              onChange={e => setForm({...form, passkey: e.target.value})}
              placeholder="Minimal 4 karakter"
              className="w-full px-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
            />
          </div>
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border-2 border-[#E8E0D4] rounded-xl text-[#1B3A2D] font-semibold hover:bg-[#F5F0E8] transition">
              Batal
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-[#1B3A2D] text-white rounded-xl font-semibold hover:bg-[#2D5040] transition disabled:opacity-50">
<<<<<<< HEAD
              {saving ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Buat Circle'}
=======
              {saving ? 'Membuat...' : 'Buat Circle'}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

<<<<<<< HEAD
/* ────────────────────────────────────────────────────────────────────────── */
/* MODAL EDIT TARGET                                                          */
/* ────────────────────────────────────────────────────────────────────────── */
function EditTargetModal({ open, onClose, circle, onSaved }) {
  const [target, setTarget] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (circle) {
      setTarget(circle.target_nominal || '')
    }
  }, [circle])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!target || parseFloat(target) <= 0) {
      setErr('Target harus lebih dari 0')
=======
/* ── Modal Gabung Circle ── */
function GabungCircleModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ nomor_rekening: '', passkey: '' })
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)
  
  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setErr('')
    try {
      await rekeningAPI.join(form)
      onSaved()
      onClose()
    } catch (e) {
      setErr(getErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F5F0E8]">
          <h2 className="text-lg font-semibold text-[#1B3A2D]">Gabung Circle</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F5F0E8] rounded-lg transition">
            <X className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Nomor Rekening</label>
            <input
              value={form.nomor_rekening}
              onChange={e => setForm({...form, nomor_rekening: e.target.value})}
              placeholder="Masukkan kode circle"
              className="w-full px-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Passkey</label>
            <input
              type="password"
              value={form.passkey}
              onChange={e => setForm({...form, passkey: e.target.value})}
              placeholder="Masukkan passkey"
              className="w-full px-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
            />
          </div>
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border-2 border-[#E8E0D4] rounded-xl text-[#1B3A2D] font-semibold hover:bg-[#F5F0E8] transition">
              Batal
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-[#1B3A2D] text-white rounded-xl font-semibold hover:bg-[#2D5040] transition disabled:opacity-50">
              {saving ? 'Bergabung...' : 'Gabung'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Detail Circle Panel ── */
function DetailCirclePanel({ circle, onClose, onRefresh }) {
  const [anggota, setAnggota] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [loading, setLoading] = useState(true)
  const [txForm, setTxForm] = useState({ tipe: 'deposit', nominal: '', deskripsi: '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  
  const target = circle?.target_nominal || 0
  const saldo = circle?.saldo || 0
  const pct = target > 0 ? (saldo / target) * 100 : 0
  const sisa = target - saldo

  useEffect(() => {
    if (!circle) return
    setLoading(true)
    Promise.allSettled([
      rekeningAPI.getAnggota(circle.id),
      rekeningAPI.getTransaksi(circle.id, { limit: 20 }),
    ]).then(([aRes, tRes]) => {
      if (aRes.status === 'fulfilled') setAnggota(aRes.value.data.data || aRes.value.data || [])
      if (tRes.status === 'fulfilled') {
        const d = tRes.value.data
        setTransaksi(d.data || d.transaksi || [])
      }
    }).finally(() => setLoading(false))
  }, [circle])

  const handleTransaction = async e => {
    e.preventDefault()
    if (!txForm.nominal || parseFloat(txForm.nominal) <= 0) {
      setErr('Nominal harus diisi dan lebih dari 0')
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
      return
    }
    setSaving(true)
    setErr('')
    try {
<<<<<<< HEAD
      await rekeningAPI.update(circle.id, { target_nominal: parseFloat(target) })
      onSaved()
      onClose()
=======
      await rekeningAPI.tambahTransaksi(circle.id, {
        tipe: txForm.tipe,
        nominal: parseFloat(txForm.nominal),
        deskripsi: txForm.deskripsi || undefined,
      })
      const res = await rekeningAPI.getTransaksi(circle.id, { limit: 20 })
      const d = res.data
      setTransaksi(d.data || d.transaksi || [])
      setTxForm({ ...txForm, nominal: '', deskripsi: '' })
      onRefresh()
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    } catch (e) {
      setErr(getErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F5F0E8]">
          <h2 className="text-lg font-semibold text-[#1B3A2D]">Edit Target Tabungan</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F5F0E8] rounded-lg transition">
            <X className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Target Tabungan</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9E9E]">Rp</span>
              <input
                type="number"
                value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder="Masukkan target baru"
                className="w-full pl-10 pr-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
              />
            </div>
          </div>
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border-2 border-[#E8E0D4] rounded-xl text-[#1B3A2D] font-semibold hover:bg-[#F5F0E8] transition">
              Batal
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-[#1B3A2D] text-white rounded-xl font-semibold hover:bg-[#2D5040] transition disabled:opacity-50">
              {saving ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Simpan Target'}
            </button>
          </div>
        </form>
=======
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen bg-[#F5F0E8] sm:bg-black/0 sm:flex sm:items-center sm:justify-center p-0 sm:p-4">
        <div className="bg-[#F5F0E8] sm:bg-white sm:rounded-2xl w-full sm:max-w-2xl max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 bg-[#F5F0E8] sm:bg-white z-10 px-5 py-4 border-b border-[#E8E0D4] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="p-2 hover:bg-[#EDE8DF] rounded-xl transition">
                <X className="w-5 h-5 text-[#1B3A2D]" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-[#1B3A2D]">{circle?.nama}</h2>
                <p className="text-xs text-[#9E9E9E]">{circle?.nomor_rekening}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#EDE8DF] rounded-xl transition">
                <Bell className="w-5 h-5 text-[#9E9E9E]" />
              </button>
              <button className="p-2 hover:bg-[#EDE8DF] rounded-xl transition">
                <Settings className="w-5 h-5 text-[#9E9E9E]" />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E0D4]">
              <div className="flex items-center gap-5">
                <Ring pct={pct} size={100} strokeWidth={10} />
                <div className="flex-1">
                  <p className="text-xs text-[#9E9E9E] mb-1">Progress Tabungan</p>
                  <p className="text-2xl font-bold text-[#1B3A2D]">{formatRupiah(saldo)}</p>
                  <p className="text-sm text-[#9E9E9E]">dari {formatRupiah(target)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#E8692A]" />
                    <span className="text-xs text-[#E8692A] font-medium">Sisa: {formatRupiah(sisa)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setTxForm({...txForm, tipe: 'deposit'})}
                className={`py-3 rounded-xl font-semibold transition ${txForm.tipe === 'deposit' ? 'bg-[#1B3A2D] text-white' : 'bg-white border-2 border-[#E8E0D4] text-[#1B3A2D]'}`}
              >
                + Setor Dana
              </button>
              <button 
                onClick={() => setTxForm({...txForm, tipe: 'withdraw'})}
                className={`py-3 rounded-xl font-semibold transition ${txForm.tipe === 'withdraw' ? 'bg-[#E8692A] text-white' : 'bg-white border-2 border-[#E8E0D4] text-[#1B3A2D]'}`}
              >
                - Tarik Dana
              </button>
            </div>

            {/* Form Setor/Tarik */}
            <form onSubmit={handleTransaction} className="bg-white rounded-2xl p-5 space-y-4 border border-[#E8E0D4]">
              <h3 className="font-semibold text-[#1B3A2D] flex items-center gap-2">
                {txForm.tipe === 'deposit' ? <ArrowDownLeft className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-[#E8692A]" />}
                {txForm.tipe === 'deposit' ? 'Setor Dana' : 'Tarik Dana'}
              </h3>
              <div>
                <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Nominal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9E9E]">Rp</span>
                  <input
                    type="number"
                    value={txForm.nominal}
                    onChange={e => setTxForm({...txForm, nominal: e.target.value})}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Deskripsi (Opsional)</label>
                <input
                  type="text"
                  value={txForm.deskripsi}
                  onChange={e => setTxForm({...txForm, deskripsi: e.target.value})}
                  placeholder="Contoh: Setoran bulan Maret"
                  className="w-full px-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
                />
              </div>
              {err && <p className="text-sm text-red-500">{err}</p>}
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 ${txForm.tipe === 'deposit' ? 'bg-[#1B3A2D] hover:bg-[#2D5040]' : 'bg-[#E8692A] hover:bg-[#D4581A]'}`}
              >
                {saving ? 'Memproses...' : txForm.tipe === 'deposit' ? 'Setor Sekarang' : 'Tarik Sekarang'}
              </button>
            </form>

            {/* Anggota Circle */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8E0D4]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1B3A2D] flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Anggota Circle ({anggota.length})
                </h3>
                <button className="text-xs text-[#E8692A] font-semibold flex items-center gap-1">
                  <UserPlus className="w-3 h-3" /> Undang
                </button>
              </div>
              <div className="space-y-3">
                {loading ? (
                  Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 bg-[#F5F0E8] rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-[#F5F0E8] rounded w-32 mb-1" />
                        <div className="h-3 bg-[#F5F0E8] rounded w-24" />
                      </div>
                    </div>
                  ))
                ) : (
                  anggota.map(a => (
                    <div key={a.id} className="flex items-center gap-3 py-2">
                      <div className="w-10 h-10 bg-[#1B3A2D] rounded-full flex items-center justify-center text-white font-semibold">
                        {(a.username || a.email)?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1B3A2D]">{a.username || a.email}</p>
                        <p className="text-xs text-[#9E9E9E]">Bergabung {formatTanggal(a.bergabung_pada)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${a.role === 'owner' ? 'bg-[#1B3A2D] text-white' : 'bg-[#F5F0E8] text-[#9E9E9E]'}`}>
                        {a.role === 'owner' ? 'Pemilik' : 'Anggota'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Riwayat Transaksi */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8E0D4]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1B3A2D] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Riwayat Transaksi
                </h3>
                <button className="text-xs text-[#E8692A] font-semibold flex items-center gap-1">
                  <Download className="w-3 h-3" /> Unduh
                </button>
              </div>
              <div className="space-y-3">
                {loading ? (
                  Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-8 h-8 bg-[#F5F0E8] rounded-lg" />
                      <div className="flex-1">
                        <div className="h-4 bg-[#F5F0E8] rounded w-24 mb-1" />
                        <div className="h-3 bg-[#F5F0E8] rounded w-16" />
                      </div>
                      <div className="h-4 bg-[#F5F0E8] rounded w-20" />
                    </div>
                  ))
                ) : transaksi.length === 0 ? (
                  <p className="text-center text-[#9E9E9E] py-8">Belum ada transaksi</p>
                ) : (
                  transaksi.map(t => (
                    <div key={t.id} className="flex items-center gap-3 py-2 border-b border-[#F5F0E8] last:border-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.tipe === 'deposit' ? 'bg-green-50' : 'bg-orange-50'}`}>
                        {t.tipe === 'deposit' ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-[#E8692A]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1B3A2D]">{t.deskripsi || (t.tipe === 'deposit' ? 'Setoran' : 'Penarikan')}</p>
                        <p className="text-xs text-[#9E9E9E]">{formatTanggal(t.tanggal)}</p>
                      </div>
                      <p className={`text-sm font-semibold ${t.tipe === 'deposit' ? 'text-green-600' : 'text-[#E8692A]'}`}>
                        {t.tipe === 'deposit' ? '+' : '-'}{formatRupiah(t.nominal)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
      </div>
    </div>
  )
}

<<<<<<< HEAD
/* ────────────────────────────────────────────────────────────────────────── */
/* MODAL GABUNG CIRCLE                                                        */
/* ────────────────────────────────────────────────────────────────────────── */
function GabungCircleModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ nomor_rekening: '', passkey: '' })
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)
  
  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setErr('')
    try {
      await rekeningAPI.join(form)
      onSaved()
      onClose()
      setForm({ nomor_rekening: '', passkey: '' })
    } catch (e) {
      setErr(getErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F5F0E8]">
          <h2 className="text-lg font-semibold text-[#1B3A2D]">Gabung Circle</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F5F0E8] rounded-lg transition">
            <X className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Nomor Rekening</label>
            <input
              value={form.nomor_rekening}
              onChange={e => setForm({...form, nomor_rekening: e.target.value})}
              placeholder="Masukkan nomor rekening circle"
              className="w-full px-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Passkey</label>
            <input
              type="password"
              value={form.passkey}
              onChange={e => setForm({...form, passkey: e.target.value})}
              placeholder="Masukkan passkey"
              className="w-full px-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
            />
          </div>
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border-2 border-[#E8E0D4] rounded-xl text-[#1B3A2D] font-semibold hover:bg-[#F5F0E8] transition">
              Batal
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-[#1B3A2D] text-white rounded-xl font-semibold hover:bg-[#2D5040] transition disabled:opacity-50">
              {saving ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Gabung'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* DETAIL CIRCLE PANEL                                                        */
/* ────────────────────────────────────────────────────────────────────────── */
function DetailCirclePanel({ circle, onClose, onRefresh }) {
  const [anggota, setAnggota] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [loading, setLoading] = useState(true)
  const [txForm, setTxForm] = useState({ tipe: 'deposit', nominal: '', deskripsi: '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [toast, setToast] = useState(null)
  const [editTargetOpen, setEditTargetOpen] = useState(false)
  
  const target = circle?.target_nominal || 0
  const saldo = circle?.saldo || 0
  const pct = target > 0 ? (saldo / target) * 100 : 0
  const sisa = target - saldo

  useEffect(() => {
    if (!circle) return
    setLoading(true)
    
    const fetchData = async () => {
      try {
        const [anggotaRes, transaksiRes] = await Promise.all([
          rekeningAPI.getAnggota(circle.id),
          rekeningAPI.getTransaksi(circle.id, { limit: 20 })
        ])
        
        let anggotaData = []
        if (anggotaRes?.data?.data) anggotaData = anggotaRes.data.data
        else if (anggotaRes?.data) anggotaData = anggotaRes.data
        else if (Array.isArray(anggotaRes)) anggotaData = anggotaRes
        setAnggota(Array.isArray(anggotaData) ? anggotaData : [])
        
        let transaksiData = []
        if (transaksiRes?.data?.data) transaksiData = transaksiRes.data.data
        else if (transaksiRes?.data?.transaksi) transaksiData = transaksiRes.data.transaksi
        else if (transaksiRes?.data) transaksiData = transaksiRes.data
        else if (Array.isArray(transaksiRes)) transaksiData = transaksiRes
        setTransaksi(Array.isArray(transaksiData) ? transaksiData : [])
        
      } catch (error) {
        console.error('Error fetching detail:', error)
        setToast({ message: getErrorMessage(error), type: 'error' })
        setAnggota([])
        setTransaksi([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [circle])

  const handleTransaction = async e => {
    e.preventDefault()
    
    const nominalValue = parseFloat(txForm.nominal)
    if (!txForm.nominal || isNaN(nominalValue) || nominalValue <= 0) {
      setErr('Nominal harus diisi dan lebih dari 0')
      return
    }
    
    setSaving(true)
    setErr('')
    
    try {
      const payload = {
        tipe: txForm.tipe,
        nominal: nominalValue,
        deskripsi: txForm.deskripsi || undefined,
        tanggal: new Date().toISOString().split('T')[0]
      }
      
      await rekeningAPI.tambahTransaksi(circle.id, payload)
      
      const transaksiRes = await rekeningAPI.getTransaksi(circle.id, { limit: 20 })
      let transaksiData = []
      if (transaksiRes?.data?.data) transaksiData = transaksiRes.data.data
      else if (transaksiRes?.data?.transaksi) transaksiData = transaksiRes.data.transaksi
      else if (transaksiRes?.data) transaksiData = transaksiRes.data
      else if (Array.isArray(transaksiRes)) transaksiData = transaksiRes
      setTransaksi(Array.isArray(transaksiData) ? transaksiData : [])
      
      setTxForm({ ...txForm, nominal: '', deskripsi: '' })
      setToast({ message: `${txForm.tipe === 'deposit' ? 'Setoran' : 'Penarikan'} berhasil!`, type: 'success' })
      onRefresh()
    } catch (e) {
      console.error('Transaction error:', e)
      const errorMessage = e.response?.data?.message || e.response?.data?.error || getErrorMessage(e)
      setErr(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleCopyCode = () => {
    if (circle?.nomor_rekening) {
      navigator.clipboard.writeText(circle.nomor_rekening)
      setToast({ message: 'Nomor rekening disalin!', type: 'success' })
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto" onClick={onClose}>
        <div className="min-h-screen bg-[#F5F0E8] sm:bg-black/0 sm:flex sm:items-center sm:justify-center p-0 sm:p-4">
          <div className="bg-[#F5F0E8] sm:bg-white sm:rounded-2xl w-full sm:max-w-2xl max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-[#F5F0E8] sm:bg-white z-10 px-5 py-4 border-b border-[#E8E0D4] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 hover:bg-[#EDE8DF] rounded-xl transition">
                  <X className="w-5 h-5 text-[#1B3A2D]" />
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-[#1B3A2D]">{circle?.nama}</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#9E9E9E] font-mono">{circle?.nomor_rekening}</p>
                    <button onClick={handleCopyCode} className="p-1 hover:bg-[#EDE8DF] rounded transition">
                      <Copy className="w-3 h-3 text-[#9E9E9E]" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[#EDE8DF] rounded-xl transition">
                  <Bell className="w-5 h-5 text-[#9E9E9E]" />
                </button>
                {circle?.role === 'owner' && (
                  <button className="p-2 hover:bg-[#EDE8DF] rounded-xl transition">
                    <Settings className="w-5 h-5 text-[#9E9E9E]" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Progress Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E0D4]">
                <div className="flex items-center gap-5">
                  <Ring pct={pct} size={100} strokeWidth={10} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#9E9E9E] mb-1">Progress Tabungan</p>
                      {circle?.role === 'owner' && (
                        <button 
                          onClick={() => setEditTargetOpen(true)}
                          className="text-xs text-[#E8692A] font-semibold hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit Target
                        </button>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-[#1B3A2D]">{formatRupiah(saldo)}</p>
                    <p className="text-sm text-[#9E9E9E]">dari {formatRupiah(target)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#E8692A]" />
                      <span className="text-xs text-[#E8692A] font-medium">Sisa: {formatRupiah(sisa)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setTxForm({...txForm, tipe: 'deposit'})}
                  className={`py-3 rounded-xl font-semibold transition ${
                    txForm.tipe === 'deposit' 
                      ? 'bg-[#1B3A2D] text-white' 
                      : 'bg-white border-2 border-[#E8E0D4] text-[#1B3A2D]'
                  }`}
                >
                  + Setor Dana
                </button>
                <button 
                  onClick={() => setTxForm({...txForm, tipe: 'withdraw'})}
                  className={`py-3 rounded-xl font-semibold transition ${
                    txForm.tipe === 'withdraw' 
                      ? 'bg-[#E8692A] text-white' 
                      : 'bg-white border-2 border-[#E8E0D4] text-[#1B3A2D]'
                  }`}
                >
                  - Tarik Dana
                </button>
              </div>

              {/* Form Setor/Tarik */}
              <form onSubmit={handleTransaction} className="bg-white rounded-2xl p-5 space-y-4 border border-[#E8E0D4]">
                <h3 className="font-semibold text-[#1B3A2D] flex items-center gap-2">
                  {txForm.tipe === 'deposit' 
                    ? <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    : <ArrowUpRight className="w-4 h-4 text-[#E8692A]" />
                  }
                  {txForm.tipe === 'deposit' ? 'Setor Dana' : 'Tarik Dana'}
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Nominal</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9E9E]">Rp</span>
                    <input
                      type="number"
                      step="1000"
                      min="1000"
                      value={txForm.nominal}
                      onChange={e => setTxForm({...txForm, nominal: e.target.value})}
                      placeholder="Minimal Rp 1.000"
                      className="w-full pl-10 pr-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Deskripsi (Opsional)</label>
                  <input
                    type="text"
                    value={txForm.deskripsi}
                    onChange={e => setTxForm({...txForm, deskripsi: e.target.value})}
                    placeholder="Contoh: Setoran bulan Maret"
                    className="w-full px-4 py-3 border-2 border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none transition"
                  />
                </div>
                {err && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{err}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 ${
                    txForm.tipe === 'deposit' 
                      ? 'bg-[#1B3A2D] hover:bg-[#2D5040]' 
                      : 'bg-[#E8692A] hover:bg-[#D4581A]'
                  }`}
                >
                  {saving ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : (txForm.tipe === 'deposit' ? 'Setor Sekarang' : 'Tarik Sekarang')}
                </button>
              </form>

              {/* Anggota Circle */}
              <div className="bg-white rounded-2xl p-5 border border-[#E8E0D4]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1B3A2D] flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Anggota Circle ({anggota.length})
                  </h3>
                  {circle?.role === 'owner' && (
                    <button className="text-xs text-[#E8692A] font-semibold flex items-center gap-1">
                      <UserPlus className="w-3 h-3" /> Undang
                    </button>
                  )}
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {loading ? (
                    Array.from({length: 3}).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 bg-[#F5F0E8] rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-[#F5F0E8] rounded w-32 mb-1" />
                          <div className="h-3 bg-[#F5F0E8] rounded w-24" />
                        </div>
                      </div>
                    ))
                  ) : anggota.length === 0 ? (
                    <p className="text-center text-[#9E9E9E] py-4">Belum ada anggota</p>
                  ) : (
                    anggota.map(a => (
                      <div key={a.id} className="flex items-center gap-3 py-2">
                        <div className="w-10 h-10 bg-[#1B3A2D] rounded-full flex items-center justify-center text-white font-semibold">
                          {(a.username || a.email)?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1B3A2D]">{a.username || a.email}</p>
                          <p className="text-xs text-[#9E9E9E]">Bergabung {formatTanggal(a.bergabung_pada)}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          a.role === 'owner' 
                            ? 'bg-[#1B3A2D] text-white' 
                            : 'bg-[#F5F0E8] text-[#9E9E9E]'
                        }`}>
                          {a.role === 'owner' ? 'Pemilik' : 'Anggota'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Riwayat Transaksi */}
              <div className="bg-white rounded-2xl p-5 border border-[#E8E0D4]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1B3A2D] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Riwayat Transaksi
                  </h3>
                  <button className="text-xs text-[#E8692A] font-semibold flex items-center gap-1">
                    <Download className="w-3 h-3" /> Unduh
                  </button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {loading ? (
                    Array.from({length: 3}).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-8 h-8 bg-[#F5F0E8] rounded-lg" />
                        <div className="flex-1">
                          <div className="h-4 bg-[#F5F0E8] rounded w-24 mb-1" />
                          <div className="h-3 bg-[#F5F0E8] rounded w-16" />
                        </div>
                        <div className="h-4 bg-[#F5F0E8] rounded w-20" />
                      </div>
                    ))
                  ) : transaksi.length === 0 ? (
                    <p className="text-center text-[#9E9E9E] py-8">Belum ada transaksi</p>
                  ) : (
                    transaksi.map(t => (
                      <div key={t.id} className="flex items-center gap-3 py-2 border-b border-[#F5F0E8] last:border-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          t.tipe === 'deposit' ? 'bg-green-50' : 'bg-orange-50'
                        }`}>
                          {t.tipe === 'deposit' ? (
                            <ArrowDownLeft className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-[#E8692A]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1B3A2D]">{t.deskripsi || (t.tipe === 'deposit' ? 'Setoran' : 'Penarikan')}</p>
                          <p className="text-xs text-[#9E9E9E]">{formatTanggal(t.tanggal)}</p>
                        </div>
                        <p className={`text-sm font-semibold ${
                          t.tipe === 'deposit' ? 'text-green-600' : 'text-[#E8692A]'
                        }`}>
                          {t.tipe === 'deposit' ? '+' : '-'}{formatRupiah(t.nominal)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Edit Target */}
      <EditTargetModal 
        open={editTargetOpen} 
        onClose={() => setEditTargetOpen(false)} 
        circle={circle}
        onSaved={() => {
          onRefresh()
          setEditTargetOpen(false)
        }}
      />
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* MAIN PAGE TABUNGAN BERSAMA                                                 */
/* ────────────────────────────────────────────────────────────────────────── */
export default function TabunganBersama() {
  const { toggleSidebar } = useOutletContext()
  const [circles, setCircles] = useState([])
  const [loading, setLoading] = useState(true)
  const [buatOpen, setBuatOpen] = useState(false)
  const [gabungOpen, setGabungOpen] = useState(false)
  const [selectedCircle, setSelectedCircle] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState(null)

  const fetchCircles = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await rekeningAPI.getAll()
      const circlesData = data.data || data || []
      setCircles(circlesData)
    } catch (e) {
      console.error(e)
      setCircles([])
      setToast({ message: getErrorMessage(e), type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCircles()
  }, [fetchCircles])

  const filteredCircles = circles.filter(circle =>
    circle.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circle.nomor_rekening?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalSetoran = circles.reduce((sum, c) => sum + (Number(c?.saldo) || 0), 0)
  const rataRata = circles.length > 0 ? totalSetoran / circles.length : 0

  return (
    <div className="min-h-screen bg-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E8E0D4] px-5 py-3.5">
=======
/* ── MAIN PAGE TABUNGAN BERSAMA ── */
export default function TabunganBersama() {
  const { toggleSidebar } = useOutletContext()
  const [circles, setCircles] = useState([])
  const [loading, setLoading] = useState(true)
  const [buatOpen, setBuatOpen] = useState(false)
  const [gabungOpen, setGabungOpen] = useState(false)
  const [selectedCircle, setSelectedCircle] = useState(null)

  const fetchCircles = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await rekeningAPI.getAll()
      const circlesData = data.data || data || []
      setCircles(circlesData)
    } catch (e) {
      console.error(e)
      setCircles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCircles()
  }, [fetchCircles])

  // Hitung statistik dengan aman (FIX NaN)
  const totalSetoran = circles.reduce((sum, c) => {
    const saldo = Number(c?.saldo) || 0
    return sum + saldo
  }, 0)
  
  const rataRata = circles.length > 0 && !isNaN(totalSetoran) 
    ? totalSetoran / circles.length 
    : 0

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F5F0E8]/80 backdrop-blur-md border-b border-[#E8E0D4] px-5 py-3.5">
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-xl hover:bg-[#EDE8DF] transition">
              <Menu className="w-5 h-5 text-[#1B3A2D]" />
            </button>
            <div>
              <h2 className="font-semibold text-[#1B3A2D]">Tabungan Bersama</h2>
              <p className="text-xs text-[#9E9E9E] hidden sm:block">Tabungan bersama lebih ringan dan seru</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cari circle..."
                className="pl-9 pr-4 py-2 text-sm border border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none bg-white w-48"
              />
            </div>
=======
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            <button
              onClick={() => setGabungOpen(true)}
              className="px-4 py-2 rounded-xl border-2 border-[#E8E0D4] bg-white text-[#1B3A2D] font-semibold text-sm hover:bg-[#F5F0E8] transition flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Gabung
            </button>
            <button
              onClick={() => setBuatOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1B3A2D] text-white font-semibold text-sm hover:bg-[#2D5040] transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Buat Circle
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-5 py-6">
<<<<<<< HEAD
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1B3A2D] mb-2">Circle Saving</h1>
          <p className="text-[#9E9E9E]">Wujudkan impian bersama dengan tabungan kolektif</p>
        </div>

        {circles.length > 0 && totalSetoran > 0 && (
=======
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1B3A2D] mb-2">Circle Saving</h1>
          <p className="text-[#9E9E9E]">Tabungan bersama lebih ringan dan seru.</p>
        </div>

        {/* Statistik Ringkas - FIX NaN */}
        {circles.length > 0 && totalSetoran > 0 && !isNaN(totalSetoran) && (
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-[#E8E0D4]">
              <p className="text-xs text-[#9E9E9E] mb-1">Total Tabungan</p>
              <p className="text-xl font-bold text-[#1B3A2D]">{formatRupiah(totalSetoran)}</p>
<<<<<<< HEAD
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500">+12%</span>
              </div>
=======
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E8E0D4]">
              <p className="text-xs text-[#9E9E9E] mb-1">Rata-rata per Circle</p>
              <p className="text-xl font-bold text-[#1B3A2D]">{formatRupiah(rataRata)}</p>
<<<<<<< HEAD
              <p className="text-xs text-[#9E9E9E] mt-1">{circles.length} Circle aktif</p>
=======
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            </div>
          </div>
        )}

<<<<<<< HEAD
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
=======
        {/* Loading State */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
              <div key={i} className="bg-white rounded-2xl p-5 border border-[#E8E0D4] animate-pulse">
                <div className="w-12 h-12 bg-[#F5F0E8] rounded-xl mb-4" />
                <div className="h-5 bg-[#F5F0E8] rounded w-32 mb-2" />
                <div className="h-3 bg-[#F5F0E8] rounded w-24 mb-4" />
                <div className="h-2 bg-[#F5F0E8] rounded-full mb-3" />
                <div className="h-6 bg-[#F5F0E8] rounded w-28 mb-1" />
                <div className="h-3 bg-[#F5F0E8] rounded w-20" />
              </div>
            ))}
          </div>
        ) : circles.length === 0 ? (
<<<<<<< HEAD
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-[#EDE8DF] rounded-full flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-[#1B3A2D]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1B3A2D] mb-3">Belum Ada Circle Tabungan</h3>
            <p className="text-[#9E9E9E] max-w-md mb-8">
              Wujudkan impianmu lebih cepat bersama teman & keluarga.
              Buat rencana menabung yang terorganisir dan saling menyemangati setiap hari.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setBuatOpen(true)} className="px-6 py-3 bg-[#1B3A2D] text-white rounded-xl font-semibold hover:bg-[#2D5040] transition flex items-center gap-2">
                <Plus className="w-4 h-4" /> Buat Circle Baru
              </button>
              <button onClick={() => setGabungOpen(true)} className="px-6 py-3 border-2 border-[#E8E0D4] bg-white text-[#1B3A2D] rounded-xl font-semibold hover:bg-[#F5F0E8] transition flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Gabung Circle
              </button>
=======
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-[#EDE8DF] rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[#1B3A2D]" />
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            </div>
            <h3 className="text-xl font-semibold text-[#1B3A2D] mb-2">Belum Ada Circle Tabungan</h3>
            <p className="text-[#9E9E9E] max-w-md mb-6">
              Wujudkan impianmu lebih cepat bersama teman & keluarga.
              Buat rencana menabung yang terorganisir dan saling menyemangati setiap hari.
            </p>
            <button
              onClick={() => setBuatOpen(true)}
              className="px-6 py-3 bg-[#1B3A2D] text-white rounded-xl font-semibold hover:bg-[#2D5040] transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Buat Circle Baru
            </button>
          </div>
        ) : (
<<<<<<< HEAD
          <>
            <div className="sm:hidden mb-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cari circle..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-[#E8E0D4] rounded-xl focus:border-[#1B3A2D] outline-none bg-white"
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCircles.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#9E9E9E]">Tidak ada circle yang ditemukan</p>
                </div>
              ) : (
                filteredCircles.map(circle => {
                  const target = circle?.target_nominal || 0
                  const saldo = circle?.saldo || 0
                  const pct = target > 0 ? (saldo / target) * 100 : 0
                  
                  return (
                    <button
                      key={circle.id}
                      onClick={() => setSelectedCircle(circle)}
                      className="bg-white rounded-2xl p-5 border border-[#E8E0D4] text-left hover:shadow-md transition-all hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-[#EDE8DF] rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-[#1B3A2D]" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          circle.role === 'owner' 
                            ? 'bg-[#1B3A2D] text-white' 
                            : 'bg-[#F5F0E8] text-[#9E9E9E]'
                        }`}>
                          {circle.role === 'owner' ? 'Pemilik' : 'Anggota'}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-[#1B3A2D] text-lg mb-1">{circle.nama}</h3>
                      <p className="text-xs text-[#9E9E9E] mb-4 font-mono">{circle.nomor_rekening}</p>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#9E9E9E]">Progress</span>
                          <span className="font-medium text-[#1B3A2D]">{Math.round(pct)}%</span>
                        </div>
                        <div className="h-2 bg-[#F5F0E8] rounded-full overflow-hidden">
                          <div className="h-full bg-[#1B3A2D] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      
                      <p className="text-xl font-bold text-[#1B3A2D] mb-1">{formatRupiah(saldo)}</p>
                      {target > 0 && <p className="text-xs text-[#9E9E9E]">dari {formatRupiah(target)}</p>}
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F5F0E8]">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#9E9E9E]" />
                          <span className="text-xs text-[#9E9E9E]">{circle.jumlah_anggota || 1} anggota</span>
                        </div>
                        <span className="text-xs text-[#E8692A] font-medium flex items-center gap-1">
                          Detail <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            {filteredCircles.length > 0 && (
              <div className="mt-10 text-center">
                <div className="bg-white rounded-2xl p-6 border border-[#E8E0D4] max-w-md mx-auto">
                  <div className="w-12 h-12 bg-[#EDE8DF] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-[#1B3A2D]" />
                  </div>
                  <p className="text-[#9E9E9E] text-sm italic">
                    "Wujudkan impianmu lebih cepat bersama teman & keluarga."
                  </p>
                  <p className="text-[#BDBDBD] text-xs mt-2">
                    Buat rencana menabung yang terorganisir dan saling menyemangati setiap hari.
                  </p>
                </div>
              </div>
            )}
=======
          /* List Circles */
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {circles.map(circle => {
                const target = circle?.target_nominal || 0
                const saldo = circle?.saldo || 0
                const pct = target > 0 ? (saldo / target) * 100 : 0
                
                return (
                  <button
                    key={circle.id}
                    onClick={() => setSelectedCircle(circle)}
                    className="bg-white rounded-2xl p-5 border border-[#E8E0D4] text-left hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-[#EDE8DF] rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#1B3A2D]" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${circle.role === 'owner' ? 'bg-[#1B3A2D] text-white' : 'bg-[#F5F0E8] text-[#9E9E9E]'}`}>
                        {circle.role === 'owner' ? 'Pemilik' : 'Anggota'}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-[#1B3A2D] text-lg mb-1">{circle.nama}</h3>
                    <p className="text-xs text-[#9E9E9E] mb-4">{circle.nomor_rekening}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#9E9E9E]">Progress</span>
                        <span className="font-medium text-[#1B3A2D]">{Math.round(pct)}%</span>
                      </div>
                      <div className="h-2 bg-[#F5F0E8] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1B3A2D] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    
                    <p className="text-xl font-bold text-[#1B3A2D] mb-1">{formatRupiah(saldo)}</p>
                    {target > 0 && (
                      <p className="text-xs text-[#9E9E9E]">dari {formatRupiah(target)}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F5F0E8]">
                      <span className="text-xs text-[#9E9E9E]">{circle.jumlah_anggota || 1} anggota</span>
                      <span className="text-xs text-[#E8692A] font-medium flex items-center gap-1">
                        Detail <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Quote/Inspirasi */}
            <div className="mt-8 text-center">
              <p className="text-[#9E9E9E] text-sm">
                Wujudkan impianmu lebih cepat bersama teman & keluarga.
              </p>
              <p className="text-[#BDBDBD] text-xs mt-1">
                Buat rencana menabung yang terorganisir dan saling menyemangati setiap hari.
              </p>
            </div>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          </>
        )}
      </div>

<<<<<<< HEAD
      <BuatCircleModal open={buatOpen} onClose={() => setBuatOpen(false)} onSaved={fetchCircles} />
      <GabungCircleModal open={gabungOpen} onClose={() => setGabungOpen(false)} onSaved={fetchCircles} />
      
=======
      {/* Modals */}
      <BuatCircleModal open={buatOpen} onClose={() => setBuatOpen(false)} onSaved={fetchCircles} />
      <GabungCircleModal open={gabungOpen} onClose={() => setGabungOpen(false)} onSaved={fetchCircles} />
      
      {/* Detail Panel */}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
      {selectedCircle && (
        <DetailCirclePanel 
          circle={selectedCircle} 
          onClose={() => setSelectedCircle(null)} 
          onRefresh={fetchCircles}
        />
      )}
    </div>
  )
<<<<<<< HEAD
}
=======
}

>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
