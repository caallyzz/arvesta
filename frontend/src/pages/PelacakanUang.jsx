import React, { useState, useEffect } from 'react'
import {
  Search, Bell, User, ShoppingCart, Car, ShoppingBag,
  FileText, Tv, ChevronLeft, ChevronRight, Edit2, Trash2,
  ArrowLeft, Share2, Download, X, Check
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const FONT       = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
const GREEN_DARK = '#1B3A2D'
const GREEN_MID  = '#2D5040'
const CREAM      = '#F5F0E8'
const CREAM2     = '#EDE8DF'
const ORANGE     = '#E8692A'
const WHITE      = '#FFFFFF'

const CATEGORIES = [
  { id:'makanan',   label:'MAKANAN',   Icon:ShoppingCart, color:'#F59E0B' },
  { id:'transport', label:'TRANSPORT', Icon:Car,          color:'#10B981' },
  { id:'belanja',   label:'BELANJA',   Icon:ShoppingBag,  color:'#8B5CF6' },
  { id:'tagihan',   label:'TAGIHAN',   Icon:FileText,     color:'#3B82F6' },
  { id:'hiburan',   label:'HIBURAN',   Icon:Tv,           color:'#EF4444' },
]

const MOCK = [
  { id:1, tipe:'expense', nominal:350000,  tanggal:'2023-11-20', deskripsi:'Supermarket',  kategori:'belanja',   merchant:'Giant Supermarket', metode:'E-wallet DANA', status:'Berhasil', id_transaksi:'TX-8829184855' },
  { id:2, tipe:'income',  nominal:15000000,tanggal:'2023-11-01', deskripsi:'Gaji Bulanan', kategori:'pemasukan', merchant:'PT Arvesta',        metode:'Transfer Bank', status:'Berhasil', id_transaksi:'TX-1234567890' },
  { id:3, tipe:'expense', nominal:186000,  tanggal:'2023-10-24', deskripsi:'Netflix Inc.', kategori:'hiburan',   merchant:'Netflix',           metode:'E-wallet DANA', status:'Berhasil', id_transaksi:'TX-8829184855', catatan:'Langganan paket Premium 4K + HDR. Perpanjangan otomatis aktif untuk bulan depan pada tanggal 24.' },
  { id:4, tipe:'expense', nominal:45000,   tanggal:'2023-11-18', deskripsi:'Grab Food',    kategori:'makanan',   merchant:'Grab',              metode:'GoPay',         status:'Berhasil', id_transaksi:'TX-9988776655' },
  { id:5, tipe:'expense', nominal:120000,  tanggal:'2023-11-15', deskripsi:'Listrik PLN',  kategori:'tagihan',   merchant:'PLN',               metode:'Transfer Bank', status:'Berhasil', id_transaksi:'TX-5544332211' },
  { id:6, tipe:'expense', nominal:75000,   tanggal:'2023-11-10', deskripsi:'Ojek Online',  kategori:'transport', merchant:'Gojek',             metode:'GoPay',         status:'Berhasil', id_transaksi:'TX-1122334455' },
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
const fmtFull = (val) => `Rp${(parseFloat(val)||0).toLocaleString('id-ID')}`
const fmtDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})
}
const todayInput = () => new Date().toISOString().slice(0,10)
const todayDisplay = () => new Date().toLocaleDateString('en-US',{month:'2-digit',day:'2-digit',year:'numeric'})
const getCat = (id) => CATEGORIES.find(c => c.id === id?.toLowerCase())

