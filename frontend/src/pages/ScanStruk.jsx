import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import {
  Menu, Upload, Camera, CheckCircle, Trash2, Edit2,
  FileText, X, Loader2, Sun, AlignJustify, Focus,
  Store, CalendarDays, Wallet, Tag, ChevronRight, ArrowLeft,
  Search, Filter, Download, Share2, Star, AlertCircle,
  RefreshCw, Image as ImageIcon, FileWarning, Clock
} from 'lucide-react'
import { scanAPI } from '../services/api'
import { formatRupiah, getErrorMessage } from '../utils/mockData'

const KATEGORI_OPTIONS = [
  'Makanan & Minuman','Belanja','Transportasi',
  'Kesehatan','Hiburan','Tagihan','Pendidikan','Lainnya',
]

// Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-right-5 ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-gray-800 text-white'
    }`}>
      {type === 'success' && <CheckCircle className="w-4 h-4"/>}
      {type === 'error' && <AlertCircle className="w-4 h-4"/>}
      <span className="text-sm">{message}</span>
    </div>
  )
}

/* ── Verify/Edit Modal ── */
function VerifikasiModal({ scan, open, onClose, onSaved }) {
  const [form, setForm] = useState({ nominal_terbaca:'', tanggal_terbaca:'', teks_terbaca:'', merchant:'', kategori:'' })
  const [saving, setSaving] = useState(false)
  const [simpaning, setSimpaning] = useState(false)
  const [err, setErr] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (scan) setForm({
      nominal_terbaca: scan.nominal_terbaca || '',
      tanggal_terbaca: scan.tanggal_terbaca?.slice(0,10) || '',
      teks_terbaca:    scan.teks_terbaca    || '',
      merchant:        scan.merchant        || '',
      kategori:        scan.kategori        || '',
    })
    setErr('')
  }, [scan, open])

  const handleSave = async e => {
    e.preventDefault(); setSaving(true); setErr('')
    try {
      await scanAPI.update(scan.id, {
        nominal_terbaca: form.nominal_terbaca ? parseFloat(form.nominal_terbaca) : null,
        tanggal_terbaca: form.tanggal_terbaca || null,
        teks_terbaca:    form.teks_terbaca    || null,
        merchant:        form.merchant        || null,
        kategori:        form.kategori        || null,
      })
      onSaved(); onClose()
    } catch(e) { setErr(getErrorMessage(e)) }
    finally { setSaving(false) }
  }

  const handleSimpan = async () => {
    if (!scan?.nominal_terbaca && !form.nominal_terbaca) { setErr('Nominal wajib ada'); return }
    setSimpaning(true); setErr('')
    try { 
      await scanAPI.simpanKeTransaksi(scan.id, {})
      onSaved()  // Ini akan memanggil reset di parent
      onClose()
    }
    catch(e) { setErr(getErrorMessage(e)) }
    finally { setSimpaning(false) }
  }

  if (!open || !scan) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-[#2E6B44]"/>
            <h2 className="font-semibold text-gray-900">Verifikasi & Edit Struk</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-4 h-4"/>
          </button>
        </div>
        
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {scan.path_gambar && (
            <div className="relative group">
              <img 
                src={`/uploads/${scan.path_gambar.split('/').pop()}`} 
                alt="Struk"
                className="w-full max-h-48 object-contain rounded-xl bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowPreview(true)}
              />
              <button 
                onClick={() => setShowPreview(true)}
                className="absolute bottom-2 right-2 bg-black/50 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3 h-3"/>
              </button>
            </div>
          )}
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nama Toko / Merchant</label>
              <input type="text" value={form.merchant} onChange={e => setForm(v=>({...v,merchant:e.target.value}))}
                placeholder="Contoh: Indomaret, McDonald's..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30 transition-all"/>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nominal (Rp)</label>
                <input type="number" value={form.nominal_terbaca} onChange={e => setForm(v=>({...v,nominal_terbaca:e.target.value}))}
                  placeholder="0" min="0" step="any"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal</label>
                <input type="date" value={form.tanggal_terbaca} onChange={e => setForm(v=>({...v,tanggal_terbaca:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30"/>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Kategori</label>
              <select value={form.kategori} onChange={e => setForm(v=>({...v,kategori:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30 bg-white">
                <option value="">-- Pilih Kategori --</option>
                {KATEGORI_OPTIONS.map(k=><option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Teks OCR</label>
              <textarea value={form.teks_terbaca} onChange={e => setForm(v=>({...v,teks_terbaca:e.target.value}))}
                rows={3} placeholder="Teks hasil OCR..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30"/>
            </div>
            
            {err && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0"/>
                <span>{err}</span>
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60 transition-colors">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <><Edit2 className="w-3.5 h-3.5"/> Update</>}
              </button>
              <button type="button" onClick={handleSimpan} disabled={simpaning}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2E6B44] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#255839] disabled:opacity-60 transition-colors">
                {simpaning ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <><CheckCircle className="w-3.5 h-3.5"/> Simpan</>}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {showPreview && scan.path_gambar && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={`/uploads/${scan.path_gambar.split('/').pop()}`} 
              alt="Struk Preview"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Tip Card ── */
function TipCard({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="w-8 h-8 rounded-xl bg-[#F0F7F3] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#2E6B44]"/>
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
  if (!value || value === '—') {
    return (
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 bg-gray-50">
          <Icon className="w-4 h-4 text-gray-400"/>
          <span className="text-sm text-gray-400 italic">Belum tersedia</span>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 ${accent ? 'bg-[#FFF3E0]' : 'bg-gray-50'}`}>
        <Icon className={`w-4 h-4 flex-shrink-0 ${accent ? 'text-[#F5A623]' : 'text-gray-400'}`}/>
        <span className={`text-sm font-medium truncate ${accent ? 'text-[#D4880C]' : 'text-gray-800'}`}>{value}</span>
      </div>
    </div>
  )
}

