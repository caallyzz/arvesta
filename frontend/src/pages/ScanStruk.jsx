import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Menu, Upload, Camera, CheckCircle, Trash2, Edit2,
  FileText, X, Loader2, Sun, AlignJustify, Focus,
  Store, CalendarDays, Wallet, Tag, ChevronRight,
} from 'lucide-react'
import { scanAPI } from '../services/api'
import { formatRupiah, formatTanggalJam, getErrorMessage } from '../utils/mockData'

/* ── Verify/Edit Modal ── */
function VerifikasiModal({ scan, open, onClose, onSaved }) {
  const [form, setForm] = useState({ nominal_terbaca: '', tanggal_terbaca: '', teks_terbaca: '' })
  const [saving, setSaving] = useState(false)
  const [simpaning, setSimpaning] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (scan) setForm({
      nominal_terbaca: scan.nominal_terbaca || '',
      tanggal_terbaca: scan.tanggal_terbaca?.slice(0, 10) || '',
      teks_terbaca: scan.teks_terbaca || '',
    })
    setErr('')
  }, [scan, open])

  const handleSave = async e => {
    e.preventDefault(); setSaving(true); setErr('')
    try {
      await scanAPI.update(scan.id, {
        nominal_terbaca: form.nominal_terbaca ? parseFloat(form.nominal_terbaca) : null,
        tanggal_terbaca: form.tanggal_terbaca || null,
        teks_terbaca: form.teks_terbaca || null,
      })
      onSaved(); onClose()
    } catch (e) { setErr(getErrorMessage(e)) }
    finally { setSaving(false) }
  }

  const handleSimpan = async () => {
    if (!scan?.nominal_terbaca && !form.nominal_terbaca) {
      setErr('Nominal wajib ada untuk simpan ke transaksi'); return
    }
    setSimpaning(true); setErr('')
    try { await scanAPI.simpanKeTransaksi(scan.id, {}); onSaved(); onClose() }
    catch (e) { setErr(getErrorMessage(e)) }
    finally { setSimpaning(false) }
  }

  if (!open || !scan) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-fade-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Verifikasi Struk</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {scan.path_gambar && (
            <img
              src={`/uploads/${scan.path_gambar.split('/').pop()}`}
              alt="Struk"
              className="w-full max-h-40 object-contain rounded-xl bg-gray-50"
            />
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nominal Terbaca (Rp)</label>
              <input
                type="number" value={form.nominal_terbaca}
                onChange={e => setForm(v => ({ ...v, nominal_terbaca: e.target.value }))}
                placeholder="0" min="0" step="any"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal Terbaca</label>
              <input
                type="date" value={form.tanggal_terbaca}
                onChange={e => setForm(v => ({ ...v, tanggal_terbaca: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Teks OCR</label>
              <textarea
                value={form.teks_terbaca}
                onChange={e => setForm(v => ({ ...v, teks_terbaca: e.target.value }))}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30"
                placeholder="Teks hasil OCR..."
              />
            </div>
            {err && <p className="text-sm text-red-500">{err}</p>}
            <div className="flex gap-3">
              <button
                type="submit" disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60 transition-colors"
              >
                {saving ? 'Menyimpan...' : <><Edit2 className="w-3.5 h-3.5" /> Update</>}
              </button>
              <button
                type="button" onClick={handleSimpan} disabled={simpaning}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2E6B44] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#255839] disabled:opacity-60 transition-colors"
              >
                {simpaning ? 'Menyimpan...' : <><CheckCircle className="w-3.5 h-3.5" /> Simpan ke Transaksi</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ── Tip Card ── */
function TipCard({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 bg-[#F5F3EE] rounded-2xl px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#2E6B44]" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* ── Detail Row ── */
function DetailRow({ icon: Icon, label, value, accent }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 ${accent ? 'bg-[#FFF3E0]' : 'bg-[#F5F3EE]'}`}>
        <Icon className={`w-4 h-4 flex-shrink-0 ${accent ? 'text-[#F5A623]' : 'text-gray-500'}`} />
        <span className={`text-sm font-medium ${accent ? 'text-[#D4880C]' : 'text-gray-800'}`}>{value}</span>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function ScanStruk() {
  const { toggleSidebar } = useOutletContext()
  const [riwayat, setRiwayat] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [delId, setDelId] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const fileRef = useRef(null)

  const fetchRiwayat = useCallback(async () => {
    setLoading(true)
    try { const { data } = await scanAPI.getAll(); setRiwayat(data.data || data || []) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchRiwayat() }, [fetchRiwayat])

  const handleFile = async (file) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { setUploadMsg('File harus berupa gambar (jpeg/png/webp)'); return }
    if (file.size > 5 * 1024 * 1024) { setUploadMsg('Ukuran file maksimal 5MB'); return }
    setUploading(true); setUploadMsg('Memproses OCR...')
    const fd = new FormData(); fd.append('gambar', file)
    try {
      await scanAPI.scan(fd)
      setUploadMsg('✓ Struk berhasil diproses!')
      fetchRiwayat()
    } catch (e) { setUploadMsg(getErrorMessage(e)) }
    finally { setUploading(false) }
  }

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }

  const handleDelete = async id => {
    try { await scanAPI.delete(id); fetchRiwayat() }
    catch (e) { alert(getErrorMessage(e)) }
    finally { setDelId(null) }
  }

  /* mock "last scanned" detail panel — in real app this would be the latest scan result */
  const latestScan = riwayat[0] || null

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F5F3EE]/90 backdrop-blur-md border-b border-black/5 px-5 py-3.5">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-black/5 text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-gray-900">Scan Struk</h2>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-5 py-8">
        {/* Two-column layout like Figma */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-5">
            {/* Hero text */}
            <div>
              <h1 className="font-bold text-3xl text-[#2E6B44] leading-tight">
                Digitalisasi Struk Anda
              </h1>
              <p className="text-[#F5A623] font-bold text-2xl leading-tight">Secara Otomatis.</p>
              <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
                Teknologi Arvesta AI mendeteksi merchant, tanggal, dan total belanja Anda
                dengan akurasi 99%. Cukup unggah dan biarkan kami kurasi data keuangan Anda.
              </p>
            </div>

            {/* Upload Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileRef.current?.click()}
              className={`
                border-2 border-dashed rounded-3xl p-10 transition-all duration-200 cursor-pointer bg-white/60
                ${dragOver ? 'border-[#2E6B44] bg-[#2E6B44]/5' : 'border-gray-200 hover:border-[#2E6B44]/40 hover:bg-white/80'}
              `}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Loader2 className="w-10 h-10 text-[#2E6B44] animate-spin" />
                  <p className="text-sm text-gray-500">{uploadMsg}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-[#F5F3EE] rounded-2xl flex items-center justify-center">
                      <Camera className="w-7 h-7 text-[#2E6B44]" />
                    </div>
                    <div className="w-14 h-14 bg-[#F5F3EE] rounded-2xl flex items-center justify-center">
                      <Upload className="w-7 h-7 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-800 text-base">Ambil Foto atau Unggah File</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF · Maks 10MB</p>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-[#2E6B44] text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-[#255839] transition-colors"
                    onClick={e => { e.stopPropagation(); fileRef.current?.click() }}
                  >
                    <Upload className="w-4 h-4" /> Pilih File
                  </button>
                </div>
              )}
            </div>

            {uploadMsg && !uploading && (
              <p className={`text-sm text-center ${uploadMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
                {uploadMsg}
              </p>
            )}

            <input
              ref={fileRef} type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); e.target.value = '' }}
            />

            {/* Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <TipCard
                icon={Sun}
                title="Pencahayaan Cukup"
                desc="Pastikan struk berada di bawah cahaya terang untuk deteksi teks yang akurat."
              />
              <TipCard
                icon={AlignJustify}
                title="Struk Tidak Terlipat"
                desc="Ratakan struk dan pastikan seluruh bagian struk terlihat di dalam bingkai."
              />
              <TipCard
                icon={Focus}
                title="Fokus Tajam"
                desc="Tunggu hingga kamera benar-benar fokus agar angka-angka terbaca sempurna."
              />
            </div>
          </div>

          {/* RIGHT COLUMN — Detail Terdeteksi */}
          <div className="w-full lg:w-80 bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-4 flex-shrink-0">
            <h3 className="font-semibold text-gray-900 text-base">Detail Terdeteksi</h3>

            {latestScan ? (
              <>
                <DetailRow
                  icon={Store}
                  label="Toko / Merchant"
                  value={latestScan.merchant || latestScan.teks_terbaca?.split('\n')[0] || '—'}
                />
                <DetailRow
                  icon={CalendarDays}
                  label="Tanggal Transaksi"
                  value={latestScan.tanggal_terbaca
                    ? new Date(latestScan.tanggal_terbaca).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '—'}
                />
                <DetailRow
                  icon={Wallet}
                  label="Total Jumlah"
                  value={latestScan.nominal_terbaca ? formatRupiah(latestScan.nominal_terbaca) : '—'}
                  accent
                />
                <DetailRow
                  icon={Tag}
                  label="Kategori"
                  value={latestScan.kategori || 'Belum Dikategorikan'}
                />
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setSelected(latestScan)}
                    className="w-full bg-[#2E6B44] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#255839] transition-colors"
                  >
                    Simpan ke Pengeluaran
                  </button>
                  <button className="w-full bg-[#FFF3E0] text-[#D4880C] text-sm font-medium py-3 rounded-xl hover:bg-[#FFE0B2] transition-colors">
                    Tandai sebagai Penting
                  </button>
                </div>
              </>
            ) : (
              <div className="py-10 text-center text-gray-300 space-y-2">
                <FileText className="w-10 h-10 mx-auto" />
                <p className="text-xs text-gray-400">Unggah struk untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>

        {/* Pindaian Terkini */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2E6B44]" /> Pindaian Terkini
            </h2>
            <button className="text-sm text-[#2E6B44] font-medium hover:underline">
              Lihat Semua Riwayat
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 rounded-2xl bg-white/60 animate-pulse" />
              ))}
            </div>
          ) : riwayat.length === 0 ? (
            <div className="bg-white rounded-2xl text-center py-12 border border-black/5">
              <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Belum ada riwayat scan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {riwayat.slice(0, 8).map(s => {
                const kategoriMap = {
                  'Makanan': 'Makanan & Minuman',
                  'Transport': 'Transportasi',
                  'Belanja': 'Kebutuhan Rumah',
                  'Kesehatan': 'Kesehatan',
                }
                const displayKat = s.kategori ? (kategoriMap[s.kategori] || s.kategori) : 'Lainnya'
                const tgl = s.tanggal_terbaca || s.created_at
                const tglDisplay = tgl
                  ? new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                  : ''

                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className="bg-white rounded-2xl p-4 text-left hover:shadow-md transition-all border border-black/5 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 bg-[#F5F3EE] rounded-xl flex items-center justify-center">
                        <Store className="w-4 h-4 text-[#2E6B44]" />
                      </div>
                      <span className="text-[11px] text-gray-400">{tglDisplay}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-0.5">{displayKat}</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {s.teks_terbaca?.split('\n')[0] || 'Struk'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-bold text-gray-900">
                        {s.nominal_terbaca ? formatRupiah(s.nominal_terbaca) : <span className="text-gray-300 font-normal text-xs italic">Belum terbaca</span>}
                      </p>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2E6B44] transition-colors" />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-gray-300 uppercase tracking-widest mt-12">
          Sistem Pengenalan Karakter Optik Arvesta V4.2.0 · Dienkripsi AES-256
        </p>
      </div>

      <VerifikasiModal
        scan={selected} open={!!selected}
        onClose={() => setSelected(null)} onSaved={fetchRiwayat}
      />

      {delId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Hapus Scan?</h3>
            <p className="text-sm text-gray-500 mb-5">Data scan dan file gambar akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDelId(null)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(delId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}