/* ═══════════════════════════════════════════════════════════
   INJECT STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
.pu * { box-sizing: border-box; }
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
}
`

function StyleInject() {
  useEffect(() => {
    const id = 'pu-css'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id; el.textContent = CSS
      document.head.appendChild(el)
    }
  }, [])
  return null
}

/* ═══════════════════════════════════════════════════════════
   DETAIL VIEW
═══════════════════════════════════════════════════════════ */
function DetailView({ trx, onBack, onEdit, onDelete }) {
  const cat   = getCat(trx.kategori)
  const CIcon = cat?.Icon || Tv
  const dateStr = trx.tanggal
    ? fmtDate(trx.tanggal) + ' • '
      + new Date(trx.tanggal).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}) + ' WIB'
    : ''

  return (
    <div className="pu" style={{minHeight:'100vh',background:CREAM,fontFamily:FONT}}>
      {/* Header */}
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
        {/* Receipt */}
        <div style={{background:WHITE,borderRadius:24,boxShadow:'0 8px 32px rgba(0,0,0,0.09)',overflow:'hidden'}}>
          {/* Top */}
          <div style={{padding:'40px 32px 28px',textAlign:'center',borderBottom:'1.5px dashed #E8E0D4'}}>
            <div style={{width:72,height:72,borderRadius:18,background:(cat?.color||'#888')+'22',
              display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',
              border:`1.5px solid ${cat?.color||'#888'}30`}}>
              <CIcon size={30} color={cat?.color||'#888'}/>
            </div>
            <h2 style={{fontSize:22,fontWeight:700,color:GREEN_DARK,marginBottom:6}}>{trx.deskripsi}</h2>
            <p style={{color:'#9E9E9E',fontSize:13}}>{dateStr}</p>
          </div>

          {/* Rows */}
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

            {/* Catatan */}
            {trx.catatan&&(
              <div style={{margin:'16px 0',background:'#FFFBF6',borderRadius:12,padding:'14px 16px',border:'1px solid #F5DEC8'}}>
                <p style={{fontSize:11,fontWeight:700,color:'#BCA080',textTransform:'uppercase',letterSpacing:0.8,marginBottom:8}}>Catatan Pembelian:</p>
                <p style={{fontSize:13,color:'#666',lineHeight:1.65}}>{trx.catatan}</p>
              </div>
            )}

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

  useEffect(() => {
    if (!open) return
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
  }

  if (!open) return null
  return (
    <div onClick={onClose}
      style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:200,
        display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div className="pu" onClick={e=>e.stopPropagation()}
        style={{background:WHITE,borderRadius:24,width:'100%',maxWidth:480,maxHeight:'90vh',
          overflowY:'auto',fontFamily:FONT}}>

        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
          padding:'20px 24px',borderBottom:`1px solid ${CREAM2}`,
          position:'sticky',top:0,background:WHITE,zIndex:1,borderRadius:'24px 24px 0 0'}}>
          <h3 style={{fontSize:16,fontWeight:700,color:GREEN_DARK}}>{isEdit?'Edit Transaksi':'Catat Transaksi'}</h3>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'#9E9E9E',padding:4}}><X size={18}/></button>
        </div>

        <div style={{padding:'20px 24px 24px'}}>
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
              </button>
            ))}
          </div>

          {/* Nominal */}
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
            </label>
            <textarea className="pu-input" value={form.catatan} onChange={set('catatan')}
              placeholder="Beli apa hari ini?" rows={3} style={{resize:'none',lineHeight:1.6}}/>
          </div>

          <button className="pu-btn-save" onClick={save} disabled={saving||!form.nominal||!form.tanggal}>
            <span>{saving?'Menyimpan...':isEdit?'Simpan Perubahan':'Simpan Transaksi'}</span>
            {!saving&&<span style={{fontSize:20}}>→</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DELETE CONFIRM
═══════════════════════════════════════════════════════════ */
function DeleteModal({ open, onClose, onConfirm }) {
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
          <button onClick={onConfirm}
            style={{padding:'12px',borderRadius:12,border:'none',background:'#E53935',
              cursor:'pointer',fontFamily:FONT,fontSize:14,fontWeight:700,color:WHITE}}>Hapus</button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function PelacakanUang() {
  const [data,       setData]      = useState(MOCK)
  const [search,     setSearch]    = useState('')
  const [page,       setPage]      = useState(1)
  const [modal,      setModal]     = useState(false)
  const [editData,   setEditData]  = useState(null)
  const [detailTrx,  setDetailTrx] = useState(null)
  const [delId,      setDelId]     = useState(null)
  const [formTipe,   setFormTipe]  = useState('expense')
  const [formNominal,setFormNom]   = useState('')
  const [formKat,    setFormKat]   = useState('')
  const LIMIT = 5

  const saldo    = data.reduce((s,t)=>s+(t.tipe==='income'?t.nominal:-t.nominal),0)
  const lastTwo  = [...data].sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal)).slice(0,2)
  const filtered = data.filter(t=>!search||(t.deskripsi+' '+(t.merchant||'')).toLowerCase().includes(search.toLowerCase()))
  const totPages = Math.max(1,Math.ceil(filtered.length/LIMIT))
  const pageData = filtered.slice((page-1)*LIMIT,page*LIMIT)

  const handleSaved = (saved) => {
    setData(prev=>prev.find(t=>t.id===saved.id)
      ? prev.map(t=>t.id===saved.id?saved:t)
      : [saved,...prev])
  }
  const handleDelete = (id) => {
    setData(prev=>prev.filter(t=>t.id!==id))
    setDelId(null)
    if(detailTrx?.id===id) setDetailTrx(null)
  }

  const openAdd = () => {
    setEditData(formNominal ? {tipe:formTipe,nominal:formNominal,kategori:formKat} : null)
    setModal(true)
  }

  // ── Detail view ──
  if (detailTrx) return (
    <>
      <StyleInject/>
      <DetailView trx={detailTrx} onBack={()=>setDetailTrx(null)}
        onEdit={t=>{setEditData(t);setDetailTrx(null);setModal(true)}}
        onDelete={id=>{handleDelete(id)}}/>
      <TransaksiModal open={modal} onClose={()=>{setModal(false);setEditData(null)}} onSaved={handleSaved} editData={editData}/>
      <DeleteModal open={!!delId} onClose={()=>setDelId(null)} onConfirm={()=>handleDelete(delId)}/>
    </>
  )

  return (
    <>
      <StyleInject/>
      <div className="pu" style={{minHeight:'100vh',background:CREAM,fontFamily:FONT}}>

        {/* ── TOP BAR ── */}
        <div className="pu-topbar" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 32px',background:CREAM}}>
          <div style={{position:'relative',flex:1,maxWidth:380}}>
            <Search size={15} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#BDBDBD',pointerEvents:'none'}}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Cari transaksi..." type="text"
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

        {/* ── LAYOUT ── */}
        <div className="pu-layout pu-page-pad"
          style={{display:'grid',gridTemplateColumns:'1fr 310px',gap:24,maxWidth:1080,margin:'0 auto',padding:'4px 32px 60px'}}>

          {/* ─ LEFT ─ */}
          <div>
            <h1 style={{fontSize:34,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif',marginBottom:4}}>Catat Transaksi</h1>
            <p style={{color:'#9E9E9E',fontSize:14,marginBottom:22}}>Kelola arus kas Anda dengan presisi kuratorial.</p>

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
                        <span style={{fontSize:9,fontWeight:700,color:active?color:'#BDBDBD',textTransform:'uppercase',letterSpacing:0.5}}>{label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Date + Merchant */}
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

              {/* Catatan */}
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

            {/* Transaction list */}
            {filtered.length>0&&(
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
                            letterSpacing:0.5,whiteSpace:'nowrap'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.map(t=>{
                        const cat = getCat(t.kategori)
                        return (
                          <tr key={t.id} className="pu-tr-row" onClick={()=>setDetailTrx(t)}>
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
                      {(page-1)*LIMIT+1}–{Math.min(page*LIMIT,filtered.length)} dari {filtered.length}
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

          {/* ─ SIDEBAR ─ */}
          <div className="pu-sidebar" style={{display:'flex',flexDirection:'column',gap:16}}>

            {/* Saldo */}
            <div style={{background:WHITE,borderRadius:20,padding:'22px'}}>
              <p style={{fontSize:11,fontWeight:700,color:'#BDBDBD',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Saldo Utama</p>
              <p style={{fontSize:28,fontWeight:800,color:GREEN_DARK,fontFamily:'DM Serif Display,Georgia,serif',marginBottom:14}}>
                {fmtFull(Math.abs(saldo))}
              </p>
              <div style={{background:CREAM,borderRadius:12,padding:'12px 14px'}}>
                <p style={{fontSize:12,color:'#9E9E9E',lineHeight:1.7,fontStyle:'italic'}}>
                  "Mencatat transaksi secara rutin membantu Anda memahami pola pengeluaran dan mencapai kebebasan finansial lebih cepat."
                </p>
              </div>
            </div>

            {/* Terakhir Dicatat */}
            <div style={{background:WHITE,borderRadius:20,padding:'20px 22px'}}>
              <p style={{fontSize:13,fontWeight:700,color:GREEN_DARK,marginBottom:14}}>Terakhir Dicatat</p>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {lastTwo.map(t=>{
                  const cat = getCat(t.kategori)
                  const CIcon = cat?.Icon||ShoppingCart
                  return (
                    <div key={t.id} className="pu-recent-item"
                      onClick={()=>setDetailTrx(t)}
                      style={{display:'flex',alignItems:'center',gap:12,padding:'9px 8px',transition:'background .15s'}}>
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

            {/* Dark banner */}
            <div style={{borderRadius:20,background:`linear-gradient(145deg,${GREEN_MID},${GREEN_DARK})`,
              padding:'22px 22px',position:'relative',overflow:'hidden',minHeight:110}}>
              <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.05)'}}/>
              <div style={{position:'absolute',bottom:-30,left:-10,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.04)'}}/>
              <p style={{fontSize:12,color:'rgba(255,255,255,0.75)',lineHeight:1.65,position:'relative'}}>
                Tingkatkan keamanan akun Anda dengan verifikasi 2 langkah.
              </p>
            </div>
          </div>
        </div>
      </div>

      <TransaksiModal open={modal} onClose={()=>{setModal(false);setEditData(null)}} onSaved={handleSaved} editData={editData}/>
      <DeleteModal open={!!delId} onClose={()=>setDelId(null)} onConfirm={()=>handleDelete(delId)}/>
    </>
  )
}