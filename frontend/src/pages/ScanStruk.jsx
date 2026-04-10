import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Menu, Upload, Camera, CheckCircle, Trash2, Edit2, FileText, X, Loader2 } from 'lucide-react'
import { scanAPI } from '../services/api'
import { formatRupiah, formatTanggalJam, getErrorMessage } from '../utils/mockData'

/* ── Verify/Edit Modal ── */
function VerifikasiModal({ scan, open, onClose, onSaved }) {
  const [form, setForm] = useState({ nominal_terbaca:'', tanggal_terbaca:'', teks_terbaca:'' })
  const [saving, setSaving] = useState(false); const [err, setErr] = useState('')
  const [simpaning, setSimpaning] = useState(false)

  useEffect(() => {
    if (scan) setForm({
      nominal_terbaca: scan.nominal_terbaca || '',
      tanggal_terbaca: scan.tanggal_terbaca?.slice(0,10) || '',
      teks_terbaca:    scan.teks_terbaca    || '',
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
      })
      onSaved(); onClose()
    } catch (e) { setErr(getErrorMessage(e)) }
    finally { setSaving(false) }
  }

  const handleSimpan = async () => {
    if (!scan?.nominal_terbaca && !form.nominal_terbaca) { setErr('Nominal wajib ada untuk simpan ke transaksi'); return }
    setSimpaning(true); setErr('')
    try { await scanAPI.simpanKeTransaksi(scan.id, {}); onSaved(); onClose() }
    catch (e) { setErr(getErrorMessage(e)) }
    finally { setSimpaning(false) }
  }

  if (!open || !scan) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-float w-full max-w-lg animate-fade-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-ink">Verifikasi Struk</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {/* Preview gambar */}
          {scan.path_gambar && (
            <img src={`/uploads/${scan.path_gambar.split('/').pop()}`}
              alt="Struk" className="w-full max-h-40 object-contain rounded-xl bg-gray-50" />
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="input-label">Nominal Terbaca (Rp)</label>
              <input type="number" value={form.nominal_terbaca}
                onChange={e => setForm(v => ({...v,nominal_terbaca:e.target.value}))}
                placeholder="0" min="0" step="any" className="input-field font-mono" />
            </div>
            <div>
              <label className="input-label">Tanggal Terbaca</label>
              <input type="date" value={form.tanggal_terbaca}
                onChange={e => setForm(v => ({...v,tanggal_terbaca:e.target.value}))}
                className="input-field" />
            </div>
            <div>
              <label className="input-label">Teks OCR</label>
              <textarea value={form.teks_terbaca}
                onChange={e => setForm(v => ({...v,teks_terbaca:e.target.value}))}
                rows={3} className="input-field resize-none text-xs font-mono" placeholder="Teks hasil OCR..." />
            </div>
            {err && <p className="text-sm text-red-500">{err}</p>}
            <div className="flex gap-3 flex-wrap">
              <button type="submit" disabled={saving} className="btn-secondary flex-1 text-sm disabled:opacity-60">
                {saving ? 'Menyimpan...' : <><Edit2 className="w-3.5 h-3.5" /> Update</>}
              </button>
              <button type="button" onClick={handleSimpan} disabled={simpaning} className="btn-primary flex-1 text-sm disabled:opacity-60">
                {simpaning ? 'Menyimpan...' : <><CheckCircle className="w-3.5 h-3.5" /> Simpan ke Transaksi</>}
              </button>
            </div>
          </form>
        </div>
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
    const allowed = ['image/jpeg','image/jpg','image/png','image/webp']
    if (!allowed.includes(file.type)) { setUploadMsg('File harus berupa gambar (jpeg/png/webp)'); return }
    if (file.size > 5 * 1024 * 1024)  { setUploadMsg('Ukuran file maksimal 5MB'); return }

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

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-gray-100 px-5 py-3.5">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <button onClick={toggleSidebar} className="lg:hidden btn-ghost p-2"><Menu className="w-5 h-5" /></button>
          <h2 className="font-semibold text-ink">Scan Struk</h2>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {/* Hero upload area */}
        <div className="card text-center">
          <div className="mb-3">
            <h1 className="font-display text-2xl font-bold text-ink">Digitalisasi Struk Anda</h1>
            <p className="text-sm text-ink-muted mt-1">Secara Otomatis.</p>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-2xl p-10 my-5 transition-all duration-200 cursor-pointer
              ${dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-surface-muted'}
            `}
            onClick={() => !uploading && fileRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
                <p className="text-sm text-ink-muted">{uploadMsg}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                    <Camera className="w-6 h-6 text-primary-700" />
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-ink-muted" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-ink">Ambil Foto atau Unggah File</p>
                  <p className="text-xs text-ink-muted mt-1">JPEG, PNG, WEBP · Maks 5MB</p>
                </div>
                <button type="button" className="btn-primary text-sm px-6 py-2.5">
                  <Upload className="w-4 h-4" /> Pilih File
                </button>
              </div>
            )}
          </div>

          {uploadMsg && !uploading && (
            <p className={`text-sm ${uploadMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>{uploadMsg}</p>
          )}

          <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden" onChange={e => { if(e.target.files[0]) handleFile(e.target.files[0]); e.target.value='' }} />
        </div>

        {/* Riwayat */}
        <div>
          <h2 className="font-semibold text-ink mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-700" /> Riwayat Scan
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
            </div>
          ) : riwayat.length === 0 ? (
            <div className="card text-center py-10">
              <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-ink-muted">Belum ada riwayat scan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {riwayat.map(s => (
                <div key={s.id} className="card flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                    {s.path_gambar ? (
                      <img src={`/uploads/${s.path_gambar.split('/').pop()}`} alt="struk"
                        className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink tabular-nums">
                      {s.nominal_terbaca ? formatRupiah(s.nominal_terbaca) : <span className="text-ink-light italic text-sm">Nominal belum terbaca</span>}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {s.tanggal_terbaca ? formatTanggalJam(s.tanggal_terbaca) : formatTanggalJam(s.created_at)}
                    </p>
                    {s.teks_terbaca && (
                      <p className="text-xs text-ink-light mt-0.5 truncate max-w-xs">{s.teks_terbaca}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => setSelected(s)}
                      className="btn-ghost p-2 text-primary-700" title="Verifikasi">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDelId(s.id)}
                      className="btn-ghost p-2 text-red-400 hover:text-red-500" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <VerifikasiModal
        scan={selected} open={!!selected}
        onClose={() => setSelected(null)} onSaved={fetchRiwayat}
      />

      {delId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-float p-6 w-full max-w-sm animate-fade-up">
            <h3 className="font-semibold text-ink mb-2">Hapus Scan?</h3>
            <p className="text-sm text-ink-muted mb-5">Data scan dan file gambar akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="btn-secondary flex-1">Batal</button>
              <button onClick={() => handleDelete(delId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
