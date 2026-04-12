import React, { useState, useEffect, useCallback } from 'react'
import {
  Search, Bell, User, ShoppingCart, Car, ShoppingBag,
  FileText, Tv, ChevronLeft, ChevronRight, Edit2, Trash2,
  ArrowLeft, Share2, Download, X, Check, TrendingUp, TrendingDown,
  CreditCard, Clock, BarChart2, Plus, Loader
} from 'lucide-react'
import { transaksiAPI, exportAPI } from '../services/api'

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const FONT = "'Plus Jakarta Sans', Inter, sans-serif"
const GREEN_DARK = '#1B3A2D'
const GREEN_MID  = '#2D5040'
const CREAM      = '#F5F0E8'
const CREAM2     = '#EDE8DF'
const ORANGE     = '#E8692A'
const WHITE      = '#FFFFFF'

const CATEGORIES = [
  { id:'makanan',   label:'Makanan',   Icon:ShoppingCart, color:'#F59E0B' },
  { id:'transport', label:'Transport', Icon:Car,          color:'#10B981' },
  { id:'belanja',   label:'Belanja',   Icon:ShoppingBag,  color:'#8B5CF6' },
  { id:'tagihan',   label:'Tagihan',   Icon:FileText,     color:'#3B82F6' },
  { id:'hiburan',   label:'Hiburan',   Icon:Tv,           color:'#EF4444' },
  { id:'pemasukan', label:'Pemasukan', Icon:TrendingUp,   color:'#22C55E' },
]

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const fmtShort = (val) => {
  const n = parseFloat(val) || 0
  if (n >= 1_000_000) return `Rp${(n/1_000_000).toFixed(0)}jt`
  if (n >= 1_000)     return `Rp${(n/1_000).toFixed(0)}rb`
  return `Rp${n}`
}
const fmtFull = (val) => `Rp${Math.abs(parseFloat(val)||0).toLocaleString('id-ID')}`
const fmtDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})
}
const todayInput = () => new Date().toISOString().slice(0,10)
const todayDisplay = () => new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'})
const getCat = (id) => CATEGORIES.find(c => c.id === id?.toLowerCase())

// Ambil 30 hari lalu & hari ini dalam format YYYY-MM-DD
const getDefaultRange = () => {
  const to   = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  const fmt = d => d.toISOString().slice(0,10)
  return { dari: fmt(from), sampai: fmt(to) }
}

/* ═══════════════════════════════════════════════════════════
   INJECT STYLES  (tidak diubah)
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
.pu * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', Inter, sans-serif; }
.pu-input {
  width:100%; padding:11px 14px; border-radius:12px;
  border:1.5px solid #DDD8CF; font-family:${FONT};
  font-size:13px; outline:none; color:${GREEN_DARK};
  background:${WHITE}; transition:border-color .15s;
}
.pu-input:focus { border-color:${GREEN_DARK}; }
.pu-input::placeholder { color:#BDBDBD; }
.pu-btn-save {
  display:flex; align-items:center; justify-content:space-between;
  width:100%; padding:15px 20px; background:${GREEN_DARK};
  color:#fff; border:none; border-radius:14px; font-size:15px;
  font-weight:700; cursor:pointer; font-family:${FONT};
  transition:background .15s;
}
.pu-btn-save:hover { background:${GREEN_MID}; }
.pu-btn-save:disabled { background:#ccc; cursor:not-allowed; }
.pu-tr-row { cursor:pointer; transition:background .15s; border-bottom:1px solid #F5F0E8; }
.pu-tr-row:hover { background:#FAF8F4; }
.pu-recent-item { cursor:pointer; transition:background .15s; border-radius:12px; }
.pu-recent-item:hover { background:${CREAM}; }
.pu-cat-btn { transition:all .15s; cursor:pointer; }
.pu-cat-btn:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.1); }
.pu-icon-btn { transition:color .15s; }
.pu-icon-btn:hover { color:${GREEN_DARK} !important; }
.pu-icon-btn-del:hover { color:#E53935 !important; }
.tab-btn { transition: all .2s; cursor:pointer; }
.filter-btn { transition: all .15s; cursor:pointer; }
.filter-btn:hover { border-color:${GREEN_DARK}; }
@media(max-width:900px){
  .pu-layout { grid-template-columns:1fr !important; }
  .pu-sidebar { display:none !important; }
  .pu-dash-grid { grid-template-columns:1fr !important; }
}
@media(max-width:600px){
  .pu-topbar { padding:12px 16px !important; }
  .pu-page-pad { padding:4px 16px 60px !important; }
  .pu-form-grid { grid-template-columns:1fr !important; }
  .pu-detail-hdr { flex-direction:column; align-items:flex-start !important; }
  .pu-detail-btns { flex-wrap:wrap; }
  .pu-stat-grid { grid-template-columns:1fr 1fr !important; }
  .pu-bot-grid { grid-template-columns:1fr !important; }
}
`

function StyleInject() {
  useEffect(() => {
    const id = 'pu-css'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id; el.textContent = CSS
      document.head.appendChild(el)
    } else {
      document.getElementById(id).textContent = CSS
    }
  }, [])
  return null
}

/* ═══════════════════════════════════════════════════════════
   EXPORT HELPER  (fungsional via exportAPI)
═══════════════════════════════════════════════════════════ */
async function handleExport(format) {
  const { dari, sampai } = getDefaultRange()
  try {
    const res = format === 'excel'
      ? await exportAPI.excel(dari, sampai)
      : await exportAPI.pdf(dari, sampai)

    const mime = format === 'excel'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/pdf'
    const ext  = format === 'excel' ? 'xlsx' : 'pdf'

    const url  = window.URL.createObjectURL(new Blob([res.data], { type: mime }))
    const a    = document.createElement('a')
    a.href     = url
    a.download = `transaksi_${dari}_${sampai}.${ext}`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Export gagal:', err)
    alert('Ekspor gagal. Coba lagi.')
  }
}

/* ═══════════════════════════════════════════════════════════
   NORMALIZE API RESPONSE → array transaksi
═══════════════════════════════════════════════════════════ */
function normalizeList(d) {
  const raw = d?.data ?? d?.transaksi ?? d ?? []
  return Array.isArray(raw) ? raw : []
}

