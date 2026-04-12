import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Users, Target, Clock, Download, Bell, Settings, ArrowDownLeft, ArrowUpRight, UserPlus, Trash2, Edit2, MoreHorizontal } from 'lucide-react'
import { rekeningAPI } from '../services/api'
import { formatRupiah, formatTanggal, getErrorMessage } from '../utils/mockData'

/* ── Progress Ring Komponen ── */
function Ring({ pct = 0, size = 120, strokeWidth = 10 }) {
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
        <span className="text-2xl font-bold text-[#1B3A2D]">{Math.round(safePct)}%</span>
      </div>
    </div>
  )
}

export default function DetailCircle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toggleSidebar } = useOutletContext()
  
  const [circle, setCircle] = useState(null)
  const [anggota, setAnggota] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [loading, setLoading] = useState(true)
  const [txForm, setTxForm] = useState({ tipe: 'deposit', nominal: '', deskripsi: '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [activeTab, setActiveTab] = useState('transaksi') // 'transaksi' or 'anggota'

  // Fetch data circle
  const fetchCircleData = async () => {
    setLoading(true)
    try {
      // Ambil detail circle, anggota, dan transaksi
      const [circleRes, anggotaRes, transaksiRes] = await Promise.allSettled([
        rekeningAPI.getById(id),
        rekeningAPI.getAnggota(id),
        rekeningAPI.getTransaksi(id, { limit: 50 }),
      ])
      
      if (circleRes.status === 'fulfilled') {
        setCircle(circleRes.value.data.data || circleRes.value.data)
      }
      if (anggotaRes.status === 'fulfilled') {
        setAnggota(anggotaRes.value.data.data || anggotaRes.value.data || [])
      }
      if (transaksiRes.status === 'fulfilled') {
        const d = transaksiRes.value.data
        setTransaksi(d.data || d.transaksi || [])
      }
    } catch (error) {
      console.error('Error fetching circle detail:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchCircleData()
    }
  }, [id])

  const handleTransaction = async e => {
    e.preventDefault()
    if (!txForm.nominal || parseFloat(txForm.nominal) <= 0) {
      setErr('Nominal harus diisi dan lebih dari 0')
      return
    }
    setSaving(true)
    setErr('')
    try {
      await rekeningAPI.tambahTransaksi(id, {
        tipe: txForm.tipe,
        nominal: parseFloat(txForm.nominal),
        deskripsi: txForm.deskripsi || undefined,
      })
      await fetchCircleData() // Refresh semua data
      setTxForm({ ...txForm, nominal: '', deskripsi: '' })
    } catch (e) {
      setErr(getErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto px-5 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#EDE8DF] rounded w-1/3" />
            <div className="h-40 bg-white rounded-2xl" />
            <div className="h-60 bg-white rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#9E9E9E] mb-4">Circle tidak ditemukan</p>
          <button onClick={() => navigate('/tabungan-bersama')} className="btn-primary">
            Kembali
          </button>
        </div>
      </div>
    )
  }

  const target = circle.target_nominal || 0
  const saldo = circle.saldo || 0
  const pct = target > 0 ? (saldo / target) * 100 : 0
  const sisa = target - saldo
  const kontribusiSaya = circle.kontribusi_saya || 0
  const targetBulanIni = circle.target_bulan_ini || 0

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F5F0E8]/80 backdrop-blur-md border-b border-[#E8E0D4] px-5 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/tabungan-bersama')} 
              className="p-2 rounded-xl hover:bg-[#EDE8DF] transition"
            >
              <ArrowLeft className="w-5 h-5 text-[#1B3A2D]" />
            </button>
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden p-2 rounded-xl hover:bg-[#EDE8DF] transition"
            >
              <Menu className="w-5 h-5 text-[#1B3A2D]" />
            </button>
            <div>
              <h2 className="font-semibold text-[#1B3A2D]">{circle.nama}</h2>
              <p className="text-xs text-[#9E9E9E]">{circle.nomor_rekening}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#EDE8DF] rounded-xl transition">
              <Bell className="w-5 h-5 text-[#9E9E9E]" />
            </button>
            <button className="p-2 hover:bg-[#EDE8DF] rounded-xl transition">
              <Settings className="w-5 h-5 text-[#9E9E9E]" />
            </button>
            <button className="p-2 hover:bg-[#EDE8DF] rounded-xl transition">
              <MoreHorizontal className="w-5 h-5 text-[#9E9E9E]" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-6 space-y-5">
        
        {/* ========== 1. PROGRESS CARD ========== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0D4]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Ring pct={pct} size={140} strokeWidth={12} />
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm text-[#9E9E9E] mb-1">Progress Tabungan</p>
              <p className="text-3xl font-bold text-[#1B3A2D]">{formatRupiah(saldo)}</p>
              <p className="text-sm text-[#9E9E9E]">dari {formatRupiah(target)}</p>
              <div className="mt-3 flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-[#F5F0E8] px-3 py-1.5 rounded-full">
                  <Target className="w-4 h-4 text-[#E8692A]" />
                  <span className="text-xs text-[#E8692A] font-medium">Sisa: {formatRupiah(sisa)}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F5F0E8] px-3 py-1.5 rounded-full">
                  <Users className="w-4 h-4 text-[#1B3A2D]" />
                  <span className="text-xs text-[#1B3A2D] font-medium">{anggota.length} Anggota</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== 2. STATISTIK CARD (KONTRIBUSI & TARGET) ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-[#E8E0D4]">
            <p className="text-xs text-[#9E9E9E] mb-1">Kontribusi Saya</p>
            <p className="text-xl font-bold text-[#1B3A2D]">{formatRupiah(kontribusiSaya)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E8E0D4]">
            <p className="text-xs text-[#9E9E9E] mb-1">Target Bulan Ini</p>
            <p className="text-xl font-bold text-[#1B3A2D]">{formatRupiah(targetBulanIni)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E8E0D4]">
            <p className="text-xs text-[#9E9E9E] mb-1">Total Setoran</p>
            <p className="text-xl font-bold text-[#1B3A2D]">{formatRupiah(saldo)}</p>
          </div>
        </div>

        {/* ========== 3. QUICK ACTIONS & FORM ========== */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E0D4]">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button 
              onClick={() => setTxForm({...txForm, tipe: 'deposit'})}
              className={`py-3 rounded-xl font-semibold transition ${txForm.tipe === 'deposit' ? 'bg-[#1B3A2D] text-white' : 'bg-[#F5F0E8] text-[#1B3A2D]'}`}
            >
              + Setor Dana
            </button>
            <button 
              onClick={() => setTxForm({...txForm, tipe: 'withdraw'})}
              className={`py-3 rounded-xl font-semibold transition ${txForm.tipe === 'withdraw' ? 'bg-[#E8692A] text-white' : 'bg-[#F5F0E8] text-[#1B3A2D]'}`}
            >
              - Tarik Dana
            </button>
          </div>

          <form onSubmit={handleTransaction} className="space-y-4">
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
        </div>

        {/* ========== 4. TAB (ANGGOTA & RIWAYAT) ========== */}
        <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b border-[#F5F0E8]">
            <button
              onClick={() => setActiveTab('transaksi')}
              className={`flex-1 py-3 text-sm font-semibold transition ${activeTab === 'transaksi' ? 'text-[#1B3A2D] border-b-2 border-[#1B3A2D]' : 'text-[#9E9E9E]'}`}
            >
              Riwayat Transaksi
            </button>
            <button
              onClick={() => setActiveTab('anggota')}
              className={`flex-1 py-3 text-sm font-semibold transition ${activeTab === 'anggota' ? 'text-[#1B3A2D] border-b-2 border-[#1B3A2D]' : 'text-[#9E9E9E]'}`}
            >
              Anggota ({anggota.length})
            </button>
          </div>

          {/* Tab Content - Riwayat Transaksi */}
          {activeTab === 'transaksi' && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1B3A2D] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Semua Transaksi
                </h3>
                <button className="text-xs text-[#E8692A] font-semibold flex items-center gap-1">
                  <Download className="w-3 h-3" /> Unduh
                </button>
              </div>
              
              <div className="space-y-3">
                {transaksi.length === 0 ? (
                  <p className="text-center text-[#9E9E9E] py-8">Belum ada transaksi</p>
                ) : (
                  transaksi.map(t => (
                    <div key={t.id} className="flex items-center gap-3 py-3 border-b border-[#F5F0E8] last:border-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.tipe === 'deposit' ? 'bg-green-50' : 'bg-orange-50'}`}>
                        {t.tipe === 'deposit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-[#E8692A]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1B3A2D]">{t.deskripsi || (t.tipe === 'deposit' ? 'Setoran' : 'Penarikan')}</p>
                        <p className="text-xs text-[#9E9E9E]">{formatTanggal(t.tanggal)}</p>
                        <p className="text-xs text-[#BDBDBD]">Oleh: {t.created_by?.username || 'Pengguna'}</p>
                      </div>
                      <p className={`text-base font-semibold ${t.tipe === 'deposit' ? 'text-green-600' : 'text-[#E8692A]'}`}>
                        {t.tipe === 'deposit' ? '+' : '-'}{formatRupiah(t.nominal)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab Content - Anggota */}
          {activeTab === 'anggota' && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1B3A2D] flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Daftar Anggota
                </h3>
                <button className="text-xs text-[#E8692A] font-semibold flex items-center gap-1">
                  <UserPlus className="w-3 h-3" /> Undang Anggota
                </button>
              </div>
              
              <div className="space-y-3">
                {anggota.map(a => (
                  <div key={a.id} className="flex items-center gap-3 py-3 border-b border-[#F5F0E8] last:border-0">
                    <div className="w-12 h-12 bg-[#1B3A2D] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {(a.username || a.email)?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1B3A2D]">{a.username || a.email}</p>
                      <p className="text-xs text-[#9E9E9E]">Bergabung {formatTanggal(a.bergabung_pada)}</p>
                      <p className="text-xs text-[#BDBDBD]">Kontribusi: {formatRupiah(a.kontribusi || 0)}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${a.role === 'owner' ? 'bg-[#1B3A2D] text-white' : 'bg-[#F5F0E8] text-[#9E9E9E]'}`}>
                      {a.role === 'owner' ? 'Pemilik' : 'Anggota'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========== 5. PENGINGAT & LAPORAN ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-[#1B3A2D] to-[#2D5040] rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-semibold">Pengingat Menabung</h3>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Aktifkan pengingat otomatis agar target impian tercapai tepat waktu.
            </p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition">
              Aktifkan Pengingat
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E8E0D4]">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-[#1B3A2D]" />
              <h3 className="font-semibold text-[#1B3A2D]">Laporan Transparansi</h3>
            </div>
            <p className="text-sm text-[#9E9E9E] mb-4">
              Unduh laporan bulanan yang telah diverifikasi oleh sistem Arvesta.
            </p>
            <button className="text-[#E8692A] font-semibold text-sm flex items-center gap-1">
              Unduh Laporan <Download className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}