import React, { useEffect, useState } from 'react'
import { useOutletContext, useNavigate, useParams } from 'react-router-dom'
import {
  Menu, ArrowLeft, CheckCircle, Edit2, RotateCcw,
  Store, CalendarDays, Wallet, Tag, ShoppingBasket,
  TrendingDown, Star, Download, Loader2,
} from 'lucide-react'
import { scanAPI } from '../services/api'
import { formatRupiah, getErrorMessage } from '../utils/mockData'

const KATEGORI_OPTIONS = [
  'Makanan & Minuman', 'Belanja Bulanan', 'Transportasi',
  'Kesehatan', 'Hiburan', 'Pendidikan', 'Lainnya',
]

export default function VerifikasiStruk() {
  const { toggleSidebar } = useOutletContext()
  const navigate = useNavigate()
  const { id } = useParams()

  const [scan, setScan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [form, setForm] = useState({
    nama_toko: '',
    kategori: '',
    tanggal_terbaca: '',
    nominal_terbaca: '',
    teks_terbaca: '',
  })

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await scanAPI.getById(id)
        const s = data.data || data
        setScan(s)
        setForm({
          nama_toko: s.nama_toko || s.teks_terbaca?.split('\n')[0] || '',
          kategori: s.kategori || '',
          tanggal_terbaca: s.tanggal_terbaca?.slice(0, 10) || '',
          nominal_terbaca: s.nominal_terbaca || '',
          teks_terbaca: s.teks_terbaca || '',
        })
      } catch (e) { setErr(getErrorMessage(e)) }
      finally { setLoading(false) }
    }
    if (id) fetch()
  }, [id])

  const handleSimpan = async () => {
    if (!form.nominal_terbaca) { setErr('Nominal wajib diisi sebelum menyimpan'); return }
    setSaving(true); setErr('')
    try {
      await scanAPI.simpanKeTransaksi(id, {
        nama_toko: form.nama_toko,
        kategori: form.kategori,
        nominal_terbaca: parseFloat(form.nominal_terbaca),
        tanggal_terbaca: form.tanggal_terbaca || null,
        teks_terbaca: form.teks_terbaca || null,
      })
      setSuccessMsg('Berhasil disimpan ke pengeluaran!')
      setTimeout(() => navigate('/scan'), 1500)
    } catch (e) { setErr(getErrorMessage(e)) }
    finally { setSaving(false) }
  }

  const handleUlangi = () => navigate('/scan')

  const items = scan?.items || scan?.rincian || []

  if (loading) return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#2E6B44] animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <header className="sticky top-0 z-10 bg-[#F5F3EE]/90 backdrop-blur-md border-b border-black/5 px-5 py-3.5">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-black/5 text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          <button onClick={() => navigate('/scan')} className="p-2 rounded-lg hover:bg-black/5 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-gray-900 flex-1">Verifikasi Struk</h2>
          {/* Badge sukses */}
          <div className="flex items-center gap-1.5 bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold px-3 py-1.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" />
            Berhasil Terdeteksi 99%
          </div>
        </div>
      </header>

      <div className="max-w-screen-lg mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

          {/* KIRI — Preview dokumen */}
          <div className="bg-[#F0EDE6] rounded-3xl p-4 flex flex-col gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Pratinjau Dokumen</p>
            <div className="bg-white rounded-2xl flex-1 min-h-[280px] flex items-center justify-center overflow-hidden">
              {scan?.path_gambar ? (
                <img
                  src={`/uploads/${scan.path_gambar.split('/').pop()}`}
                  alt="Struk"
                  className="w-full h-full object-contain max-h-72"
                />
              ) : (
                /* Mock receipt visual */
                <div className="w-2/3 bg-white border border-gray-100 rounded p-4 flex flex-col gap-2 shadow-sm">
                  <p className="text-[10px] font-bold text-center text-gray-800 uppercase tracking-wide">{form.nama_toko || 'Struk'}</p>
                  <div className="h-px bg-gray-100 my-1" />
                  {[80, 60, 80, 50, 70].map((w, i) => (
                    <div key={i} className="h-1.5 bg-gray-100 rounded" style={{ width: `${w}%` }} />
                  ))}
                  <div className="h-px bg-gray-100 my-1" />
                  <div className="flex justify-between">
                    <div className="h-1.5 bg-gray-100 rounded w-2/5" />
                    <div className="h-1.5 bg-[#2E6B44]/20 rounded w-1/4" />
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleUlangi}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-black/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Ulangi Pemindaian
            </button>
          </div>

          {/* KANAN — Ekstraksi + form */}
          <div className="flex flex-col gap-5">

            {/* Judul */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-[#2E6B44] rounded-full" />
              <h1 className="text-xl font-bold text-gray-900">Ekstraksi Data</h1>
            </div>

            {/* Field grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Toko */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block">Nama Toko</label>
                <div className="relative">
                  <input
                    value={form.nama_toko}
                    onChange={e => setForm(v => ({ ...v, nama_toko: e.target.value }))}
                    className="w-full bg-[#F5F3EE] border border-transparent rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30 pr-8"
                  />
                  <Edit2 className="w-3.5 h-3.5 text-gray-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block">Kategori</label>
                <select
                  value={form.kategori}
                  onChange={e => setForm(v => ({ ...v, kategori: e.target.value }))}
                  className="w-full bg-[#F5F3EE] border border-transparent rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30 appearance-none"
                >
                  <option value="">Pilih kategori...</option>
                  {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              {/* Tanggal */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block">Tanggal Transaksi</label>
                <div className="relative">
                  <CalendarDays className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={form.tanggal_terbaca}
                    onChange={e => setForm(v => ({ ...v, tanggal_terbaca: e.target.value }))}
                    className="w-full bg-[#F5F3EE] border border-transparent rounded-xl pl-9 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30"
                  />
                </div>
              </div>

              {/* Total Nominal */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block">Total Nominal</label>
                <div className="relative bg-[#FFF8EE] rounded-xl border border-[#FCEAC8] flex items-center px-4 py-3 gap-2">
                  <Wallet className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                  <span className="text-sm text-[#C47D00] font-medium">Rp</span>
                  <input
                    type="number"
                    value={form.nominal_terbaca}
                    onChange={e => setForm(v => ({ ...v, nominal_terbaca: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="flex-1 bg-transparent text-[#C47D00] font-bold text-base focus:outline-none min-w-0"
                  />
                </div>
              </div>
            </div>

            {/* Rincian Produk */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Rincian Produk</h3>
                {items.length > 0 && (
                  <span className="text-xs bg-[#F5F3EE] text-gray-500 font-semibold px-3 py-1 rounded-full">
                    {items.length} Item Terdeteksi
                  </span>
                )}
              </div>

              {items.length > 0 ? (
                <div className="space-y-1">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 bg-[#FFF3E0] rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShoppingBasket className="w-4 h-4 text-[#F5A623]" />
                      </div>
                      <span className="flex-1 text-sm text-gray-800">{item.nama || item.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{formatRupiah(item.harga || item.price || 0)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                /* Tampilkan teks OCR jika tidak ada items */
                scan?.teks_terbaca && (
                  <div className="bg-[#F5F3EE] rounded-xl p-4">
                    <p className="text-xs text-gray-500 font-mono leading-relaxed whitespace-pre-wrap line-clamp-4">
                      {scan.teks_terbaca}
                    </p>
                  </div>
                )
              )}
            </div>

            {err && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{err}</p>}
            {successMsg && <p className="text-sm text-green-600 bg-green-50 rounded-xl px-4 py-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" />{successMsg}</p>}

            {/* CTA */}
            <button
              onClick={handleSimpan}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-[#2E6B44] text-white font-semibold py-4 rounded-2xl text-sm hover:bg-[#255839] transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {saving ? 'Menyimpan...' : 'Simpan ke Pengeluaran'}
            </button>
            <p className="text-xs text-gray-400 text-center -mt-2">
              Data yang disimpan akan otomatis disinkronkan ke Dashboard Analytics Anda.
            </p>

            {/* Insight cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F5F3EE] rounded-2xl p-4">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center mb-2">
                  <TrendingDown className="w-3.5 h-3.5 text-[#2E6B44]" />
                </div>
                <p className="text-xs font-bold text-gray-800 mb-1">Analisis Hemat</p>
                <p className="text-xs text-gray-500 leading-relaxed">Pengeluaran ini 12% lebih rendah dari rata-rata belanja bulanan Anda di kategori yang sama.</p>
              </div>
              <div className="bg-[#F5F3EE] rounded-2xl p-4">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center mb-2">
                  <Star className="w-3.5 h-3.5 text-[#2E6B44]" />
                </div>
                <p className="text-xs font-bold text-gray-800 mb-1">Poin Arvesta</p>
                <p className="text-xs text-gray-500 leading-relaxed">Simpan struk ini untuk mendapatkan tambahan 25 poin loyalitas Arvesta Premium.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}