/* ═══════════════════════════════════════════════════════════
   DETAIL VIEW  (tidak diubah — hanya fungsi ekspor aktif)
═══════════════════════════════════════════════════════════ */
function DetailView({ trx, onBack, onEdit, onDelete }) {
  const cat   = getCat(trx.kategori)
  const CIcon = cat?.Icon || Tv
  const dateStr = trx.tanggal
    ? fmtDate(trx.tanggal) + ' • 06:00 WIB'
    : ''

  return (
    <div className="pu" style={{minHeight:'100vh',background:CREAM,fontFamily:FONT}}>
      <div className="pu-topbar pu-detail-hdr"
        style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 28px',gap:12}}>
        <button onClick={onBack}
          style={{display:'flex',alignItems:'center',gap:8,background:'none',border:'none',cursor:'pointer',
            color:GREEN_DARK,fontFamily:FONT,fontSize:14,fontWeight:500,flexShrink:0}}>
          <ArrowLeft size={17}/> Detail Transaksi
        </button>
        <div className="pu-detail-btns" style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <button style={{display:'flex',alignItems:'center',gap:6,background:GREEN_DARK,color:'#fff',
            border:'none',borderRadius:50,padding:'8px 18px',cursor:'pointer',fontSize:13,fontFamily:FONT,fontWeight:600}}>
            <Share2 size={13}/> Bagikan Resi
          </button>
          <button onClick={()=>onEdit(trx)}
            style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'1.5px solid #D0CBC1',
              borderRadius:50,padding:'8px 18px',cursor:'pointer',fontSize:13,fontFamily:FONT,color:GREEN_DARK,fontWeight:500}}>
            <Edit2 size={13}/> Edit
          </button>
          <button onClick={()=>onDelete(trx.id)}
            style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'1.5px solid #FFCDD2',
              borderRadius:50,padding:'8px 18px',cursor:'pointer',fontSize:13,fontFamily:FONT,color:'#E53935',fontWeight:500}}>
            <Trash2 size={13}/> Hapus
          </button>
        </div>
      </div>

      <div style={{maxWidth:580,margin:'0 auto',padding:'8px 24px 60px'}}>
        <div style={{background:WHITE,borderRadius:24,boxShadow:'0 8px 32px rgba(0,0,0,0.09)',overflow:'hidden'}}>
          <div style={{padding:'40px 32px 28px',textAlign:'center',borderBottom:'1.5px dashed #E8E0D4'}}>
            <div style={{width:72,height:72,borderRadius:18,background:(cat?.color||'#888')+'22',
              display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',
              border:`1.5px solid ${cat?.color||'#888'}30`}}>
              <CIcon size={30} color={cat?.color||'#888'}/>
            </div>
            <h2 style={{fontSize:22,fontWeight:700,color:GREEN_DARK,marginBottom:6}}>{trx.deskripsi}</h2>
            <p style={{color:'#9E9E9E',fontSize:13}}>{dateStr}</p>
          </div>

          <div style={{padding:'4px 32px 0'}}>
            {[
              {label:'Kategori',          val:trx.kategori,      type:'badge'},
              {label:'Metode Pembayaran', val:trx.metode,        type:'metode'},
              {label:'Status',            val:trx.status,        type:'status'},
              {label:'ID Transaksi',      val:trx.id_transaksi,  type:'text'},
            ].map(row=>(
              <div key={row.label}
                style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                  padding:'14px 0',borderBottom:'1px solid #F5F0E8'}}>
                <span style={{color:'#9E9E9E',fontSize:14}}>{row.label}</span>
                <span style={{fontSize:14,fontWeight:500,color:GREEN_DARK}}>
                  {row.type==='badge'&&(
                    <span style={{background:(cat?.color||'#888')+'1A',color:cat?.color||'#888',
                      padding:'4px 14px',borderRadius:50,fontSize:12,fontWeight:700,textTransform:'uppercase'}}>
                      {row.val}
                    </span>
                  )}
                  {row.type==='metode'&&(
                    <span style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{width:22,height:22,borderRadius:6,background:'#0070BA',
                        display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
                        <span style={{color:'#fff',fontSize:10,fontWeight:800}}>D</span>
                      </span>
                      {row.val}
                    </span>
                  )}
                  {row.type==='status'&&(
                    <span style={{display:'flex',alignItems:'center',gap:7,color:'#43A047',fontWeight:600}}>
                      <span style={{width:8,height:8,borderRadius:'50%',background:'#43A047',display:'inline-block'}}/>
                      {row.val}
                    </span>
                  )}
                  {row.type==='text'&&row.val}
                </span>
              </div>
            ))}

            {trx.catatan&&(
              <div style={{margin:'16px 0',background:'#FFFBF6',borderRadius:12,padding:'14px 16px',border:'1px solid #F5DEC8'}}>
                <p style={{fontSize:11,fontWeight:700,color:'#BCA080',textTransform:'uppercase',letterSpacing:0.8,marginBottom:8}}>Catatan Pembelian:</p>
                <p style={{fontSize:13,color:'#666',lineHeight:1.65}}>{trx.catatan}</p>
              </div>
            )}

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 0 28px'}}>
              <span style={{fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1}}>Total Pembayaran</span>
              <span style={{fontSize:30,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif'}}>{fmtFull(trx.nominal)}</span>
            </div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:18}}>
          <div style={{background:WHITE,borderRadius:16,padding:'16px 18px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{fontSize:12,color:'#9E9E9E',fontWeight:500}}>Wawasan Anggaran</span>
              <span style={{fontSize:11,color:ORANGE,fontWeight:700}}>71% Digunakan</span>
            </div>
            <div style={{background:CREAM2,borderRadius:50,height:6,overflow:'hidden'}}>
              <div style={{width:'71%',height:'100%',background:`linear-gradient(90deg,${ORANGE},#FF5722)`,borderRadius:50}}/>
            </div>
            <p style={{marginTop:8,fontSize:11,color:'#BDBDBD',lineHeight:1.5}}>Sisa anggaran hiburan bulan ini adalah Rp250.000</p>
          </div>
          <div style={{background:WHITE,borderRadius:16,padding:'16px 18px',display:'flex',gap:10,alignItems:'flex-start'}}>
            <div style={{width:34,height:34,borderRadius:10,background:'#E8F5E9',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:18}}>🔒</div>
            <p style={{fontSize:11,color:'#9E9E9E',lineHeight:1.55}}>Transaksi aman. SSL terenkripsi dan terverifikasi Palo.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ADD / EDIT MODAL
═══════════════════════════════════════════════════════════ */
function TransaksiModal({ open, onClose, onSaved, editData }) {
  const isEdit = !!editData
  const empty = { tipe:'expense', nominal:'', tanggal:todayInput(), deskripsi:'', kategori:'', merchant:'', catatan:'' }
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setForm(editData ? {
      tipe:     editData.tipe||'expense',
      nominal:  editData.nominal||'',
      tanggal:  editData.tanggal?.slice(0,10)||todayInput(),
      deskripsi:editData.deskripsi||'',
      kategori: editData.kategori||'',
      merchant: editData.merchant||'',
      catatan:  editData.catatan||'',
    } : empty)
  }, [open, editData])

  const set = k => e => setForm(v=>({...v,[k]:e.target.value}))

  const save = async () => {
    if (!form.nominal || !form.tanggal) return
    setSaving(true)
    setError(null)
    try {
      const payload = {
        tipe:     form.tipe,
        nominal:  parseFloat(form.nominal),
        tanggal:  form.tanggal,
        deskripsi:form.deskripsi,
        kategori: form.kategori,
        merchant: form.merchant,
        catatan:  form.catatan,
      }
      let res
      if (isEdit) {
        res = await transaksiAPI.update(editData.id, payload)
      } else {
        res = await transaksiAPI.create(payload)
      }
      // Normalize response — bisa beda struktur tiap backend
      const saved = res?.data?.data ?? res?.data ?? payload
      onSaved({ ...payload, ...saved, id: saved.id ?? editData?.id ?? Date.now() })
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal menyimpan transaksi.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null
  return (
    <div onClick={onClose}
      style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:200,
        display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div className="pu" onClick={e=>e.stopPropagation()}
        style={{background:WHITE,borderRadius:24,width:'100%',maxWidth:480,maxHeight:'90vh',
          overflowY:'auto',fontFamily:FONT}}>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'22px 24px 0'}}>
          <h3 style={{fontSize:16,fontWeight:700,color:GREEN_DARK,fontFamily:FONT}}>
            {isEdit?'Edit Transaksi':'Catat Transaksi'}
          </h3>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'#9E9E9E',padding:4}}>
            <X size={20}/>
          </button>
        </div>

        <div style={{padding:'16px 24px 24px'}}>
          {error && (
            <div style={{background:'#FFEBEE',color:'#C62828',padding:'10px 14px',borderRadius:10,fontSize:13,marginBottom:14}}>
              {error}
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,background:CREAM,borderRadius:14,padding:4,marginBottom:20}}>
            {['expense','income'].map(t=>(
              <button key={t} onClick={()=>setForm(v=>({...v,tipe:t}))}
                style={{padding:'11px',borderRadius:11,border:'none',cursor:'pointer',fontFamily:FONT,fontSize:13,fontWeight:700,
                  background:form.tipe===t?WHITE:'transparent',
                  color:form.tipe===t?(t==='expense'?ORANGE:'#43A047'):'#9E9E9E',
                  boxShadow:form.tipe===t?'0 2px 10px rgba(0,0,0,0.12)':'none',
                  transition:'all .2s'}}>
                {t==='income'?'💰 Pemasukan':'💸 Pengeluaran'}
              </button>
            ))}
          </div>

          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Nominal (Rp)</label>
            <input className="pu-input" type="number" value={form.nominal} onChange={set('nominal')}
              placeholder="0" min="1" style={{fontSize:20,fontWeight:700}}/>
          </div>

          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1,marginBottom:10}}>Pilih Kategori</label>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {CATEGORIES.map(({id,label,Icon:Ico,color})=>{
                const active = form.kategori===id
                return (
                  <button key={id} onClick={()=>setForm(v=>({...v,kategori:active?'':id}))} className="pu-cat-btn"
                    style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5,padding:'10px 14px',
                      borderRadius:14,border:`2px solid ${active?color:'#E8E0D4'}`,
                      background:active?color+'18':WHITE,cursor:'pointer',minWidth:68,fontFamily:FONT,position:'relative'}}>
                    <Ico size={20} color={color}/>
                    <span style={{fontSize:9,fontWeight:700,color:active?color:'#BDBDBD',textTransform:'uppercase',letterSpacing:0.5}}>{label}</span>
                    {active&&<span style={{position:'absolute',top:-6,right:-6,width:16,height:16,borderRadius:'50%',background:color,display:'flex',alignItems:'center',justifyContent:'center'}}><Check size={9} color={WHITE}/></span>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pu-form-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
            <div>
              <label style={{display:'block',fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Tanggal</label>
              <input className="pu-input" type="date" value={form.tanggal} onChange={set('tanggal')}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Toko / Merchant</label>
              <input className="pu-input" type="text" value={form.merchant} onChange={set('merchant')} placeholder="Nama toko atau merchant"/>
            </div>
          </div>

          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Deskripsi</label>
            <input className="pu-input" type="text" value={form.deskripsi} onChange={set('deskripsi')} placeholder="Nama transaksi"/>
          </div>

          <div style={{marginBottom:22}}>
            <label style={{display:'block',fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>
              Catatan <span style={{fontWeight:400,textTransform:'none'}}>(Opsional)</span>
            </label>
            <textarea className="pu-input" value={form.catatan} onChange={set('catatan')}
              placeholder="Beli apa hari ini?" rows={3} style={{resize:'none',lineHeight:1.6}}/>
          </div>

          <button className="pu-btn-save" onClick={save} disabled={saving||!form.nominal||!form.tanggal}>
            <span>{saving?'Menyimpan...':isEdit?'Simpan Perubahan':'Simpan Transaksi'}</span>
            {saving ? <Loader size={18} style={{animation:'spin 1s linear infinite'}}/> : <span style={{fontSize:20}}>→</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DELETE CONFIRM
═══════════════════════════════════════════════════════════ */
function DeleteModal({ open, onClose, onConfirm, deleting }) {
  if (!open) return null
  return (
    <div onClick={onClose}
      style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:200,
        display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div className="pu" onClick={e=>e.stopPropagation()}
        style={{background:WHITE,borderRadius:20,padding:'28px 28px 24px',width:'100%',maxWidth:360,fontFamily:FONT}}>
        <div style={{width:52,height:52,borderRadius:16,background:'#FFEBEE',display:'flex',alignItems:'center',
          justifyContent:'center',marginBottom:16,fontSize:24}}>🗑️</div>
        <h3 style={{fontSize:17,fontWeight:700,color:GREEN_DARK,marginBottom:8}}>Hapus Transaksi?</h3>
        <p style={{fontSize:13,color:'#9E9E9E',lineHeight:1.6,marginBottom:24}}>
          Transaksi ini akan dihapus permanen dan tidak bisa dikembalikan.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <button onClick={onClose}
            style={{padding:'12px',borderRadius:12,border:'1.5px solid #E8E0D4',background:WHITE,
              cursor:'pointer',fontFamily:FONT,fontSize:14,fontWeight:600,color:'#666'}}>Batal</button>
          <button onClick={onConfirm} disabled={deleting}
            style={{padding:'12px',borderRadius:12,border:'none',background:'#E53935',
              cursor:deleting?'not-allowed':'pointer',fontFamily:FONT,fontSize:14,fontWeight:700,color:WHITE,opacity:deleting?0.7:1}}>
            {deleting?'Menghapus...':'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   EXPORT BUTTONS (reusable)
═══════════════════════════════════════════════════════════ */
function ExportButtons() {
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [loadingPdf,   setLoadingPdf]   = useState(false)

  const doExport = async (format) => {
    const setter = format === 'excel' ? setLoadingExcel : setLoadingPdf
    setter(true)
    await handleExport(format)
    setter(false)
  }

  return (
    <>
      {['excel','pdf'].map(f=>(
        <button key={f} onClick={()=>doExport(f)}
          disabled={f==='excel'?loadingExcel:loadingPdf}
          style={{display:'flex',alignItems:'center',gap:5,padding:'6px 12px',borderRadius:8,
            border:'1.5px solid #E8E0D4',background:WHITE,cursor:'pointer',
            fontFamily:FONT,fontSize:12,fontWeight:600,color:GREEN_DARK,
            opacity:(f==='excel'?loadingExcel:loadingPdf)?0.6:1}}>
          <Download size={12}/> {f==='excel'?'Excel':'PDF'}
        </button>
      ))}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD PAGE  — fetch dari API, summary otomatis terhitung
═══════════════════════════════════════════════════════════ */
function DashboardPage({ data, onDetail, onAdd, onEdit, onDelete, loading }) {
  const [page, setPage] = useState(1)
  const [exportingExcel, setExportingExcel] = useState(false)
  const LIMIT = 5

  const saldo       = data.reduce((s,t)=>s+(t.tipe==='income'?t.nominal:-t.nominal),0)
  const pemasukan   = data.filter(t=>t.tipe==='income').reduce((s,t)=>s+t.nominal,0)
  const pengeluaran = data.filter(t=>t.tipe==='expense').reduce((s,t)=>s+t.nominal,0)
  const totalTrx    = data.length
  const avgHarian   = Math.round(pengeluaran / 30)
  const tabungan    = pemasukan > 0 ? Math.round((1 - pengeluaran/pemasukan)*100) : 0

  const sorted   = [...data].sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal))
  const totPages = Math.max(1,Math.ceil(sorted.length/LIMIT))
  const pageData = sorted.slice((page-1)*LIMIT, page*LIMIT)

  const doExport = async () => {
    setExportingExcel(true)
    await handleExport('excel')
    setExportingExcel(false)
  }

  return (
    <div className="pu-page-pad" style={{maxWidth:1080,margin:'0 auto',padding:'0 32px 60px'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:22,flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontSize:32,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif',marginBottom:4}}>Pelacakan Uang</h1>
          <p style={{color:'#9E9E9E',fontSize:14}}>Analisis dan kelola arus keuangan harian Anda dengan presisi.</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={doExport} disabled={exportingExcel}
            style={{display:'flex',alignItems:'center',gap:6,background:WHITE,color:GREEN_DARK,
              border:'1.5px solid #D0CBC1',borderRadius:50,padding:'9px 18px',cursor:'pointer',
              fontSize:13,fontFamily:FONT,fontWeight:500,opacity:exportingExcel?0.6:1}}>
            <Download size={14}/> {exportingExcel?'Mengekspor...':'Ekspor Excel'}
          </button>
          <button onClick={onAdd}
            style={{display:'flex',alignItems:'center',gap:6,background:GREEN_DARK,color:'#fff',
              border:'none',borderRadius:50,padding:'9px 20px',cursor:'pointer',fontSize:13,fontFamily:FONT,fontWeight:700}}>
            <Plus size={14}/> Tambah Transaksi
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="pu-stat-grid" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',gap:16,marginBottom:24}}>
        <div style={{background:GREEN_DARK,borderRadius:22,padding:'26px 28px',position:'relative',overflow:'hidden',minHeight:130}}>
          <div style={{position:'absolute',top:0,right:0,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.05)',transform:'translate(20px,-20px)'}}/>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <CreditCard size={18} color="#fff"/>
              </div>
              <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.7)'}}>Total Saldo</span>
            </div>
            <span style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.6)',background:'rgba(255,255,255,0.1)',padding:'4px 10px',borderRadius:50}}>
              {new Date().toLocaleDateString('id-ID',{month:'long',year:'numeric'})}
            </span>
          </div>
          {loading
            ? <div style={{height:42,background:'rgba(255,255,255,0.1)',borderRadius:10,marginBottom:8}}/>
            : <p style={{fontSize:34,fontWeight:800,color:'#fff',fontFamily:'DM Serif Display,Georgia,serif',marginBottom:8}}>{fmtFull(saldo)}</p>
          }
        </div>

        <div style={{background:'#FFF8EC',borderRadius:22,padding:'24px'}}>
          <div style={{width:36,height:36,borderRadius:10,background:'#FDE68A',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
            <TrendingUp size={18} color="#B45309"/>
          </div>
          <p style={{fontSize:11,fontWeight:700,color:'#B45309',textTransform:'uppercase',letterSpacing:.8,marginBottom:6}}>Pemasukan Bulanan</p>
          {loading
            ? <div style={{height:32,background:'#FDE68A',borderRadius:8}}/>
            : <p style={{fontSize:24,fontWeight:800,color:'#92400E',fontFamily:'DM Serif Display,Georgia,serif'}}>{fmtFull(pemasukan)}</p>
          }
          <div style={{height:3,background:'#FDE68A',borderRadius:50,marginTop:14}}>
            <div style={{width:'70%',height:'100%',background:'#F59E0B',borderRadius:50}}/>
          </div>
        </div>

        <div style={{background:'#FFF0F0',borderRadius:22,padding:'24px'}}>
          <div style={{width:36,height:36,borderRadius:10,background:'#FCA5A5',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
            <TrendingDown size={18} color="#991B1B"/>
          </div>
          <p style={{fontSize:11,fontWeight:700,color:'#991B1B',textTransform:'uppercase',letterSpacing:.8,marginBottom:6}}>Pengeluaran Bulanan</p>
          {loading
            ? <div style={{height:32,background:'#FCA5A5',borderRadius:8}}/>
            : <p style={{fontSize:24,fontWeight:800,color:'#7F1D1D',fontFamily:'DM Serif Display,Georgia,serif'}}>{fmtFull(pengeluaran)}</p>
          }
          <div style={{height:3,background:'#FCA5A5',borderRadius:50,marginTop:14}}>
            <div style={{width:`${Math.min(100, pemasukan>0?(pengeluaran/pemasukan*100):0)}%`,height:'100%',background:'#EF4444',borderRadius:50}}/>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{background:WHITE,borderRadius:'16px 16px 0 0',padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {[['📅','30 Hari Terakhir'],['⚡','Semua Tipe'],['🏷️','Semua Kategori']].map(([ic,lbl])=>(
            <button key={lbl} className="filter-btn"
              style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:50,
                border:'1.5px solid #E0DAD0',background:WHITE,cursor:'pointer',fontSize:12,fontWeight:600,color:GREEN_DARK,fontFamily:FONT}}>
              {ic} {lbl} <ChevronRight size={12} style={{transform:'rotate(90deg)'}}/>
            </button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'#9E9E9E'}}>
          Urutkan berdasarkan: <strong style={{color:GREEN_DARK,cursor:'pointer'}}>Tanggal ▼</strong>
        </div>
      </div>

      {/* Transaction Table */}
      <div style={{background:WHITE,borderRadius:'0 0 20px 20px',overflow:'hidden',marginBottom:20}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#FAF8F4'}}>
                {['Tanggal','Kategori','Transaksi','Jumlah','Aksi'].map((h,i)=>(
                  <th key={h} style={{padding:'12px 20px',textAlign:i>=3?'right':'left',
                    fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',
                    letterSpacing:.5,whiteSpace:'nowrap'}}>{h}</th>
                ))}
                <th style={{padding:'12px 20px',textAlign:'center',fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',letterSpacing:.5}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:5}).map((_,i)=>(
                  <tr key={i}>
                    {Array.from({length:5}).map((__,j)=>(
                      <td key={j} style={{padding:'14px 20px'}}>
                        <div style={{height:14,background:'#F5F0E8',borderRadius:6,width:j===2?120:j===3?60:80}}/>
                      </td>
                    ))}
                  </tr>
                ))
                : pageData.map(t=>{
                  const cat = getCat(t.kategori)
                  const CatIcon = cat?.Icon || ShoppingCart
                  return (
                    <tr key={t.id} className="pu-tr-row" onClick={()=>onDetail(t)}>
                      <td style={{padding:'14px 20px'}}>
                        <div style={{fontSize:13,fontWeight:600,color:GREEN_DARK}}>{fmtDate(t.tanggal)}</div>
                        <div style={{fontSize:11,color:'#BDBDBD'}}>06:00 WIB</div>
                      </td>
                      <td style={{padding:'14px 20px'}}>
                        {cat
                          ? <span style={{background:cat.color+'20',color:cat.color,padding:'3px 11px',borderRadius:50,fontSize:11,fontWeight:700,textTransform:'uppercase',whiteSpace:'nowrap'}}>{cat.label}</span>
                          : <span style={{color:'#BDBDBD',fontSize:12}}>—</span>}
                      </td>
                      <td style={{padding:'14px 20px',maxWidth:200}}>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div style={{width:32,height:32,borderRadius:10,background:(cat?.color||'#888')+'20',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <CatIcon size={15} color={cat?.color||'#888'}/>
                          </div>
                          <div>
                            <p style={{fontSize:13,fontWeight:600,color:GREEN_DARK,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:1}}>{t.deskripsi}</p>
                            {t.merchant&&<p style={{fontSize:11,color:'#BDBDBD',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.merchant}</p>}
                          </div>
                        </div>
                      </td>
                      <td style={{padding:'14px 20px',textAlign:'right',fontSize:13,fontWeight:700,whiteSpace:'nowrap',
                        color:t.tipe==='income'?'#22C55E':'#EF4444'}}>
                        {t.tipe==='income'?'+':'-'}{fmtShort(t.nominal)}
                      </td>
                      <td style={{padding:'14px 20px',textAlign:'center'}}>
                        <div style={{display:'flex',justifyContent:'center',gap:2}} onClick={e=>e.stopPropagation()}>
                          <button className="pu-icon-btn" onClick={()=>onEdit(t)}
                            style={{padding:'6px 8px',border:'none',background:'none',cursor:'pointer',color:'#BDBDBD',borderRadius:8}}>
                            <Edit2 size={14}/>
                          </button>
                          <button className="pu-icon-btn pu-icon-btn-del" onClick={()=>onDelete(t.id)}
                            style={{padding:'6px 8px',border:'none',background:'none',cursor:'pointer',color:'#BDBDBD',borderRadius:8}}>
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>

        {totPages>1&&!loading&&(
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 22px',borderTop:`1px solid ${CREAM2}`}}>
            <span style={{fontSize:12,color:'#9E9E9E'}}>
              Menampilkan {(page-1)*LIMIT+1}–{Math.min(page*LIMIT,sorted.length)} dari {sorted.length} item
            </span>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <button onClick={()=>setPage(p=>p-1)} disabled={page<=1}
                style={{padding:'6px 10px',borderRadius:8,border:'1.5px solid #E8E0D4',background:WHITE,cursor:page<=1?'not-allowed':'pointer',opacity:page<=1?0.4:1}}>
                <ChevronLeft size={13}/>
              </button>
              {Array.from({length:Math.min(totPages,5)},(_,i)=>i+1).map(n=>(
                <button key={n} onClick={()=>setPage(n)}
                  style={{width:30,height:30,borderRadius:8,border:page===n?'none':'1.5px solid #E8E0D4',
                    background:page===n?GREEN_DARK:WHITE,color:page===n?WHITE:'#666',
                    fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:FONT}}>
                  {n}
                </button>
              ))}
              {totPages>5&&<>
                <span style={{fontSize:13,color:'#9E9E9E',padding:'0 4px'}}>...</span>
                <button onClick={()=>setPage(totPages)}
                  style={{width:30,height:30,borderRadius:8,border:'1.5px solid #E8E0D4',background:WHITE,color:'#666',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:FONT}}>
                  {totPages}
                </button>
              </>}
              <button onClick={()=>setPage(p=>p+1)} disabled={page>=totPages}
                style={{padding:'6px 10px',borderRadius:8,border:'1.5px solid #E8E0D4',background:WHITE,cursor:page>=totPages?'not-allowed':'pointer',opacity:page>=totPages?0.4:1}}>
                <ChevronRight size={13}/>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom stat cards */}
      <div className="pu-bot-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
        {[
          {Icon:FileText, label:'Total Transaksi',  val:totalTrx.toLocaleString('id-ID')},
          {Icon:BarChart2,label:'Tingkat Tabungan', val:`${tabungan}%`},
          {Icon:Clock,    label:'Rata-rata Harian', val:fmtShort(avgHarian)},
        ].map(({Icon:Ic,label,val})=>(
          <div key={label} style={{background:WHITE,borderRadius:18,padding:'20px 22px',display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:14,background:CREAM,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Ic size={20} color={GREEN_DARK}/>
            </div>
            <div>
              <p style={{fontSize:11,color:'#9E9E9E',fontWeight:600,textTransform:'uppercase',letterSpacing:.6,marginBottom:4}}>{label}</p>
              {loading
                ? <div style={{height:24,background:CREAM,borderRadius:6,width:60}}/>
                : <p style={{fontSize:22,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif'}}>{val}</p>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CATAT PAGE
═══════════════════════════════════════════════════════════ */
function CatatPage({ data, onDetail, onEdit, onDelete, onSaved }) {
  const [formTipe,   setFormTipe]  = useState('expense')
  const [formNominal,setFormNom]   = useState('')
  const [formKat,    setFormKat]   = useState('')
  const [modal,      setModal]     = useState(false)
  const [editData,   setEditData]  = useState(null)
  const [delId,      setDelId]     = useState(null)
  const [deleting,   setDeleting]  = useState(false)
  const [page,       setPage]      = useState(1)
  const LIMIT = 5

  const saldo   = data.reduce((s,t)=>s+(t.tipe==='income'?t.nominal:-t.nominal),0)
  const lastTwo = [...data].sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal)).slice(0,3)
  const sorted  = [...data].sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal))
  const totPages= Math.max(1,Math.ceil(sorted.length/LIMIT))
  const pageData= sorted.slice((page-1)*LIMIT,page*LIMIT)

  const openAdd = () => {
    setEditData(formNominal ? {tipe:formTipe,nominal:formNominal,kategori:formKat} : null)
    setModal(true)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    await onDelete(delId)
    setDeleting(false)
    setDelId(null)
  }

  return (
    <>
      <div className="pu-layout pu-page-pad"
        style={{display:'grid',gridTemplateColumns:'1fr 310px',gap:24,maxWidth:1080,margin:'0 auto',padding:'0 32px 60px'}}>

        <div>
          <h1 style={{fontSize:34,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif',marginBottom:4}}>Catat Transaksi</h1>
          <p style={{color:'#9E9E9E',fontSize:14,marginBottom:22}}>Kelola arus kas Anda dengan presisi kuratorial.</p>

          <div style={{background:WHITE,borderRadius:22,padding:'26px 28px',marginBottom:20}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,background:CREAM,borderRadius:14,padding:4,marginBottom:22}}>
              {['expense','income'].map(t=>(
                <button key={t} onClick={()=>setFormTipe(t)}
                  style={{padding:'12px',borderRadius:11,border:'none',cursor:'pointer',fontFamily:FONT,fontSize:14,fontWeight:700,
                    background:formTipe===t?(t==='expense'?ORANGE:GREEN_DARK):'transparent',
                    color:formTipe===t?WHITE:'#9E9E9E',
                    boxShadow:formTipe===t?'0 3px 12px rgba(0,0,0,0.15)':'none',
                    transition:'all .2s'}}>
                  {t==='expense'?'Pengeluaran':'Pemasukan'}
                </button>
              ))}
            </div>

            <div style={{marginBottom:22}}>
              <p style={{fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Nominal Transaksi</p>
              <div style={{display:'flex',alignItems:'baseline',gap:6}}>
                <span style={{fontSize:36,fontWeight:800,color:formTipe==='expense'?ORANGE:GREEN_DARK}}>Rp</span>
                <input type="number" value={formNominal} onChange={e=>setFormNom(e.target.value)}
                  placeholder="0" min="1"
                  style={{fontSize:44,fontWeight:800,color:GREEN_DARK,border:'none',outline:'none',
                    background:'transparent',fontFamily:FONT,width:'100%',minWidth:0}}/>
              </div>
            </div>

            <div style={{marginBottom:22}}>
              <p style={{fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',letterSpacing:1,marginBottom:12}}>Pilih Kategori</p>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {CATEGORIES.map(({id,label,Icon:Ico,color})=>{
                  const active = formKat===id
                  return (
                    <button key={id} onClick={()=>setFormKat(active?'':id)} className="pu-cat-btn"
                      style={{display:'flex',flexDirection:'column',alignItems:'center',gap:7,
                        padding:'12px 16px',borderRadius:16,
                        border:`2px solid ${active?color:'#E8E0D4'}`,
                        background:active?color+'18':WHITE,
                        cursor:'pointer',minWidth:74,fontFamily:FONT}}>
                      <div style={{width:32,height:32,borderRadius:10,background:color+'20',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <Ico size={17} color={color}/>
                      </div>
                      <span style={{fontSize:9,fontWeight:700,color:active?color:'#BDBDBD',textTransform:'uppercase',letterSpacing:.5}}>{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pu-form-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16}}>
              <div>
                <p style={{fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Tanggal</p>
                <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',background:WHITE,border:'1.5px solid #E8E0D4',borderRadius:12}}>
                  <span style={{fontSize:16}}>📅</span>
                  <span style={{fontSize:13,color:GREEN_DARK,fontWeight:500}}>{todayDisplay()}</span>
                </div>
              </div>
              <div>
                <p style={{fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Toko / Merchant</p>
                <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',background:WHITE,border:'1.5px solid #E8E0D4',borderRadius:12}}>
                  <span style={{fontSize:16}}>🏪</span>
                  <span style={{fontSize:13,color:'#BDBDBD'}}>Nama toko atau merchant</span>
                </div>
              </div>
            </div>

            <div style={{marginBottom:24}}>
              <p style={{fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Catatan</p>
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',background:WHITE,border:'1.5px solid #E8E0D4',borderRadius:12}}>
                <span style={{fontSize:16}}>✏️</span>
                <span style={{fontSize:13,color:'#BDBDBD'}}>Beli apa hari ini? (Opsional)</span>
              </div>
            </div>

            <button className="pu-btn-save" onClick={openAdd}>
              <span>Simpan Transaksi</span>
              <span style={{fontSize:20}}>→</span>
            </button>
          </div>

          {sorted.length>0&&(
            <div style={{background:WHITE,borderRadius:22,overflow:'hidden'}}>
              <div style={{padding:'18px 24px 14px',borderBottom:`1px solid ${CREAM2}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h3 style={{fontSize:15,fontWeight:700,color:GREEN_DARK}}>Riwayat Transaksi</h3>
                <div style={{display:'flex',gap:8}}>
                  <ExportButtons/>
                </div>
              </div>

              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:'#FAF8F4'}}>
                      {['Tanggal','Deskripsi','Kategori','Nominal','Aksi'].map((h,i)=>(
                        <th key={h} style={{padding:'11px 20px',textAlign:i>=3?'center':'left',
                          fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',
                          letterSpacing:.5,whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map(t=>{
                      const cat = getCat(t.kategori)
                      return (
                        <tr key={t.id} className="pu-tr-row" onClick={()=>onDetail(t)}>
                          <td style={{padding:'13px 20px',fontSize:12,color:'#9E9E9E',whiteSpace:'nowrap'}}>{fmtDate(t.tanggal)}</td>
                          <td style={{padding:'13px 20px',maxWidth:160}}>
                            <p style={{fontSize:13,fontWeight:600,color:GREEN_DARK,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:2}}>{t.deskripsi}</p>
                            {t.merchant&&<p style={{fontSize:11,color:'#BDBDBD',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.merchant}</p>}
                          </td>
                          <td style={{padding:'13px 20px'}}>
                            {cat
                              ? <span style={{background:cat.color+'1A',color:cat.color,padding:'3px 11px',borderRadius:50,fontSize:11,fontWeight:700,textTransform:'uppercase',whiteSpace:'nowrap'}}>{cat.label}</span>
                              : <span style={{color:'#BDBDBD',fontSize:12}}>—</span>}
                          </td>
                          <td style={{padding:'13px 20px',textAlign:'center',fontSize:13,fontWeight:700,whiteSpace:'nowrap',
                            color:t.tipe==='income'?'#43A047':'#E53935'}}>
                            {t.tipe==='income'?'+':'-'}{fmtShort(t.nominal)}
                          </td>
                          <td style={{padding:'13px 20px',textAlign:'center'}}>
                            <div style={{display:'flex',justifyContent:'center',gap:2}} onClick={e=>e.stopPropagation()}>
                              <button className="pu-icon-btn" onClick={()=>{setEditData(t);setModal(true)}}
                                style={{padding:'6px 8px',border:'none',background:'none',cursor:'pointer',color:'#BDBDBD',borderRadius:8}}>
                                <Edit2 size={14}/>
                              </button>
                              <button className="pu-icon-btn pu-icon-btn-del" onClick={()=>setDelId(t.id)}
                                style={{padding:'6px 8px',border:'none',background:'none',cursor:'pointer',color:'#BDBDBD',borderRadius:8}}>
                                <Trash2 size={14}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {totPages>1&&(
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 22px',borderTop:`1px solid ${CREAM2}`}}>
                  <span style={{fontSize:12,color:'#9E9E9E'}}>
                    {(page-1)*LIMIT+1}–{Math.min(page*LIMIT,sorted.length)} dari {sorted.length}
                  </span>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <button onClick={()=>setPage(p=>p-1)} disabled={page<=1}
                      style={{padding:'6px 10px',borderRadius:8,border:'1.5px solid #E8E0D4',background:WHITE,cursor:page<=1?'not-allowed':'pointer',opacity:page<=1?0.4:1}}>
                      <ChevronLeft size={13}/>
                    </button>
                    <span style={{fontSize:12,color:GREEN_DARK,fontWeight:600,minWidth:50,textAlign:'center'}}>{page}/{totPages}</span>
                    <button onClick={()=>setPage(p=>p+1)} disabled={page>=totPages}
                      style={{padding:'6px 10px',borderRadius:8,border:'1.5px solid #E8E0D4',background:WHITE,cursor:page>=totPages?'not-allowed':'pointer',opacity:page>=totPages?0.4:1}}>
                      <ChevronRight size={13}/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="pu-sidebar" style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:WHITE,borderRadius:20,padding:'22px'}}>
            <p style={{fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Saldo Utama</p>
            <p style={{fontSize:28,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif',marginBottom:14}}>{fmtFull(Math.abs(saldo))}</p>
            <div style={{background:CREAM,borderRadius:12,padding:'12px 14px'}}>
              <p style={{fontSize:12,color:'#9E9E9E',lineHeight:1.7,fontStyle:'italic'}}>
                "Mencatat transaksi secara rutin membantu Anda memahami pola pengeluaran dan mencapai kebebasan finansial lebih cepat."
              </p>
            </div>
          </div>

          <div style={{background:WHITE,borderRadius:20,padding:'20px 22px'}}>
            <p style={{fontSize:13,fontWeight:700,color:GREEN_DARK,marginBottom:14}}>Terakhir Dicatat</p>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              {lastTwo.map(t=>{
                const cat = getCat(t.kategori)
                const CIcon = cat?.Icon||ShoppingCart
                return (
                  <div key={t.id} className="pu-recent-item"
                    onClick={()=>onDetail(t)}
                    style={{display:'flex',alignItems:'center',gap:12,padding:'9px 8px'}}>
                    <div style={{width:38,height:38,borderRadius:11,background:(cat?.color||'#888')+'1A',
                      display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <CIcon size={17} color={cat?.color||'#888'}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:600,color:GREEN_DARK,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:1}}>{t.deskripsi}</p>
                      {t.merchant&&<p style={{fontSize:11,color:'#BDBDBD',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.merchant}</p>}
                    </div>
                    <span style={{fontSize:13,fontWeight:700,color:t.tipe==='income'?'#43A047':'#E53935',whiteSpace:'nowrap',flexShrink:0}}>
                      {t.tipe==='income'?'+':'-'}{fmtShort(t.nominal)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{borderRadius:20,background:`linear-gradient(145deg,${GREEN_MID},${GREEN_DARK})`,
            padding:'22px',position:'relative',overflow:'hidden',minHeight:110}}>
            <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.05)'}}/>
            <p style={{fontSize:12,color:'rgba(255,255,255,0.75)',lineHeight:1.65,position:'relative'}}>
              Tingkatkan keamanan akun Anda dengan verifikasi 2 langkah.
            </p>
          </div>
        </div>
      </div>

      <TransaksiModal open={modal} onClose={()=>{setModal(false);setEditData(null)}} onSaved={onSaved} editData={editData}/>
      <DeleteModal open={!!delId} deleting={deleting} onClose={()=>setDelId(null)} onConfirm={confirmDelete}/>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   RIWAYAT PAGE
═══════════════════════════════════════════════════════════ */
function RiwayatPage({ data, onDetail, onEdit, onDelete }) {
  const [search,     setSearch]    = useState('')
  const [page,       setPage]      = useState(1)
  const [filterTipe, setFilterTipe]= useState('semua')
  const [filterKat,  setFilterKat] = useState('semua')
  const [delId,      setDelId]     = useState(null)
  const [deleting,   setDeleting]  = useState(false)
  const LIMIT = 8

  let filtered = [...data].sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal))
  if (search)               filtered = filtered.filter(t=>(t.deskripsi+' '+(t.merchant||'')).toLowerCase().includes(search.toLowerCase()))
  if (filterTipe!=='semua') filtered = filtered.filter(t=>t.tipe===filterTipe)
  if (filterKat!=='semua')  filtered = filtered.filter(t=>t.kategori===filterKat)

  const totPages = Math.max(1,Math.ceil(filtered.length/LIMIT))
  const pageData = filtered.slice((page-1)*LIMIT,page*LIMIT)

  const confirmDelete = async () => {
    setDeleting(true)
    await onDelete(delId)
    setDeleting(false)
    setDelId(null)
  }

  return (
    <>
      <div className="pu-page-pad" style={{maxWidth:1080,margin:'0 auto',padding:'0 32px 60px'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:22,flexWrap:'wrap',gap:12}}>
          <div>
            <h1 style={{fontSize:34,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif',marginBottom:4}}>Riwayat Transaksi</h1>
            <p style={{color:'#9E9E9E',fontSize:14}}>Semua catatan transaksi Anda tersimpan di sini.</p>
          </div>
          <div style={{display:'flex',gap:8}}>
            <ExportButtons/>
          </div>
        </div>

        {/* Search + Tipe filter */}
        <div style={{background:WHITE,borderRadius:'16px 16px 0 0',padding:'14px 20px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:1,minWidth:200}}>
            <Search size={14} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#BDBDBD',pointerEvents:'none'}}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
              placeholder="Cari transaksi..." type="text"
              style={{width:'100%',padding:'9px 14px 9px 36px',borderRadius:50,border:'1.5px solid #E0DAD0',
                fontSize:13,outline:'none',fontFamily:FONT,color:GREEN_DARK}}/>
          </div>
          {[['semua','Semua'],['income','Pemasukan'],['expense','Pengeluaran']].map(([val,lbl])=>(
            <button key={val} onClick={()=>{setFilterTipe(val);setPage(1)}}
              style={{padding:'8px 18px',borderRadius:50,border:filterTipe===val?'none':'1.5px solid #E0DAD0',
                background:filterTipe===val?GREEN_DARK:WHITE,color:filterTipe===val?WHITE:GREEN_DARK,
                fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:FONT,transition:'all .15s'}}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div style={{background:WHITE,borderTop:'1px solid #F5F0E8',padding:'12px 20px',display:'flex',gap:8,flexWrap:'wrap',marginBottom:4}}>
          <button onClick={()=>{setFilterKat('semua');setPage(1)}}
            style={{padding:'5px 14px',borderRadius:50,border:filterKat==='semua'?'none':'1.5px solid #E0DAD0',
              background:filterKat==='semua'?GREEN_MID:WHITE,color:filterKat==='semua'?WHITE:GREEN_DARK,
              fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:FONT}}>
            Semua Kategori
          </button>
          {CATEGORIES.map(c=>{
            const active = filterKat===c.id
            const CIco = c.Icon
            return (
              <button key={c.id} onClick={()=>{setFilterKat(active?'semua':c.id);setPage(1)}}
                style={{display:'flex',alignItems:'center',gap:5,padding:'5px 14px',borderRadius:50,
                  border:active?'none':'1.5px solid #E0DAD0',
                  background:active?c.color:WHITE,color:active?WHITE:GREEN_DARK,
                  fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:FONT}}>
                <CIco size={12} color={active?WHITE:c.color}/> {c.label}
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div style={{background:WHITE,borderRadius:'0 0 20px 20px',overflow:'hidden',marginBottom:20}}>
          {filtered.length===0 ? (
            <div style={{textAlign:'center',padding:'60px 20px',color:'#BDBDBD'}}>
              <div style={{fontSize:48,marginBottom:12}}>🔍</div>
              <p style={{fontSize:15,fontWeight:600}}>Tidak ada transaksi ditemukan</p>
              <p style={{fontSize:13,marginTop:6}}>Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:'#FAF8F4'}}>
                      {['Tanggal','Deskripsi','Kategori','Nominal','Aksi'].map((h,i)=>(
                        <th key={h} style={{padding:'12px 20px',textAlign:i>=3?'center':'left',
                          fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',
                          letterSpacing:.5,whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map(t=>{
                      const cat = getCat(t.kategori)
                      const CatIcon = cat?.Icon || ShoppingCart
                      return (
                        <tr key={t.id} className="pu-tr-row" onClick={()=>onDetail(t)}>
                          <td style={{padding:'13px 20px',fontSize:12,color:'#9E9E9E',whiteSpace:'nowrap'}}>{fmtDate(t.tanggal)}</td>
                          <td style={{padding:'13px 20px',maxWidth:220}}>
                            <div style={{display:'flex',alignItems:'center',gap:10}}>
                              <div style={{width:32,height:32,borderRadius:10,background:(cat?.color||'#888')+'20',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                <CatIcon size={15} color={cat?.color||'#888'}/>
                              </div>
                              <div>
                                <p style={{fontSize:13,fontWeight:600,color:GREEN_DARK,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:1}}>{t.deskripsi}</p>
                                {t.merchant&&<p style={{fontSize:11,color:'#BDBDBD'}}>{t.merchant}</p>}
                              </div>
                            </div>
                          </td>
                          <td style={{padding:'13px 20px'}}>
                            {cat
                              ? <span style={{background:cat.color+'1A',color:cat.color,padding:'3px 11px',borderRadius:50,fontSize:11,fontWeight:700,textTransform:'uppercase',whiteSpace:'nowrap'}}>{cat.label}</span>
                              : <span style={{color:'#BDBDBD',fontSize:12}}>—</span>}
                          </td>
                          <td style={{padding:'13px 20px',textAlign:'center',fontSize:13,fontWeight:700,whiteSpace:'nowrap',
                            color:t.tipe==='income'?'#43A047':'#E53935'}}>
                            {t.tipe==='income'?'+':'-'}{fmtShort(t.nominal)}
                          </td>
                          <td style={{padding:'13px 20px',textAlign:'center'}}>
                            <div style={{display:'flex',justifyContent:'center',gap:2}} onClick={e=>e.stopPropagation()}>
                              <button className="pu-icon-btn" onClick={()=>onEdit(t)}
                                style={{padding:'6px 8px',border:'none',background:'none',cursor:'pointer',color:'#BDBDBD',borderRadius:8}}>
                                <Edit2 size={14}/>
                              </button>
                              <button className="pu-icon-btn pu-icon-btn-del" onClick={()=>setDelId(t.id)}
                                style={{padding:'6px 8px',border:'none',background:'none',cursor:'pointer',color:'#BDBDBD',borderRadius:8}}>
                                <Trash2 size={14}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {totPages>1&&(
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 22px',borderTop:`1px solid ${CREAM2}`}}>
                  <span style={{fontSize:12,color:'#9E9E9E'}}>
                    Menampilkan {(page-1)*LIMIT+1}–{Math.min(page*LIMIT,filtered.length)} dari {filtered.length}
                  </span>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <button onClick={()=>setPage(p=>p-1)} disabled={page<=1}
                      style={{padding:'6px 10px',borderRadius:8,border:'1.5px solid #E8E0D4',background:WHITE,cursor:page<=1?'not-allowed':'pointer',opacity:page<=1?0.4:1}}>
                      <ChevronLeft size={13}/>
                    </button>
                    {Array.from({length:Math.min(totPages,5)},(_,i)=>i+1).map(n=>(
                      <button key={n} onClick={()=>setPage(n)}
                        style={{width:30,height:30,borderRadius:8,border:page===n?'none':'1.5px solid #E8E0D4',
                          background:page===n?GREEN_DARK:WHITE,color:page===n?WHITE:'#666',
                          fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:FONT}}>
                        {n}
                      </button>
                    ))}
                    {totPages>5&&<>
                      <span style={{fontSize:13,color:'#9E9E9E',padding:'0 4px'}}>...</span>
                      <button onClick={()=>setPage(totPages)}
                        style={{width:30,height:30,borderRadius:8,border:'1.5px solid #E8E0D4',background:WHITE,color:'#666',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:FONT}}>
                        {totPages}
                      </button>
                    </>}
                    <button onClick={()=>setPage(p=>p+1)} disabled={page>=totPages}
                      style={{padding:'6px 10px',borderRadius:8,border:'1.5px solid #E8E0D4',background:WHITE,cursor:page>=totPages?'not-allowed':'pointer',opacity:page>=totPages?0.4:1}}>
                      <ChevronRight size={13}/>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <DeleteModal open={!!delId} deleting={deleting} onClose={()=>setDelId(null)} onConfirm={confirmDelete}/>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP — state dikelola di sini, fetch dari API,
              Dashboard.jsx bisa refresh via prop/event
═══════════════════════════════════════════════════════════ */
export default function PelacakanUang() {
  const [data,      setData]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [tab,       setTab]       = useState('dashboard')
  const [detailTrx, setDetailTrx]= useState(null)
  const [modal,     setModal]     = useState(false)
  const [editData,  setEditData]  = useState(null)
  const [delId,     setDelId]     = useState(null)
  const [deleting,  setDeleting]  = useState(false)
  const [search,    setSearch]    = useState('')

  // ── Fetch semua transaksi dari API ────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await transaksiAPI.getAll({ limit: 100, sortBy: 'tanggal', sortDir: 'DESC' })
      const list = normalizeList(res?.data)
      setData(list)
    } catch (err) {
      console.error('Gagal mengambil transaksi:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Simpan / Edit ─────────────────────────────────────────────────────────
  // Setelah save, fetchAll() dipanggil → Dashboard.jsx juga ikut refresh
  // karena Dashboard.jsx punya fetchDashboard() sendiri yang bisa dipanggil
  // via custom event atau melalui shared context (lihat catatan di bawah).
  const handleSaved = async (saved) => {
    // Optimistic update lokal
    setData(prev => prev.find(t => t.id === saved.id)
      ? prev.map(t => t.id === saved.id ? { ...t, ...saved } : t)
      : [saved, ...prev]
    )
    // Broadcast ke Dashboard.jsx agar ikut refresh
    window.dispatchEvent(new CustomEvent('transaksi:updated'))
    // Refresh dari server untuk konsistensi
    await fetchAll()
  }

  // ── Hapus ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await transaksiAPI.delete(id)
      setData(prev => prev.filter(t => t.id !== id))
      if (detailTrx?.id === id) setDetailTrx(null)
      window.dispatchEvent(new CustomEvent('transaksi:updated'))
    } catch (err) {
      console.error('Gagal menghapus:', err)
      alert('Gagal menghapus transaksi.')
    } finally {
      setDeleting(false)
      setDelId(null)
    }
  }

  const openEdit = (t) => { setEditData(t); setModal(true) }
  const openAdd  = ()  => { setEditData(null); setModal(true) }
  const openDel  = (id)=> setDelId(id)

  if (detailTrx) return (
    <>
      <StyleInject/>
      <DetailView trx={detailTrx}
        onBack={()=>setDetailTrx(null)}
        onEdit={t=>{ setEditData(t); setDetailTrx(null); setModal(true) }}
        onDelete={id=>handleDelete(id)}/>
      <TransaksiModal open={modal} onClose={()=>{setModal(false);setEditData(null)}} onSaved={handleSaved} editData={editData}/>
      <DeleteModal open={!!delId} deleting={deleting} onClose={()=>setDelId(null)} onConfirm={()=>handleDelete(delId)}/>
    </>
  )

  return (
    <>
      <StyleInject/>
      <div className="pu" style={{minHeight:'100vh',background:CREAM,fontFamily:FONT}}>

        {/* TOP BAR */}
        <div className="pu-topbar" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 32px',background:CREAM}}>
          <div style={{position:'relative',flex:1,maxWidth:380}}>
            <Search size={15} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#BDBDBD',pointerEvents:'none'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari transaksi..." type="text"
              style={{width:'100%',padding:'10px 16px 10px 40px',borderRadius:50,border:'1.5px solid #E0DAD0',
                background:WHITE,fontSize:13,outline:'none',fontFamily:FONT,color:GREEN_DARK,boxSizing:'border-box'}}/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:18,marginLeft:20}}>
            <Bell size={20} color={GREEN_DARK} style={{cursor:'pointer'}}/>
            <div style={{width:36,height:36,borderRadius:'50%',background:GREEN_DARK,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
              <User size={17} color={WHITE}/>
            </div>
          </div>
        </div>

        {/* TAB NAV */}
        <div style={{display:'flex',gap:4,padding:'0 32px 16px',background:CREAM}}>
          {[['dashboard','Pelacakan Uang'],['catat','Catat'],['riwayat','Riwayat']].map(([id,label])=>(
            <button key={id} className="tab-btn" onClick={()=>setTab(id)}
              style={{padding:'9px 22px',borderRadius:50,border:'none',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:FONT,
                background:tab===id?WHITE:'transparent',
                color:tab===id?GREEN_DARK:'#9E9E9E',
                boxShadow:tab===id?'0 2px 8px rgba(0,0,0,0.1)':'none'}}>
              {label}
            </button>
          ))}
        </div>

        {/* PAGE CONTENT */}
        {tab==='dashboard' && (
          <DashboardPage
            data={data}
            loading={loading}
            onDetail={setDetailTrx}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={openDel}
          />
        )}
        {tab==='catat' && (
          <CatatPage
            data={data}
            onDetail={setDetailTrx}
            onEdit={openEdit}
            onDelete={handleDelete}
            onSaved={handleSaved}
          />
        )}
        {tab==='riwayat' && (
          <RiwayatPage
            data={data}
            onDetail={setDetailTrx}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <TransaksiModal open={modal} onClose={()=>{setModal(false);setEditData(null)}} onSaved={handleSaved} editData={editData}/>
      <DeleteModal open={!!delId} deleting={deleting} onClose={()=>setDelId(null)} onConfirm={()=>handleDelete(delId)}/>
    </>
  )
}