import React, { useState, useEffect } from 'react'
import {
<<<<<<< HEAD
  Search, Bell, User, ChevronLeft, ChevronRight, Edit2, Trash2,
  ArrowLeft, Share2, Download, X, TrendingUp, TrendingDown,
  CreditCard, Clock, BarChart2, FileText, Plus, RefreshCw
} from 'lucide-react'
import { transaksiAPI } from '../services/api'
import { getErrorMessage } from '../utils/mockData'
=======
  Search, Bell, User, ShoppingCart, Car, ShoppingBag,
  FileText, Tv, ChevronLeft, ChevronRight, Edit2, Trash2,
  ArrowLeft, Share2, Download, X, Check, TrendingUp, TrendingDown,
  CreditCard, Clock, BarChart2, Plus
} from 'lucide-react'
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f

const GREEN_DARK = '#1B3A2D'
const GREEN_MID  = '#2D5040'
const CREAM      = '#ffffff'
const CREAM2     = '#EDE8DF'
const ORANGE     = '#E8692A'
const WHITE      = '#FFFFFF'

<<<<<<< HEAD
const parseNominal = (val) => {
  if (val === null || val === undefined || val === '') return 0
  if (typeof val === 'number' && isFinite(val)) return val
  const str   = String(val).trim()
  const lower = str.toLowerCase()
  const suffixMap = [
    { suffix: 'miliar', mult: 1_000_000_000 },
    { suffix: 'milyar', mult: 1_000_000_000 },
    { suffix: 'juta',   mult: 1_000_000 },
    { suffix: 'jt',     mult: 1_000_000 },
    { suffix: 'ribu',   mult: 1_000 },
    { suffix: 'rb',     mult: 1_000 },
  ]
  for (const { suffix, mult } of suffixMap) {
    if (lower.includes(suffix)) {
      const base = parseFloat(lower.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
      return base * mult
    }
  }
  let clean = str.replace(/[^0-9.,]/g, '')
  const lastComma = clean.lastIndexOf(',')
  const lastDot   = clean.lastIndexOf('.')
  if (lastComma > lastDot) {
    clean = clean.replace(/\./g, '').replace(',', '.')
  } else {
    clean = clean.replace(/,/g, '')
  }
  return parseFloat(clean) || 0
=======
const CATEGORIES = [
  { id:'makanan',   label:'Makanan',   Icon:ShoppingCart, color:'#F59E0B' },
  { id:'transport', label:'Transport', Icon:Car,          color:'#10B981' },
  { id:'belanja',   label:'Belanja',   Icon:ShoppingBag,  color:'#8B5CF6' },
  { id:'tagihan',   label:'Tagihan',   Icon:FileText,     color:'#3B82F6' },
  { id:'hiburan',   label:'Hiburan',   Icon:Tv,           color:'#EF4444' },
  { id:'pemasukan', label:'Pemasukan', Icon:TrendingUp,   color:'#22C55E' },
]

const MOCK = [
  { id:1, tipe:'expense', nominal:350000,  tanggal:'2024-08-19', deskripsi:'Apple Store',       kategori:'belanja',   merchant:'Apple',          metode:'E-wallet DANA', status:'Berhasil', id_transaksi:'TX-8829184855' },
  { id:2, tipe:'income',  nominal:8500000, tanggal:'2024-08-22', deskripsi:'Deposit Gaji',      kategori:'pemasukan', merchant:'PT Arvesta',     metode:'Transfer Bank', status:'Berhasil', id_transaksi:'TX-1234567890' },
  { id:3, tipe:'expense', nominal:142500,  tanggal:'2024-08-21', deskripsi:'The Green Bistro',  kategori:'makanan',   merchant:'The Green Bistro',metode:'GoPay',        status:'Berhasil', id_transaksi:'TX-8829184855' },
  { id:4, tipe:'expense', nominal:15990,   tanggal:'2024-08-24', deskripsi:'Langganan Netflix', kategori:'hiburan',   merchant:'Netflix',        metode:'E-wallet DANA', status:'Berhasil', id_transaksi:'TX-9988776655', catatan:'Paket Premium 4K.' },
  { id:5, tipe:'expense', nominal:120000,  tanggal:'2024-07-15', deskripsi:'Listrik PLN',       kategori:'tagihan',   merchant:'PLN',            metode:'Transfer Bank', status:'Berhasil', id_transaksi:'TX-5544332211' },
  { id:6, tipe:'expense', nominal:75000,   tanggal:'2024-07-10', deskripsi:'Ojek Online',       kategori:'transport', merchant:'Gojek',          metode:'GoPay',         status:'Berhasil', id_transaksi:'TX-1122334455' },
  { id:7, tipe:'income',  nominal:3900000, tanggal:'2024-07-01', deskripsi:'Freelance Design',  kategori:'pemasukan', merchant:'Klien Swasta',   metode:'Transfer Bank', status:'Berhasil', id_transaksi:'TX-7766554433' },
]

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const fmtShort = (val) => {
  const n = parseFloat(val) || 0
  if (n >= 1_000_000) return `Rp${(n/1_000_000).toFixed(0)}jt`
  if (n >= 1_000)     return `Rp${(n/1_000).toFixed(0)}rb`
  return `Rp${n}`
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
}

const fmtFull = (val) => {
  const n   = parseNominal(val)
  const abs = Math.abs(n).toLocaleString('id-ID')
  return n < 0 ? `-Rp${abs}` : `Rp${abs}`
}
const fmtShort = fmtFull

const fmtDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}
<<<<<<< HEAD
const todayInput   = () => new Date().toISOString().slice(0, 10)
const todayDisplay = () => new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })


function normalizeTransactions(responseData) {
  const d    = responseData
  const list =
    d?.data?.data      ??
    d?.data?.transaksi ??
    d?.data            ??
    d?.transaksi       ??
    d                  ??
    []
  if (!Array.isArray(list)) return []
  return list.map(t => ({
    ...t,
    nominal: parseNominal(t.nominal),
    tipe:    (t.tipe || 'expense').toLowerCase(),
  }))
}

=======
const todayInput = () => new Date().toISOString().slice(0,10)
const todayDisplay = () => new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'})
const getCat = (id) => CATEGORIES.find(c => c.id === id?.toLowerCase())

/* ═══════════════════════════════════════════════════════════
   INJECT STYLES
═══════════════════════════════════════════════════════════ */
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
const CSS = `
.pu * { box-sizing: border-box; }
.pu-input {
  width:100%; padding:11px 14px; border-radius:12px;
  border:1.5px solid #DDD8CF; 
  font-size:13px; outline:none; color:${GREEN_DARK};
  background:${WHITE}; transition:border-color .15s;
}
.pu-input:focus { border-color:${GREEN_DARK}; }
.pu-input::placeholder { color:#BDBDBD; }
.pu-btn-save {
  display:flex; align-items:center; justify-content:space-between;
  width:100%; padding:15px 20px; background:${GREEN_DARK};
  color:#fff; border:none; border-radius:14px; font-size:15px;
  font-weight:700; cursor:pointer; 
  transition:background .15s;
}
.pu-btn-save:hover { background:${GREEN_MID}; }
.pu-btn-save:disabled { background:#ccc; cursor:not-allowed; }
.pu-tr-row { cursor:pointer; transition:background .15s; border-bottom:1px solid #F5F0E8; }
.pu-tr-row:hover { background:#FAF8F4; }
.pu-recent-item { cursor:pointer; transition:background .15s; border-radius:12px; }
.pu-recent-item:hover { background:${CREAM}; }
.pu-icon-btn { transition:color .15s; }
.pu-icon-btn:hover { color:${GREEN_DARK} !important; }
.pu-icon-btn-del:hover { color:#E53935 !important; }
.tab-btn { transition: all .2s; cursor:pointer; }
@media(max-width:900px){
  .pu-layout { grid-template-columns:1fr !important; }
  .pu-sidebar { display:none !important; }
}
@media(max-width:600px){
  .pu-topbar { padding:12px 16px !important; }
  .pu-page-pad { padding:4px 16px 60px !important; }
  .pu-form-grid { grid-template-columns:1fr !important; }
  .pu-detail-hdr { flex-direction:column; align-items:flex-start !important; }
  .pu-detail-btns { flex-wrap:wrap; }
  .pu-stat-grid { grid-template-columns:1fr !important; }
  .pu-bot-grid { grid-template-columns:1fr !important; }
}
`