/* ── Empty State Component ── */
function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Icon className="w-8 h-8 text-gray-300"/>
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
      <p className="text-xs text-gray-400">{message}</p>
    </div>
  )
}

/* ── Halaman Riwayat Semua ── */
function HalamanRiwayat({ riwayat, onBack, onSelect, onDelete }) {
  const [search, setSearch] = useState('')
  const [filterKat, setFilterKat] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filtered = riwayat.filter(s => {
    const cocokSearch = !search ||
      (s.merchant||'').toLowerCase().includes(search.toLowerCase()) ||
      (s.teks_terbaca||'').toLowerCase().includes(search.toLowerCase())
    const cocokKat = !filterKat || s.kategori === filterKat
    return cocokSearch && cocokKat
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at)
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
    if (sortBy === 'highest') return (b.nominal_terbaca || 0) - (a.nominal_terbaca || 0)
    if (sortBy === 'lowest') return (a.nominal_terbaca || 0) - (b.nominal_terbaca || 0)
    return 0
  })

  const totalNominal = filtered.reduce((sum, s) => sum + (s.nominal_terbaca || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-3.5">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5"/>
          </button>
          <h2 className="font-semibold text-gray-900">Semua Riwayat Scan</h2>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {filtered.length} data
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-5 py-6 space-y-4">
        {filtered.length > 0 && (
          <div className="bg-gradient-to-r from-[#2E6B44] to-[#1e4a30] rounded-2xl p-4 text-white">
            <p className="text-xs opacity-80 mb-1">Total Pengeluaran dari Struk</p>
            <p className="text-2xl font-bold">{formatRupiah(totalNominal)}</p>
            <p className="text-xs opacity-80 mt-1">Dari {filtered.length} transaksi</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari merchant atau teks..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30 bg-white"
            />
          </div>
          <select value={filterKat} onChange={e => setFilterKat(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30 bg-white text-gray-700">
            <option value="">Semua Kategori</option>
            {KATEGORI_OPTIONS.map(k=><option key={k} value={k}>{k}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6B44]/30 bg-white text-gray-700">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="highest">Nominal Tertinggi</option>
            <option value="lowest">Nominal Terendah</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3"/>
            <p className="text-sm text-gray-400">Tidak ada data ditemukan</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(s => {
              const tgl = s.tanggal_terbaca || s.created_at
              const tglDisplay = tgl ? new Date(tgl).toLocaleDateString('id-ID', {
                day:'numeric', month:'long', year:'numeric'
              }) : '—'
              return (
                <div key={s.id}
                  className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-[#2E6B44]/30 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => onSelect(s)}>
                  <div className="w-10 h-10 bg-[#F0F7F3] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5 text-[#2E6B44]"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {s.merchant || s.teks_terbaca?.split('\n')[0] || 'Struk'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{tglDisplay}</span>
                      {s.kategori && (
                        <span className="text-[10px] bg-[#F0F7F3] text-[#2E6B44] px-2 py-0.5 rounded-full font-medium">
                          {s.kategori}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      {s.nominal_terbaca ? formatRupiah(s.nominal_terbaca)
                        : <span className="text-gray-300 font-normal text-xs italic">Belum terbaca</span>}
                    </p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); onDelete(s.id) }}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all ml-1 flex-shrink-0">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function ScanStruk() {
  const { toggleSidebar } = useOutletContext()
  const [riwayat, setRiwayat]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [uploading, setUploading]       = useState(false)
  const [selected, setSelected]         = useState(null)
  const [delId, setDelId]               = useState(null)
  const [dragOver, setDragOver]         = useState(false)
  const [uploadMsg, setUploadMsg]       = useState('')
  const [latestResult, setLatestResult] = useState(null)
  const [showRiwayat, setShowRiwayat]   = useState(false)
  const [toast, setToast]               = useState(null)
  const fileRef = useRef(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const fetchRiwayat = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await scanAPI.getAll()
      const list = data.data || data || []
      setRiwayat(list)
    } catch(e) { 
      console.error(e)
    }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchRiwayat() }, [fetchRiwayat])

  const handleFile = async (file) => {
    if (!file) return
    const allowed = ['image/jpeg','image/jpg','image/png','image/webp']
    if (!allowed.includes(file.type)) { 
      setUploadMsg('File harus berupa gambar (jpeg/png/webp)')
      showToast('Format file tidak didukung', 'error')
      return 
    }
    if (file.size > 5*1024*1024) { 
      setUploadMsg('Ukuran file maksimal 5MB')
      showToast('Ukuran file terlalu besar', 'error')
      return 
    }
    
    setUploading(true)
    setUploadMsg('Memproses OCR...')
    setLatestResult(null) // Reset dulu sebelum upload baru
    
    const fd = new FormData()
    fd.append('gambar', file)
    
    try {
      const res = await scanAPI.scan(fd)
      const scanBaru = res.data?.data || res.data || null
      setLatestResult(scanBaru)
      setUploadMsg('✓ Struk berhasil diproses!')
      showToast('Struk berhasil diproses', 'success')
      await fetchRiwayat()
    } catch(e) { 
      setUploadMsg(getErrorMessage(e))
      showToast(getErrorMessage(e), 'error')
    } finally { 
      setUploading(false)
    }
  }

  const handleDrop = e => { 
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if(f) handleFile(f) 
  }

  const handleDelete = async id => {
    try {
      await scanAPI.delete(id)
      if (latestResult?.id === id) {
        setLatestResult(null) // Reset jika yang dihapus adalah yang sedang ditampilkan
      }
      await fetchRiwayat()
      showToast('Data berhasil dihapus', 'success')
    } catch(e) { 
      showToast(getErrorMessage(e), 'error')
    }
    finally { setDelId(null) }
  }

  // Fungsi untuk reset setelah save - INI YANG PENTING!
  const handleAfterSave = async () => {
    await fetchRiwayat()     // Refresh data riwayat
    setSelected(null)        // Tutup modal
    setLatestResult(null)    // Reset detail ke kosong - INI YANG ANDA MINTA!
    showToast('Data berhasil disimpan', 'success')
  }

  const displayScan = latestResult

  if (showRiwayat) {
    return (
      <>
        <HalamanRiwayat
          riwayat={riwayat}
          onBack={() => setShowRiwayat(false)}
          onSelect={s => { 
            setSelected(s)
            setShowRiwayat(false)
            setLatestResult(s)
          }}
          onDelete={id => setDelId(id)}
        />
        <VerifikasiModal 
          scan={selected} 
          open={!!selected}
          onClose={() => setSelected(null)}
          onSaved={handleAfterSave}  // Gunakan fungsi reset
        />
        {delId && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Hapus Scan?</h3>
              <p className="text-sm text-gray-500 mb-5">Data scan dan file gambar akan dihapus permanen.</p>
              <div className="flex gap-3">
                <button onClick={() => setDelId(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50">Batal</button>
                <button onClick={() => handleDelete(delId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl text-sm">Hapus</button>
              </div>
            </div>
          </div>
        )}
        {toast && <Toast {...toast} onClose={() => setToast(null)}/>}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-3.5">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Menu className="w-5 h-5"/>
          </button>
          <h2 className="font-semibold text-gray-900">Scan Struk</h2>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-5 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-5">
            <div>
              <h1 className="font-bold text-3xl text-[#2E6B44] leading-tight">Digitalisasi Struk Anda</h1>
              <p className="text-[#F5A623] font-bold text-2xl leading-tight">Secara Otomatis.</p>
              <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
                Teknologi Arvesta AI mendeteksi merchant, tanggal, dan total belanja Anda
                dengan akurasi 99%. Cukup unggah dan biarkan kami kurasi data keuangan Anda.
              </p>
            </div>

            {/* Upload Zone */}
            <div
              onDragOver={e=>{e.preventDefault();setDragOver(true)}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={handleDrop}
              onClick={()=>!uploading && fileRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-10 transition-all duration-200 cursor-pointer
                ${dragOver ? 'border-[#2E6B44] bg-[#2E6B44]/5' : 'border-gray-200 hover:border-[#2E6B44]/40 hover:bg-gray-50'}`}>
              {uploading ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Loader2 className="w-10 h-10 text-[#2E6B44] animate-spin"/>
                  <p className="text-sm text-gray-500">{uploadMsg}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
                      <Camera className="w-7 h-7 text-[#2E6B44]"/>
                    </div>
                    <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
                      <Upload className="w-7 h-7 text-gray-400"/>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-800 text-base">Ambil Foto atau Unggah File</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG · Maks 5MB</p>
                  </div>
                  <button type="button"
                    className="flex items-center gap-2 bg-[#2E6B44] text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-[#255839] transition-colors"
                    onClick={e=>{e.stopPropagation();fileRef.current?.click()}}>
                    <Upload className="w-4 h-4"/> Pilih File
                  </button>
                </div>
              )}
            </div>

            {uploadMsg && !uploading && (
              <p className={`text-sm text-center ${uploadMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
                {uploadMsg}
              </p>
            )}

            <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden"
              onChange={e=>{if(e.target.files[0]) handleFile(e.target.files[0]); e.target.value=''}}/>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <TipCard icon={Sun}          title="Pencahayaan Cukup"    desc="Pastikan struk berada di bawah cahaya terang untuk deteksi teks yang akurat."/>
              <TipCard icon={AlignJustify} title="Struk Tidak Terlipat" desc="Ratakan struk dan pastikan seluruh bagian struk terlihat di dalam bingkai."/>
              <TipCard icon={Focus}        title="Fokus Tajam"          desc="Tunggu hingga kamera benar-benar fokus agar angka-angka terbaca sempurna."/>
            </div>
          </div>

          {/* RIGHT COLUMN - Detail Panel */}
          <div className="w-full lg:w-80 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4 flex-shrink-0">
            <h3 className="font-semibold text-gray-900 text-base">Detail Terdeteksi</h3>
            
            {uploading ? (
              <div className="py-10 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#2E6B44] animate-spin mx-auto"/>
                <p className="text-xs text-gray-400">Menganalisis struk...</p>
              </div>
            ) : displayScan ? (
              <>
                <DetailRow icon={Store} label="Toko / Merchant" value={displayScan.merchant || '—'}/>
                <DetailRow icon={CalendarDays} label="Tanggal Transaksi" value={
                  displayScan.tanggal_terbaca
                    ? new Date(displayScan.tanggal_terbaca).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})
                    : '—'}/>
                <DetailRow icon={Wallet} label="Total Jumlah" accent
                  value={displayScan.nominal_terbaca ? formatRupiah(displayScan.nominal_terbaca) : '—'}/>
                <DetailRow icon={Tag} label="Kategori" value={displayScan.kategori || 'Belum Dikategorikan'}/>
                
                {displayScan.teks_terbaca && (
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Ringkasan Item</p>
                    <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed line-clamp-3">
                      {displayScan.teks_terbaca}
                    </p>
                  </div>
                )}
                
                <div className="space-y-2 pt-1">
                  <button 
                    onClick={() => setSelected(displayScan)}
                    className="w-full bg-[#2E6B44] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#255839] transition-colors">
                    Simpan ke Pengeluaran
                  </button>
                  <button 
                    onClick={() => setSelected(displayScan)}
                    className="w-full bg-[#FFF3E0] text-[#D4880C] text-sm font-medium py-3 rounded-xl hover:bg-[#FFE0B2] transition-colors">
                    Tandai sebagai Penting
                  </button>
                </div>
              </>
            ) : (
              <EmptyState 
                icon={FileText}
                title="Belum Ada Data"
                message="Unggah struk untuk melihat detail"
              />
            )}
          </div>
        </div>

        {/* Pindaian Terkini */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2E6B44]"/> Pindaian Terkini
            </h2>
            {riwayat.length > 0 && (
              <button onClick={() => setShowRiwayat(true)}
                className="text-sm text-[#2E6B44] font-medium hover:underline flex items-center gap-1">
                Lihat Semua <ChevronRight className="w-3.5 h-3.5"/>
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[1,2,3,4].map(i=><div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse"/>)}
            </div>
          ) : riwayat.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl text-center py-12 border border-gray-100">
              <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2"/>
              <p className="text-sm text-gray-400">Belum ada riwayat scan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {riwayat.slice(0,8).map(s => {
                const tgl = s.tanggal_terbaca || s.created_at
                const tglDisplay = tgl ? new Date(tgl).toLocaleDateString('id-ID',{day:'numeric',month:'short'}) : ''
                const isActive = displayScan?.id === s.id
                return (
                  <div key={s.id}
                    onClick={() => { setLatestResult(s); setSelected(null) }}
                    className={`bg-white rounded-2xl p-4 text-left hover:shadow-md transition-all border group cursor-pointer
                      ${isActive ? 'border-[#2E6B44]/40 ring-1 ring-[#2E6B44]/20' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#2E6B44]/10' : 'bg-gray-50'}`}>
                        <Store className="w-4 h-4 text-[#2E6B44]"/>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-gray-400">{tglDisplay}</span>
                        <button onClick={e=>{e.stopPropagation();setDelId(s.id)}}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all">
                          <Trash2 className="w-3 h-3"/>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-0.5">{s.kategori || 'Lainnya'}</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {s.merchant || s.teks_terbaca?.split('\n')[0] || 'Struk'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-bold text-gray-900">
                        {s.nominal_terbaca ? formatRupiah(s.nominal_terbaca)
                          : <span className="text-gray-300 font-normal text-xs italic">Belum terbaca</span>}
                      </p>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2E6B44] transition-colors"/>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-gray-300 uppercase tracking-widest mt-12">
          Sistem Pengenalan Karakter Optik Arvesta V4.2.0 · Dienkripsi AES-256
        </p>
      </div>

      <VerifikasiModal 
        scan={selected} 
        open={!!selected}
        onClose={() => setSelected(null)}
        onSaved={handleAfterSave}  // Gunakan fungsi reset yang sama
      />

      {delId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Hapus Scan?</h3>
            <p className="text-sm text-gray-500 mb-5">Data scan dan file gambar akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50">Batal</button>
              <button onClick={() => handleDelete(delId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl text-sm">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)}/>}
    </div>
  )
}