function StyleInject() {
  useEffect(() => {
    const id = 'pu-css'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id    = id
      el.textContent = CSS
      document.head.appendChild(el)
    } else {
      document.getElementById(id).textContent = CSS
    }
  }, [])
  return null
}

<<<<<<< HEAD
function TipeBadge({ tipe }) {
  const isIncome = tipe === 'income'
  return (
    <span style={{
      background: isIncome ? '#DCFCE7' : '#FEE2E2',
      color:      isIncome ? '#15803D' : '#B91C1C',
      padding: '3px 11px', borderRadius: 50,
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      {isIncome ? 'Pemasukan' : 'Pengeluaran'}
    </span>
  )
}

function DetailView({ trx, onBack, onEdit, onDelete }) {
  const isIncome = trx.tipe === 'income'
  const dateStr  = trx.tanggal ? fmtDate(trx.tanggal) : ''

  return (
    <div className="pu" style={{ minHeight: '100vh', background: CREAM }}>
=======
/* ═══════════════════════════════════════════════════════════
   DETAIL VIEW
═══════════════════════════════════════════════════════════ */
function DetailView({ trx, onBack, onEdit, onDelete }) {
  const cat   = getCat(trx.kategori)
  const CIcon = cat?.Icon || Tv
  const dateStr = trx.tanggal
    ? fmtDate(trx.tanggal) + ' • 06:00 WIB'
    : ''

  return (
    <div className="pu" style={{minHeight:'100vh',background:CREAM,fontFamily:FONT}}>
      {/* Header */}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
      <div className="pu-topbar pu-detail-hdr"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', gap: 12 }}>
        <button onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer',
            color: GREEN_DARK, fontSize: 14, fontWeight: 500, flexShrink: 0 }}>
          <ArrowLeft size={17} /> Detail Transaksi
        </button>
        <div className="pu-detail-btns" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: GREEN_DARK, color: '#fff',
            border: 'none', borderRadius: 50, padding: '8px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <Share2 size={13} /> Bagikan Resi
          </button>
          <button onClick={() => onEdit(trx)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1.5px solid #D0CBC1',
              borderRadius: 50, padding: '8px 18px', cursor: 'pointer', fontSize: 13, color: GREEN_DARK, fontWeight: 500 }}>
            <Edit2 size={13} /> Edit
          </button>
          <button onClick={() => onDelete(trx.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1.5px solid #FFCDD2',
              borderRadius: 50, padding: '8px 18px', cursor: 'pointer', fontSize: 13, color: '#E53935', fontWeight: 500 }}>
            <Trash2 size={13} /> Hapus
          </button>
        </div>
      </div>

<<<<<<< HEAD
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '8px 24px 60px' }}>
        <div style={{ background: WHITE, borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.09)', overflow: 'hidden' }}>
          <div style={{ padding: '40px 32px 28px', textAlign: 'center', borderBottom: '1.5px dashed #E8E0D4' }}>
            <div style={{ width: 72, height: 72, borderRadius: 18,
              background: isIncome ? '#DCFCE7' : '#FEE2E2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              {isIncome
                ? <TrendingUp  size={30} color="#15803D" />
                : <TrendingDown size={30} color="#B91C1C" />}
=======
      <div style={{maxWidth:580,margin:'0 auto',padding:'8px 24px 60px'}}>
        {/* Receipt */}
        <div style={{background:WHITE,borderRadius:24,boxShadow:'0 8px 32px rgba(0,0,0,0.09)',overflow:'hidden'}}>
          {/* Top */}
          <div style={{padding:'40px 32px 28px',textAlign:'center',borderBottom:'1.5px dashed #E8E0D4'}}>
            <div style={{width:72,height:72,borderRadius:18,background:(cat?.color||'#888')+'22',
              display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',
              border:`1.5px solid ${cat?.color||'#888'}30`}}>
              <CIcon size={30} color={cat?.color||'#888'}/>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: GREEN_DARK, marginBottom: 6 }}>{trx.deskripsi}</h2>
            <p style={{ color: '#9E9E9E', fontSize: 13 }}>{dateStr}</p>
          </div>

<<<<<<< HEAD
          <div style={{ padding: '4px 32px 0' }}>
            {[
              { label: 'Tipe',          val: trx.tipe,                         type: 'tipe'   },
              trx.metode ? { label: 'Metode Pembayaran', val: trx.metode,      type: 'metode' } : null,
              { label: 'Status',        val: trx.status || 'Berhasil',         type: 'status' },
              { label: 'ID Transaksi',  val: trx.id || '-',                    type: 'text'   },
            ].filter(Boolean).map(row => (
=======
          {/* Rows */}
          <div style={{padding:'4px 32px 0'}}>
            {[
              {label:'Kategori',          val:trx.kategori,      type:'badge'},
              {label:'Metode Pembayaran', val:trx.metode,        type:'metode'},
              {label:'Status',            val:trx.status,        type:'status'},
              {label:'ID Transaksi',      val:trx.id_transaksi,  type:'text'},
            ].map(row=>(
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
              <div key={row.label}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0', borderBottom: '1px solid #F5F0E8' }}>
                <span style={{ color: '#9E9E9E', fontSize: 14 }}>{row.label}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: GREEN_DARK }}>
                  {row.type === 'tipe'   && <TipeBadge tipe={trx.tipe} />}
                  {row.type === 'metode' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: '#0070BA',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>D</span>
                      </span>
                      {row.val}
                    </span>
                  )}
                  {row.type === 'status' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#43A047', fontWeight: 600 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#43A047', display: 'inline-block' }} />
                      {row.val}
                    </span>
                  )}
                  {row.type === 'text' && row.val}
                </span>
              </div>
            ))}

            {trx.catatan && (
              <div style={{ margin: '16px 0', background: '#FFFBF6', borderRadius: 12, padding: '14px 16px', border: '1px solid #F5DEC8' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#BCA080', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Catatan:</p>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{trx.catatan}</p>
              </div>
            )}

<<<<<<< HEAD
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 28px' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 1 }}>Total</span>
              <span style={{ fontSize: 30, fontWeight: 800, color: isIncome ? '#15803D' : '#B91C1C' }}>
                {isIncome ? '+' : '-'}{fmtFull(trx.nominal)}
              </span>
            </div>
          </div>
        </div>
=======
            {/* Total */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 0 28px'}}>
              <span style={{fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1}}>Total Pembayaran</span>
              <span style={{fontSize:30,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif'}}>{fmtFull(trx.nominal)}</span>
            </div>
          </div>
        </div>

        {/* Bottom cards */}
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
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
      </div>
    </div>
  )
}

function TransaksiModal({ open, onClose, onSaved, editData }) {
  const isEdit = !!editData
  const empty  = { tipe: 'expense', nominal: '', tanggal: todayInput(), deskripsi: '', merchant: '', catatan: '' }
  const [form,   setForm]   = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(editData ? {
<<<<<<< HEAD
      tipe:      editData.tipe     || 'expense',
      nominal:   editData.nominal  || '',
      tanggal:   editData.tanggal?.slice(0, 10) || todayInput(),
      deskripsi: editData.deskripsi || '',
      merchant:  editData.merchant  || '',
      catatan:   editData.catatan   || '',
=======
      tipe:     editData.tipe||'expense',
      nominal:  editData.nominal||'',
      tanggal:  editData.tanggal?.slice(0,10)||todayInput(),
      deskripsi:editData.deskripsi||'',
      kategori: editData.kategori||'',
      merchant: editData.merchant||'',
      catatan:  editData.catatan||'',
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    } : empty)
  }, [open, editData])

  const setField = (k) => (e) => setForm(v => ({ ...v, [k]: e.target.value }))

  const save = async () => {
    if (!form.nominal || !form.tanggal) return
    setSaving(true)
<<<<<<< HEAD
    try {
      const payload = {
        tipe:      form.tipe,
        nominal:   parseNominal(form.nominal),
        tanggal:   form.tanggal,
        deskripsi: form.deskripsi || (form.tipe === 'expense' ? 'Pengeluaran' : 'Pemasukan'),
        merchant:  form.merchant || '',
        catatan:   form.catatan  || '',
        status:    'Berhasil',
      }
      if (editData?.metode) payload.metode = editData.metode

      let response
      if (isEdit) {
        response = await transaksiAPI.update(editData.id, payload)
      } else {
        response = await transaksiAPI.create(payload)
      }

      const raw   = response?.data
      const saved = raw?.data?.data ?? raw?.data?.transaksi ?? raw?.data ?? raw ?? payload
      onSaved(Array.isArray(saved) ? saved[0] : saved)
      window.dispatchEvent(new CustomEvent('transaksi:updated'))
    } catch (err) {
      console.error('[Modal] save error:', err)
      alert(getErrorMessage(err))
    } finally {
      setSaving(false)
      onClose()
    }
=======
    await new Promise(r=>setTimeout(r,280))
    onSaved({
      ...form, nominal:parseFloat(form.nominal),
      id: editData?.id || Date.now(),
      id_transaksi: editData?.id_transaksi||`TX-${Math.floor(Math.random()*9000000000+1000000000)}`,
      metode: editData?.metode||'E-wallet DANA',
      status:'Berhasil',
    })
    setSaving(false)
    onClose()
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  }

  if (!open) return null
  return (
    <div onClick={onClose}
<<<<<<< HEAD
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="pu" onClick={e => e.stopPropagation()}
        style={{ background: WHITE, borderRadius: 24, width: '100%', maxWidth: 460, maxHeight: '90vh',
          overflowY: 'auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 0' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: GREEN_DARK }}>
            {isEdit ? 'Edit Transaksi' : 'Catat Transaksi'}
=======
      style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:200,
        display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div className="pu" onClick={e=>e.stopPropagation()}
        style={{background:WHITE,borderRadius:24,width:'100%',maxWidth:480,maxHeight:'90vh',
          overflowY:'auto',fontFamily:FONT}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'22px 24px 0'}}>
          <h3 style={{fontSize:16,fontWeight:700,color:GREEN_DARK,fontFamily:FONT}}>
            {isEdit?'Edit Transaksi':'Catat Transaksi'}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E9E9E', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

<<<<<<< HEAD
        <div style={{ padding: '16px 24px 24px' }}>
          {/* Tipe toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, background: CREAM, borderRadius: 14, padding: 4, marginBottom: 20 }}>
            {['expense', 'income'].map(t => (
              <button key={t} onClick={() => setForm(v => ({ ...v, tipe: t }))}
                style={{ padding: '11px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                  background: form.tipe === t ? WHITE : 'transparent',
                  color: form.tipe === t ? (t === 'expense' ? ORANGE : '#43A047') : '#9E9E9E',
                  boxShadow: form.tipe === t ? '0 2px 10px rgba(0,0,0,0.12)' : 'none',
                  transition: 'all .2s' }}>
                {t === 'income' ? '💰 Pemasukan' : '💸 Pengeluaran'}
=======
        <div style={{padding:'16px 24px 24px'}}>
          {/* Tipe */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,background:CREAM,borderRadius:14,padding:4,marginBottom:20}}>
            {['expense','income'].map(t=>(
              <button key={t} onClick={()=>setForm(v=>({...v,tipe:t}))}
                style={{padding:'11px',borderRadius:11,border:'none',cursor:'pointer',fontFamily:FONT,fontSize:13,fontWeight:700,
                  background:form.tipe===t?WHITE:'transparent',
                  color:form.tipe===t?(t==='expense'?ORANGE:'#43A047'):'#9E9E9E',
                  boxShadow:form.tipe===t?'0 2px 10px rgba(0,0,0,0.12)':'none',
                  transition:'all .2s'}}>
                {t==='income'?'💰 Pemasukan':'💸 Pengeluaran'}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
              </button>
            ))}
          </div>

          {/* Nominal */}
<<<<<<< HEAD
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Nominal (Rp) <span style={{ color: '#EF4444' }}>*</span>
=======
          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Nominal (Rp)</label>
            <input className="pu-input" type="number" value={form.nominal} onChange={set('nominal')}
              placeholder="0" min="1" style={{fontSize:20,fontWeight:700}}/>
          </div>

          {/* Kategori */}
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

          {/* Date + Merchant */}
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

          {/* Deskripsi */}
          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Deskripsi</label>
            <input className="pu-input" type="text" value={form.deskripsi} onChange={set('deskripsi')} placeholder="Nama transaksi"/>
          </div>

          {/* Catatan */}
          <div style={{marginBottom:22}}>
            <label style={{display:'block',fontSize:11,fontWeight:700,color:'#9E9E9E',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>
              Catatan <span style={{fontWeight:400,textTransform:'none'}}>(Opsional)</span>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            </label>
            <input className="pu-input" type="number" value={form.nominal} onChange={setField('nominal')}
              placeholder="0" min="1" style={{ fontSize: 20, fontWeight: 700 }} />
          </div>

<<<<<<< HEAD
          {/* Tanggal + Merchant */}
          <div className="pu-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                Tanggal <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input className="pu-input" type="date" value={form.tanggal} onChange={setField('tanggal')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Toko / Merchant</label>
              <input className="pu-input" type="text" value={form.merchant} onChange={setField('merchant')} placeholder="Nama toko atau merchant" />
            </div>
          </div>

          {/* Deskripsi */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Deskripsi</label>
            <input className="pu-input" type="text" value={form.deskripsi} onChange={setField('deskripsi')} placeholder="Nama transaksi" />
          </div>

          {/* Catatan */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Catatan <span style={{ fontWeight: 400, textTransform: 'none' }}>(Opsional)</span>
            </label>
            <textarea className="pu-input" value={form.catatan} onChange={setField('catatan')}
              placeholder="Beli apa hari ini?" rows={3} style={{ resize: 'none', lineHeight: 1.6 }} />
          </div>

          <button className="pu-btn-save" onClick={save} disabled={saving || !form.nominal || !form.tanggal}>
            <span>{saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Simpan Transaksi')}</span>
            {!saving && <span style={{ fontSize: 20 }}>→</span>}
=======
          <button className="pu-btn-save" onClick={save} disabled={saving||!form.nominal||!form.tanggal}>
            <span>{saving?'Menyimpan...':isEdit?'Simpan Perubahan':'Simpan Transaksi'}</span>
            {!saving&&<span style={{fontSize:20}}>→</span>}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          </button>
        </div>
      </div>
    </div>
  )
}

<<<<<<< HEAD
function DeleteModal({ open, onClose, onConfirm, loading: delLoading }) {
=======
/* ═══════════════════════════════════════════════════════════
   DELETE CONFIRM
═══════════════════════════════════════════════════════════ */
function DeleteModal({ open, onClose, onConfirm }) {
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  if (!open) return null
  return (
    <div onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="pu" onClick={e => e.stopPropagation()}
        style={{ background: WHITE, borderRadius: 20, padding: '28px 28px 24px', width: '100%', maxWidth: 360 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: '#FFEBEE', display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: 16, fontSize: 24 }}>🗑️</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: GREEN_DARK, marginBottom: 8 }}>Hapus Transaksi?</h3>
        <p style={{ fontSize: 13, color: '#9E9E9E', lineHeight: 1.6, marginBottom: 24 }}>
          Transaksi ini akan dihapus permanen dan tidak bisa dikembalikan.
        </p>
<<<<<<< HEAD
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button onClick={onClose} disabled={delLoading}
            style={{ padding: '12px', borderRadius: 12, border: '1.5px solid #E8E0D4', background: WHITE,
              cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#666' }}>Batal</button>
          <button onClick={onConfirm} disabled={delLoading}
            style={{ padding: '12px', borderRadius: 12, border: 'none', background: '#E53935',
              cursor: 'pointer', fontSize: 14, fontWeight: 700, color: WHITE, opacity: delLoading ? 0.6 : 1 }}>
            {delLoading ? 'Menghapus...' : 'Hapus'}
          </button>
=======
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <button onClick={onClose}
            style={{padding:'12px',borderRadius:12,border:'1.5px solid #E8E0D4',background:WHITE,
              cursor:'pointer',fontFamily:FONT,fontSize:14,fontWeight:600,color:'#666'}}>Batal</button>
          <button onClick={onConfirm}
            style={{padding:'12px',borderRadius:12,border:'none',background:'#E53935',
              cursor:'pointer',fontFamily:FONT,fontSize:14,fontWeight:700,color:WHITE}}>Hapus</button>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
        </div>
      </div>
    </div>
  )
}

<<<<<<< HEAD
function PaginationBar({ page, totPages, total, limit, onPage }) {
  const from = (page - 1) * limit + 1
  const to   = Math.min(page * limit, total)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 22px', borderTop: `1px solid ${CREAM2}` }}>
      <span style={{ fontSize: 12, color: '#9E9E9E' }}>Menampilkan {from}–{to} dari {total} item</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button onClick={() => onPage(p => p - 1)} disabled={page <= 1}
          style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid #E8E0D4', background: WHITE, cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.4 : 1 }}>
          <ChevronLeft size={13} />
        </button>
        {Array.from({ length: Math.min(totPages, 5) }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => onPage(n)}
            style={{ width: 30, height: 30, borderRadius: 8, border: page === n ? 'none' : '1.5px solid #E8E0D4',
              background: page === n ? GREEN_DARK : WHITE, color: page === n ? WHITE : '#666',
              fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {n}
          </button>
        ))}
        {totPages > 5 && <>
          <span style={{ fontSize: 13, color: '#9E9E9E', padding: '0 4px' }}>...</span>
          <button onClick={() => onPage(totPages)}
            style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #E8E0D4', background: WHITE, color: '#666', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {totPages}
          </button>
        </>}
        <button onClick={() => onPage(p => p + 1)} disabled={page >= totPages}
          style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid #E8E0D4', background: WHITE, cursor: page >= totPages ? 'not-allowed' : 'pointer', opacity: page >= totPages ? 0.4 : 1 }}>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}

function TrxTable({ rows, onDetail, onEdit, onDelete }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#FAF8F4' }}>
          {['Tanggal', 'Deskripsi', 'Tipe', 'Nominal', 'Aksi'].map((h, i) => (
            <th key={h} style={{ padding: '12px 20px', textAlign: i >= 3 ? 'center' : 'left',
              fontSize: 11, fontWeight: 700, color: '#BDBDBD', textTransform: 'uppercase', letterSpacing: .5, whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(t => (
          <tr key={t.id} className="pu-tr-row" onClick={() => onDetail(t)}>
            <td style={{ padding: '13px 20px', fontSize: 12, color: '#9E9E9E', whiteSpace: 'nowrap' }}>{fmtDate(t.tanggal)}</td>
            <td style={{ padding: '13px 20px', maxWidth: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: t.tipe === 'income' ? '#DCFCE7' : '#FEE2E2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t.tipe === 'income'
                    ? <TrendingUp  size={15} color="#15803D" />
                    : <TrendingDown size={15} color="#B91C1C" />}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: GREEN_DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 1 }}>{t.deskripsi}</p>
                  {t.merchant && <p style={{ fontSize: 11, color: '#BDBDBD', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.merchant}</p>}
                </div>
              </div>
            </td>
            <td style={{ padding: '13px 20px' }}>
              <TipeBadge tipe={t.tipe} />
            </td>
            <td style={{ padding: '13px 20px', textAlign: 'center', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              color: t.tipe === 'income' ? '#15803D' : '#B91C1C' }}>
              {t.tipe === 'income' ? '+' : '-'}{fmtShort(t.nominal)}
            </td>
            <td style={{ padding: '13px 20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }} onClick={e => e.stopPropagation()}>
                <button className="pu-icon-btn" onClick={() => onEdit(t)}
                  style={{ padding: '6px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#BDBDBD', borderRadius: 8 }}>
                  <Edit2 size={14} />
                </button>
                <button className="pu-icon-btn pu-icon-btn-del" onClick={() => onDelete(t.id)}
                  style={{ padding: '6px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#BDBDBD', borderRadius: 8 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function DashboardPage({ data, loading, onDetail, onAdd, onEdit, onDelete }) {
  const [page, setPage] = useState(1)
  const LIMIT = 5

  if (loading) return (
    <div className="pu-page-pad" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px 60px' }}>
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
        <p style={{ fontSize: 15, fontWeight: 600, color: GREEN_DARK }}>Memuat data dashboard...</p>
      </div>
    </div>
  )

  const saldo       = data.reduce((s, t) => s + (t.tipe === 'income' ? parseNominal(t.nominal) : -parseNominal(t.nominal)), 0)
  const pemasukan   = data.filter(t => t.tipe === 'income').reduce((s, t) => s + parseNominal(t.nominal), 0)
  const pengeluaran = data.filter(t => t.tipe === 'expense').reduce((s, t) => s + parseNominal(t.nominal), 0)
  const totalTrx    = data.length
  const avgHarian   = Math.round(pengeluaran / 30)
  const tabungan    = pemasukan > 0 ? Math.round((1 - pengeluaran / pemasukan) * 100) : 0

  const sorted   = [...data].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
  const totPages = Math.max(1, Math.ceil(sorted.length / LIMIT))
  const pageData = sorted.slice((page - 1) * LIMIT, page * LIMIT)

  return (
    <div className="pu-page-pad" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
=======
/* ═══════════════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════════════ */
function DashboardPage({ data, onDetail, onAdd, onEdit, onDelete }) {
  const [page, setPage] = useState(1)
  const LIMIT = 5

  const saldo      = data.reduce((s,t)=>s+(t.tipe==='income'?t.nominal:-t.nominal),0)
  const pemasukan  = data.filter(t=>t.tipe==='income').reduce((s,t)=>s+t.nominal,0)
  const pengeluaran= data.filter(t=>t.tipe==='expense').reduce((s,t)=>s+t.nominal,0)
  const totalTrx   = data.length
  const avgHarian  = Math.round(pengeluaran / 30)
  const tabungan   = pemasukan > 0 ? Math.round((1 - pengeluaran/pemasukan)*100) : 0

  const sorted   = [...data].sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal))
  const totPages = Math.max(1,Math.ceil(sorted.length/LIMIT))
  const pageData = sorted.slice((page-1)*LIMIT, page*LIMIT)

  return (
    <div className="pu-page-pad" style={{maxWidth:1080,margin:'0 auto',padding:'0 32px 60px'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:22,flexWrap:'wrap',gap:12}}>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: GREEN_DARK, marginBottom: 4 }}>Pelacakan Uang</h1>
          <p style={{ color: '#9E9E9E', fontSize: 14 }}>Analisis dan kelola arus keuangan harian Anda.</p>
        </div>
<<<<<<< HEAD
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: WHITE, color: GREEN_DARK,
            border: '1.5px solid #D0CBC1', borderRadius: 50, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <Download size={14} /> Ekspor
=======
        <div style={{display:'flex',gap:10}}>
          <button style={{display:'flex',alignItems:'center',gap:6,background:WHITE,color:GREEN_DARK,
            border:'1.5px solid #D0CBC1',borderRadius:50,padding:'9px 18px',cursor:'pointer',fontSize:13,fontFamily:FONT,fontWeight:500}}>
            <Download size={14}/> Ekspor
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          </button>
          <button onClick={onAdd}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: GREEN_DARK, color: '#fff',
              border: 'none', borderRadius: 50, padding: '9px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
            <Plus size={14} /> Tambah Transaksi
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Stat cards */}
      <div className="pu-stat-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: GREEN_DARK, borderRadius: 22, padding: '26px 28px', position: 'relative', overflow: 'hidden', minHeight: 130 }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', transform: 'translate(20px,-20px)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={18} color="#fff" />
=======
      {/* Stat Cards */}
      <div className="pu-stat-grid" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',gap:16,marginBottom:24}}>
        {/* Saldo */}
        <div style={{background:GREEN_DARK,borderRadius:22,padding:'26px 28px',position:'relative',overflow:'hidden',minHeight:130}}>
          <div style={{position:'absolute',top:0,right:0,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.05)',transform:'translate(20px,-20px)'}}/>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <CreditCard size={18} color="#fff"/>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Total Saldo</span>
            </div>
<<<<<<< HEAD
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 50 }}>
              {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <p style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{fmtFull(saldo)}</p>
        </div>

        <div style={{ background: '#F0FDF4', borderRadius: 22, padding: '24px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <TrendingUp size={18} color="#15803D" />
=======
            <span style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.6)',background:'rgba(255,255,255,0.1)',padding:'4px 10px',borderRadius:50}}>Maret 2026</span>
          </div>
          <p style={{fontSize:34,fontWeight:800,color:'#fff',fontFamily:'DM Serif Display,Georgia,serif',marginBottom:8}}>{fmtFull(saldo)}</p>
          <span style={{fontSize:12,color:'#4ADE80',fontWeight:600}}>▲ +12.5%</span>
          <span style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginLeft:6}}>vs bulan lalu</span>
        </div>

        {/* Pemasukan */}
        <div style={{background:'#FFF8EC',borderRadius:22,padding:'24px'}}>
          <div style={{width:36,height:36,borderRadius:10,background:'#FDE68A',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
            <TrendingUp size={18} color="#B45309"/>
          </div>
          <p style={{fontSize:11,fontWeight:700,color:'#B45309',textTransform:'uppercase',letterSpacing:.8,marginBottom:6}}>Pemasukan Bulanan</p>
          <p style={{fontSize:24,fontWeight:800,color:'#92400E',fontFamily:'DM Serif Display,Georgia,serif'}}>{fmtFull(pemasukan)}</p>
          <div style={{height:3,background:'#FDE68A',borderRadius:50,marginTop:14}}>
            <div style={{width:'70%',height:'100%',background:'#F59E0B',borderRadius:50}}/>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          </div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: .8, marginBottom: 6 }}>Pemasukan Bulanan</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#14532D' }}>{fmtFull(pemasukan)}</p>
        </div>

<<<<<<< HEAD
        <div style={{ background: '#FFF0F0', borderRadius: 22, padding: '24px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <TrendingDown size={18} color="#991B1B" />
=======
        {/* Pengeluaran */}
        <div style={{background:'#FFF0F0',borderRadius:22,padding:'24px'}}>
          <div style={{width:36,height:36,borderRadius:10,background:'#FCA5A5',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
            <TrendingDown size={18} color="#991B1B"/>
          </div>
          <p style={{fontSize:11,fontWeight:700,color:'#991B1B',textTransform:'uppercase',letterSpacing:.8,marginBottom:6}}>Pengeluaran Bulanan</p>
          <p style={{fontSize:24,fontWeight:800,color:'#7F1D1D',fontFamily:'DM Serif Display,Georgia,serif'}}>{fmtFull(pengeluaran)}</p>
          <div style={{height:3,background:'#FCA5A5',borderRadius:50,marginTop:14}}>
            <div style={{width:'45%',height:'100%',background:'#EF4444',borderRadius:50}}/>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          </div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: .8, marginBottom: 6 }}>Pengeluaran Bulanan</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#7F1D1D' }}>{fmtFull(pengeluaran)}</p>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: WHITE, borderRadius: '16px 16px 0 0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: GREEN_DARK }}>Transaksi Terbaru</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9E9E9E' }}>
          Urutkan: <strong style={{ color: GREEN_DARK, cursor: 'pointer' }}>Tanggal ▼</strong>
        </div>
      </div>

<<<<<<< HEAD
      <div style={{ background: WHITE, borderRadius: '0 0 20px 20px', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ overflowX: 'auto' }}>
          {pageData.length === 0
            ? <div style={{ textAlign: 'center', padding: '48px 20px', color: '#BDBDBD' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Belum ada transaksi</p>
              </div>
            : <TrxTable rows={pageData} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />}
        </div>
        {totPages > 1 && <PaginationBar page={page} totPages={totPages} total={sorted.length} limit={LIMIT} onPage={setPage} />}
=======
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
              {pageData.map(t=>{
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
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totPages>1&&(
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
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
      </div>

      {/* Bottom stats */}
      <div className="pu-bot-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {[
<<<<<<< HEAD
          { Icon: FileText,  label: 'Total Transaksi',  val: totalTrx.toLocaleString('id-ID'), sub: 'transaksi tercatat' },
          { Icon: BarChart2, label: 'Tingkat Tabungan', val: `${tabungan}%`,                   sub: 'dari total pemasukan' },
          { Icon: Clock,     label: 'Rata-rata Harian', val: fmtShort(avgHarian),              sub: 'pengeluaran per hari' },
        ].map(({ Icon: Ic, label, val, sub }) => (
          <div key={label} style={{
            background: WHITE, borderRadius: 20, padding: '22px 24px',
            display: 'flex', flexDirection: 'column', gap: 14,
            border: '1px solid #EDE8DF',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: CREAM2,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ic size={20} color={GREEN_DARK} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#9E9E9E',
                textTransform: 'uppercase', letterSpacing: 0.6 }}>
                {label}
              </span>
            </div>
            <div>
              <p style={{ fontSize: 26, fontWeight: 800, color: GREEN_DARK, lineHeight: 1, marginBottom: 6 }}>{val}</p>
              <p style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 500 }}>{sub}</p>
=======
          {Icon:FileText, label:'Total Transaksi',  val:totalTrx.toLocaleString('id-ID'), sub:'transaksi tercatat'},
          {Icon:BarChart2,label:'Tingkat Tabungan', val:`${tabungan}%`,                  sub:'dari pemasukan'},
          {Icon:Clock,    label:'Rata-rata Harian', val:fmtShort(avgHarian),             sub:'per hari'},
        ].map(({Icon:Ic,label,val})=>(
          <div key={label} style={{background:WHITE,borderRadius:18,padding:'20px 22px',display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:14,background:CREAM,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Ic size={20} color={GREEN_DARK}/>
            </div>
            <div>
              <p style={{fontSize:11,color:'#9E9E9E',fontWeight:600,textTransform:'uppercase',letterSpacing:.6,marginBottom:4}}>{label}</p>
              <p style={{fontSize:22,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif'}}>{val}</p>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

<<<<<<< HEAD
function CatatPage({ data, loading, onDetail, onEdit, onDelete, onSaved }) {
  const [modal,      setModal]      = useState(false)
  const [editData,   setEditData]   = useState(null)
  const [delId,      setDelId]      = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [page,       setPage]       = useState(1)
  const LIMIT = 5

  if (loading) return (
    <div className="pu-page-pad" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px 60px' }}>
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
        <p style={{ fontSize: 15, fontWeight: 600, color: GREEN_DARK }}>Memuat data transaksi...</p>
      </div>
    </div>
  )

  const saldo     = data.reduce((s, t) => s + (t.tipe === 'income' ? parseNominal(t.nominal) : -parseNominal(t.nominal)), 0)
  const lastThree = [...data].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 3)
  const sorted    = [...data].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
  const totPages  = Math.max(1, Math.ceil(sorted.length / LIMIT))
  const pageData  = sorted.slice((page - 1) * LIMIT, page * LIMIT)

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await transaksiAPI.delete(delId)
      onDelete(delId)
      window.dispatchEvent(new CustomEvent('transaksi:updated'))
    } catch (err) {
      console.error('[Catat] delete error:', err)
      alert(getErrorMessage(err))
    } finally {
      setDelLoading(false)
      setDelId(null)
    }
  }

  return (
    <>
      <div className="pu-layout pu-page-pad"
        style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 24, maxWidth: 1080, margin: '0 auto', padding: '0 32px 60px' }}>
=======
/* ═══════════════════════════════════════════════════════════
   CATAT PAGE (original form layout)
═══════════════════════════════════════════════════════════ */
function CatatPage({ data, onDetail, onEdit, onDelete, onSaved }) {
  const [formTipe,   setFormTipe]  = useState('expense')
  const [formNominal,setFormNom]   = useState('')
  const [formKat,    setFormKat]   = useState('')
  const [modal,      setModal]     = useState(false)
  const [editData,   setEditData]  = useState(null)
  const [delId,      setDelId]     = useState(null)
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

  return (
    <>
      <div className="pu-layout pu-page-pad"
        style={{display:'grid',gridTemplateColumns:'1fr 310px',gap:24,maxWidth:1080,margin:'0 auto',padding:'0 32px 60px'}}>

        {/* LEFT */}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
        <div>
          <p style={{ color: '#9E9E9E', fontSize: 14, marginBottom: 22 }}>Kelola arus kas Anda dengan mudah.</p>

<<<<<<< HEAD
          {/* Quick-add card */}
          <div style={{ background: WHITE, borderRadius: 22, padding: '26px 28px', marginBottom: 20 }}>
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#BDBDBD', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Nominal Transaksi</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: ORANGE }}>Rp</span>
                <input type="number" placeholder="0" min="1" readOnly onClick={() => { setEditData(null); setModal(true) }}
                  style={{ fontSize: 44, fontWeight: 800, color: GREEN_DARK, border: 'none', outline: 'none',
                    background: 'transparent', width: '100%', minWidth: 0, cursor: 'pointer' }} />
              </div>
            </div>

            <div className="pu-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
=======
          {/* Form Card */}
          <div style={{background:WHITE,borderRadius:22,padding:'26px 28px',marginBottom:20}}>
            {/* Toggle */}
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

            {/* Nominal display */}
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

            {/* Categories */}
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

            {/* Date + Merchant */}
            <div className="pu-form-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16}}>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#BDBDBD', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Tanggal</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: WHITE, border: '1.5px solid #E8E0D4', borderRadius: 12 }}>
                  <span style={{ fontSize: 16 }}>📅</span>
                  <span style={{ fontSize: 13, color: GREEN_DARK, fontWeight: 500 }}>{todayDisplay()}</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#BDBDBD', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Toko / Merchant</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: WHITE, border: '1.5px solid #E8E0D4', borderRadius: 12 }}>
                  <span style={{ fontSize: 16 }}>🏪</span>
                  <span style={{ fontSize: 13, color: '#BDBDBD' }}>Nama toko atau merchant</span>
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <button className="pu-btn-save" onClick={() => { setEditData(null); setModal(true) }}>
=======
            {/* Catatan */}
            <div style={{marginBottom:24}}>
              <p style={{fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Catatan</p>
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',background:WHITE,border:'1.5px solid #E8E0D4',borderRadius:12}}>
                <span style={{fontSize:16}}>✏️</span>
                <span style={{fontSize:13,color:'#BDBDBD'}}>Beli apa hari ini? (Opsional)</span>
              </div>
            </div>

            <button className="pu-btn-save" onClick={openAdd}>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
              <span>Simpan Transaksi</span>
              <span style={{ fontSize: 20 }}>→</span>
            </button>
          </div>

<<<<<<< HEAD
          {/* History table */}
          {sorted.length > 0 && (
            <div style={{ background: WHITE, borderRadius: 22, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px 14px', borderBottom: `1px solid ${CREAM2}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: GREEN_DARK }}>Riwayat Transaksi</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Excel', 'PDF'].map(f => (
                    <button key={f}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8,
                        border: '1.5px solid #E8E0D4', background: WHITE, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: GREEN_DARK }}>
                      <Download size={12} /> {f}
=======
          {/* Transaction list */}
          {sorted.length>0&&(
            <div style={{background:WHITE,borderRadius:22,overflow:'hidden'}}>
              <div style={{padding:'18px 24px 14px',borderBottom:`1px solid ${CREAM2}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h3 style={{fontSize:15,fontWeight:700,color:GREEN_DARK}}>Riwayat Transaksi</h3>
                <div style={{display:'flex',gap:8}}>
                  {['Excel','PDF'].map(f=>(
                    <button key={f}
                      style={{display:'flex',alignItems:'center',gap:5,padding:'6px 12px',borderRadius:8,
                        border:'1.5px solid #E8E0D4',background:WHITE,cursor:'pointer',
                        fontFamily:FONT,fontSize:12,fontWeight:600,color:GREEN_DARK}}>
                      <Download size={12}/> {f}
                    </button>
                  ))}
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
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <TrxTable rows={pageData} onDetail={onDetail}
                  onEdit={t => { setEditData(t); setModal(true) }}
                  onDelete={id => setDelId(id)} />
              </div>
              {totPages > 1 && <PaginationBar page={page} totPages={totPages} total={sorted.length} limit={LIMIT} onPage={setPage} />}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="pu-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: WHITE, borderRadius: 20, padding: '22px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#BDBDBD', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Saldo Utama</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: saldo < 0 ? '#B91C1C' : GREEN_DARK, marginBottom: 14 }}>{fmtFull(saldo)}</p>
            <div style={{ background: CREAM, borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ fontSize: 12, color: '#9E9E9E', lineHeight: 1.7, fontStyle: 'italic' }}>
                "Mencatat transaksi secara rutin membantu Anda memahami pola pengeluaran."
              </p>
            </div>
          </div>

<<<<<<< HEAD
          <div style={{ background: WHITE, borderRadius: 20, padding: '20px 22px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: GREEN_DARK, marginBottom: 14 }}>Terakhir Dicatat</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {lastThree.map(t => (
                <div key={t.id} className="pu-recent-item" onClick={() => onDetail(t)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 8px' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                    background: t.tipe === 'income' ? '#DCFCE7' : '#FEE2E2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t.tipe === 'income'
                      ? <TrendingUp  size={17} color="#15803D" />
                      : <TrendingDown size={17} color="#B91C1C" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: GREEN_DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 1 }}>{t.deskripsi}</p>
                    {t.merchant && <p style={{ fontSize: 11, color: '#BDBDBD', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.merchant}</p>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.tipe === 'income' ? '#15803D' : '#B91C1C', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {t.tipe === 'income' ? '+' : '-'}{fmtShort(t.nominal)}
                  </span>
                </div>
              ))}
=======
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
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            </div>
          </div>

          <div style={{ borderRadius: 20, background: `linear-gradient(145deg,${GREEN_MID},${GREEN_DARK})`,
            padding: '22px', position: 'relative', overflow: 'hidden', minHeight: 110 }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, position: 'relative' }}>
              Tingkatkan keamanan akun Anda dengan verifikasi 2 langkah.
            </p>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <TransaksiModal open={modal} onClose={() => { setModal(false); setEditData(null) }}
        onSaved={saved => { onSaved(saved); setModal(false); setEditData(null) }}
        editData={editData} />
      <DeleteModal open={!!delId} loading={delLoading} onClose={() => setDelId(null)} onConfirm={handleDelete} />
=======
      <TransaksiModal open={modal} onClose={()=>{setModal(false);setEditData(null)}} onSaved={onSaved} editData={editData}/>
      <DeleteModal open={!!delId} onClose={()=>setDelId(null)} onConfirm={()=>{onDelete(delId);setDelId(null)}}/>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    </>
  )
}

<<<<<<< HEAD
function RiwayatPage({ data, loading, onDetail, onEdit, onDelete }) {
  const [search,     setSearch]     = useState('')
  const [page,       setPage]       = useState(1)
  const [filterTipe, setFilterTipe] = useState('semua')
  const LIMIT = 8

  if (loading) return (
    <div className="pu-page-pad" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px 60px' }}>
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📜</div>
        <p style={{ fontSize: 15, fontWeight: 600, color: GREEN_DARK }}>Memuat riwayat transaksi...</p>
      </div>
    </div>
  )
=======
/* ═══════════════════════════════════════════════════════════
   RIWAYAT PAGE
═══════════════════════════════════════════════════════════ */
function RiwayatPage({ data, onDetail, onEdit, onDelete }) {
  const [search,     setSearch]    = useState('')
  const [page,       setPage]      = useState(1)
  const [filterTipe, setFilterTipe]= useState('semua')
  const [filterKat,  setFilterKat] = useState('semua')
  const LIMIT = 8

  let filtered = [...data].sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal))
  if (search)           filtered = filtered.filter(t=>(t.deskripsi+' '+(t.merchant||'')).toLowerCase().includes(search.toLowerCase()))
  if (filterTipe!=='semua') filtered = filtered.filter(t=>t.tipe===filterTipe)
  if (filterKat!=='semua')  filtered = filtered.filter(t=>t.kategori===filterKat)
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f

  let filtered = [...data].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
  if (search)               filtered = filtered.filter(t => (t.deskripsi + ' ' + (t.merchant || '')).toLowerCase().includes(search.toLowerCase()))
  if (filterTipe !== 'semua') filtered = filtered.filter(t => t.tipe === filterTipe)

<<<<<<< HEAD
  const totPages = Math.max(1, Math.ceil(filtered.length / LIMIT))
  const pageData = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  return (
    <div className="pu-page-pad" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px 60px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: GREEN_DARK, marginBottom: 4 }}>Riwayat Transaksi</h1>
      <p style={{ color: '#9E9E9E', fontSize: 14, marginBottom: 22 }}>Semua catatan transaksi Anda tersimpan di sini.</p>

      {/* Filter bar */}
      <div style={{ background: WHITE, borderRadius: '16px 16px 0 0', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#BDBDBD', pointerEvents: 'none' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari transaksi..." type="text"
            style={{ width: '100%', padding: '9px 14px 9px 36px', borderRadius: 50, border: '1.5px solid #E0DAD0',
              fontSize: 13, outline: 'none', color: GREEN_DARK }} />
        </div>
        {[['semua', 'Semua'], ['income', 'Pemasukan'], ['expense', 'Pengeluaran']].map(([val, lbl]) => (
          <button key={val} onClick={() => { setFilterTipe(val); setPage(1) }}
            style={{ padding: '8px 18px', borderRadius: 50, border: filterTipe === val ? 'none' : '1.5px solid #E0DAD0',
              background: filterTipe === val ? GREEN_DARK : WHITE, color: filterTipe === val ? WHITE : GREEN_DARK,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>
=======
  return (
    <div className="pu-page-pad" style={{maxWidth:1080,margin:'0 auto',padding:'0 32px 60px'}}>
      <h1 style={{fontSize:34,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif',marginBottom:4}}>Riwayat Transaksi</h1>
      <p style={{color:'#9E9E9E',fontSize:14,marginBottom:22}}>Semua catatan transaksi Anda tersimpan di sini.</p>

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
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            {lbl}
          </button>
        ))}
      </div>

<<<<<<< HEAD
      <div style={{ background: WHITE, borderRadius: '0 0 20px 20px', overflow: 'hidden', marginBottom: 20 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#BDBDBD' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Tidak ada transaksi ditemukan</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <TrxTable rows={pageData} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
            </div>
            {totPages > 1 && <PaginationBar page={page} totPages={totPages} total={filtered.length} limit={LIMIT} onPage={setPage} />}
=======
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
                            <button className="pu-icon-btn pu-icon-btn-del" onClick={()=>onDelete(t.id)}
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
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          </>
        )}
      </div>
    </div>
  )
}

<<<<<<< HEAD
export default function PelacakanUang() {
  const [data,       setData]       = useState([])
  const [loading,    setLoading]    = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error,      setError]      = useState(null)
  const [tab,        setTab]        = useState('dashboard')
  const [detailTrx,  setDetailTrx]  = useState(null)
  const [modal,      setModal]      = useState(false)
  const [editData,   setEditData]   = useState(null)
  const [delId,      setDelId]      = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [search,     setSearch]     = useState('')

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const response = await transaksiAPI.getAll({ limit: 100, sortBy: 'tanggal', sortDir: 'DESC' })
      setData(normalizeTransactions(response.data))
    } catch (err) {
      console.error('[PelacakanUang] fetch error:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const handler = () => fetchData(true)
    window.addEventListener('transaksi:updated', handler)
    return () => window.removeEventListener('transaksi:updated', handler)
  }, [fetchData])

  const handleSaved = useCallback((saved) => {
    if (!saved || !saved.id) { fetchData(true); return }
    const clean = {
      ...saved,
      nominal: parseNominal(saved.nominal),
      tipe:    (saved.tipe || 'expense').toLowerCase(),
    }
    setData(prev => {
      const exists = prev.find(t => t.id === clean.id)
      return exists
        ? prev.map(t => t.id === clean.id ? { ...t, ...clean } : t)
        : [clean, ...prev]
    })
  }, [fetchData])

  const handleDelete = useCallback((id) => {
    setData(prev => prev.filter(t => t.id !== id))
    if (detailTrx?.id === id) setDetailTrx(null)
  }, [detailTrx])

  const openEdit = (t)  => { setEditData(t);   setModal(true) }
  const openAdd  = ()   => { setEditData(null); setModal(true) }
  const openDel  = (id) => setDelId(id)

  const confirmDelete = async () => {
    setDelLoading(true)
    try {
      await transaksiAPI.delete(delId)
      handleDelete(delId)
      window.dispatchEvent(new CustomEvent('transaksi:updated'))
    } catch (err) {
      console.error('[PelacakanUang] delete error:', err)
      alert(getErrorMessage(err))
    } finally {
      setDelLoading(false)
      setDelId(null)
    }
=======
/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function PelacakanUang() {
  const [data,      setData]     = useState(MOCK)
  const [tab,       setTab]      = useState('dashboard')  // 'dashboard' | 'catat' | 'riwayat'
  const [detailTrx, setDetailTrx]= useState(null)
  const [modal,     setModal]    = useState(false)
  const [editData,  setEditData] = useState(null)
  const [delId,     setDelId]    = useState(null)
  const [search,    setSearch]   = useState('')

  const handleSaved = (saved) => {
    setData(prev=>prev.find(t=>t.id===saved.id)
      ? prev.map(t=>t.id===saved.id?saved:t)
      : [saved,...prev])
  }
  const handleDelete = (id) => {
    setData(prev=>prev.filter(t=>t.id!==id))
    setDelId(null)
    if (detailTrx?.id===id) setDetailTrx(null)
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  }
  const openEdit = (t) => { setEditData(t); setModal(true) }
  const openAdd  = ()  => { setEditData(null); setModal(true) }
  const openDel  = (id)=> setDelId(id)

<<<<<<< HEAD
  if (error && data.length === 0) return (
    <>
      <StyleInject />
      <div className="pu" style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: GREEN_DARK, marginBottom: 8 }}>Gagal Memuat Data</h2>
          <p style={{ color: '#9E9E9E', marginBottom: 16 }}>{error}</p>
          <button onClick={() => fetchData()}
            style={{ padding: '10px 24px', background: GREEN_DARK, color: '#fff', border: 'none', borderRadius: 50, cursor: 'pointer', fontWeight: 700 }}>
            Coba Lagi
          </button>
        </div>
      </div>
    </>
  )

  if (detailTrx) return (
    <>
      <StyleInject />
      <DetailView trx={detailTrx} onBack={() => setDetailTrx(null)}
        onEdit={t => { setDetailTrx(null); openEdit(t) }} onDelete={openDel} />
      <TransaksiModal open={modal} onClose={() => { setModal(false); setEditData(null) }}
        onSaved={saved => { handleSaved(saved); setDetailTrx(null) }} editData={editData} />
      <DeleteModal open={!!delId} loading={delLoading} onClose={() => setDelId(null)} onConfirm={confirmDelete} />
=======
  // Detail view takes over entire screen
  if (detailTrx) return (
    <>
      <StyleInject/>
      <DetailView trx={detailTrx}
        onBack={()=>setDetailTrx(null)}
        onEdit={t=>{setEditData(t);setDetailTrx(null);setModal(true)}}
        onDelete={id=>{handleDelete(id)}}/>
      <TransaksiModal open={modal} onClose={()=>{setModal(false);setEditData(null)}} onSaved={handleSaved} editData={editData}/>
      <DeleteModal open={!!delId} onClose={()=>setDelId(null)} onConfirm={()=>handleDelete(delId)}/>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    </>
  )

  return (
    <>
<<<<<<< HEAD
      <StyleInject />
      <div className="pu" style={{ minHeight: '100vh', background: CREAM }}>

        {/* Top bar */}
        <div className="pu-topbar"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', background: CREAM }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
            <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#BDBDBD', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari transaksi..." type="text"
              style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: 50, border: '1.5px solid #E0DAD0',
                background: WHITE, fontSize: 13, outline: 'none', color: GREEN_DARK, boxSizing: 'border-box' }} />
=======
      <StyleInject/>
      <div className="pu" style={{minHeight:'100vh',background:CREAM,fontFamily:FONT}}>

        {/* TOP BAR */}
        <div className="pu-topbar" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 32px',background:CREAM}}>
          <div style={{position:'relative',flex:1,maxWidth:380}}>
            <Search size={15} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#BDBDBD',pointerEvents:'none'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari transaksi..." type="text"
              style={{width:'100%',padding:'10px 16px 10px 40px',borderRadius:50,border:'1.5px solid #E0DAD0',
                background:WHITE,fontSize:13,outline:'none',fontFamily:FONT,color:GREEN_DARK,boxSizing:'border-box'}}/>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 20 }}>
            <button onClick={() => fetchData(true)} disabled={refreshing} title="Refresh data"
              style={{ background: 'none', border: 'none', cursor: refreshing ? 'not-allowed' : 'pointer', color: GREEN_DARK, padding: 4, display: 'flex', alignItems: 'center' }}>
              <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : undefined }} />
            </button>
            <Bell size={20} color={GREEN_DARK} style={{ cursor: 'pointer' }} />
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: GREEN_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <User size={17} color={WHITE} />
            </div>
          </div>
        </div>

        {error && (
          <div style={{ margin: '0 32px 8px', display: 'flex', alignItems: 'center', gap: 10, background: '#FFF3CD',
            border: '1px solid #FFD700', borderRadius: 12, padding: '10px 16px', fontSize: 13, color: '#856404' }}>
            <span>⚠️</span><span>{error}</span>
            <button onClick={() => fetchData()} style={{ marginLeft: 'auto', fontSize: 12, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#856404' }}>Coba lagi</button>
          </div>
        )}

        {refreshing && !loading && (
          <div style={{ margin: '0 32px 4px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9E9E9E' }}>
            <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Memperbarui data...
          </div>
        )}

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, padding: '0 32px 16px', background: CREAM }}>
          {[['dashboard', 'Pelacakan Uang'], ['catat', 'Catat'], ['riwayat', 'Riwayat']].map(([id, label]) => (
            <button key={id} className="tab-btn" onClick={() => setTab(id)}
              style={{ padding: '9px 22px', borderRadius: 50, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: tab === id ? WHITE : 'transparent',
                color: tab === id ? GREEN_DARK : '#9E9E9E',
                boxShadow: tab === id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

<<<<<<< HEAD
        {tab === 'dashboard' && <DashboardPage data={data} loading={loading} onDetail={setDetailTrx} onAdd={openAdd} onEdit={openEdit} onDelete={openDel} />}
        {tab === 'catat'     && <CatatPage     data={data} loading={loading} onDetail={setDetailTrx} onEdit={openEdit} onDelete={handleDelete} onSaved={handleSaved} />}
        {tab === 'riwayat'   && <RiwayatPage   data={data} loading={loading} onDetail={setDetailTrx} onEdit={openEdit} onDelete={openDel} />}
      </div>

      <TransaksiModal open={modal} onClose={() => { setModal(false); setEditData(null) }} onSaved={handleSaved} editData={editData} />
      <DeleteModal open={!!delId} loading={delLoading} onClose={() => setDelId(null)} onConfirm={confirmDelete} />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
=======
        {/* PAGE CONTENT */}
        {tab==='dashboard' && (
          <DashboardPage
            data={data}
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
            onDelete={openDel}
          />
        )}
      </div>

      <TransaksiModal open={modal} onClose={()=>{setModal(false);setEditData(null)}} onSaved={handleSaved} editData={editData}/>
      <DeleteModal open={!!delId} onClose={()=>setDelId(null)} onConfirm={()=>handleDelete(delId)}/>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    </>
  )
}