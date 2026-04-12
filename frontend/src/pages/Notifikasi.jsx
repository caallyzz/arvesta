import React, { useEffect, useState, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { 
  Menu, Search, CheckCheck, RefreshCw, 
  CheckCircle2, AlertTriangle, Users, ShieldCheck, PieChart, Bell 
} from 'lucide-react'
import { notifikasiAPI } from '../services/api'
import { formatTanggalJam } from '../utils/mockData'

// Mapping Icon Lucide & Warna berdasarkan Tailwind Config kamu
const CFG_MAP = {
  transaksi:  { 
    Icon: CheckCircle2, 
    iconColor: 'text-primary-700', 
    bg: 'bg-primary-50', 
    border: 'border-primary-700' 
  },
  peringatan: { 
    Icon: AlertTriangle, 
    iconColor: 'text-yellow-600', 
    bg: 'bg-yellow-50', 
    border: 'border-yellow-500' 
  },
  tabungan:   { 
    Icon: Users, 
    iconColor: 'text-orange-600', 
    bg: 'bg-orange-50', 
    border: 'border-orange-500' 
  },
  login:      { 
    Icon: ShieldCheck, 
    iconColor: 'text-ink-muted', 
    bg: 'bg-surface-muted', 
    border: 'border-ink-muted' 
  },
  laporan:    { 
    Icon: PieChart, 
    iconColor: 'text-primary-700', 
    bg: 'bg-primary-50', 
    border: 'border-primary-400' 
  },
  default:    { 
    Icon: Bell, 
    iconColor: 'text-ink-light', 
    bg: 'bg-surface', 
    border: 'border-primary-400' 
  },
}

const TABS = ['Semua', 'Transaksi', 'Peringatan', 'Tabungan Bersama', 'Promo']

export default function Notifikasi() {
  const { toggleSidebar } = useOutletContext()
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('Semua')

  const fetchNotifs = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await notifikasiAPI.getAll()
      setNotifs(data.data || data || [])
    } catch (e) { 
      console.error(e) 
      setNotifs([]) // Fallback jika error agar tidak loop loading
    } finally { 
      setLoading(false) 
    }
  }, [])

  useEffect(() => { fetchNotifs() }, [fetchNotifs])

  const getCfg = (tipe) => {
    const key = Object.keys(CFG_MAP).find(k => tipe?.toLowerCase().includes(k))
    return CFG_MAP[key] || CFG_MAP.default
  }

  const filtered = tab === 'Semua'
    ? notifs
    : notifs.filter(n => n.tipe?.toLowerCase().includes(tab.toLowerCase().split(' ')[0]))

  // Grouping Waktu
  const grouped = filtered.reduce((acc, n) => {
    const d = new Date(n.created_at || n.tanggal || Date.now())
    const now = new Date()
    let label = 'MINGGU INI'
    if (d.toDateString() === now.toDateString()) label = 'HARI INI'
    else {
      const yesterday = new Date(); yesterday.setDate(now.getDate() - 1)
      if (d.toDateString() === yesterday.toDateString()) label = 'KEMARIN'
    }
    if (!acc[label]) acc[label] = []
    acc[label].push(n)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-white font-body">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* 1. Search Bar */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" />
          <input 
            type="text" 
            placeholder="Cari notifikasi..." 
            className="w-full pl-11 pr-4 py-3 bg-surface border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-400 outline-none transition-all"
          />
        </div>

        {/* 2. Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-primary-800 leading-tight">Notifikasi</h1>
            <p className="text-ink-muted mt-1">Tetap pantau aktivitas keuangan Arvesta kamu.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 text-orange-700 text-sm font-semibold rounded-full hover:bg-orange-100 transition-all shadow-sm active:scale-95">
            <CheckCheck className="w-4 h-4" /> Tandai Semua Sudah Dibaca
          </button>
        </div>

        {/* 3. Tabs Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {TABS.map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                tab === t 
                  ? 'bg-primary-800 text-white shadow-green' 
                  : 'bg-surface-muted text-ink-muted hover:bg-primary-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 4. Notif Content Area */}
        {loading ? (
          /* Loading State */
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-5 animate-pulse">
                <div className="w-12 h-12 bg-surface rounded-2xl" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-surface rounded w-1/4" />
                  <div className="h-3 bg-surface rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-5">
              <Bell className="w-10 h-10 text-ink-light opacity-20" />
            </div>
            <h3 className="font-display text-xl font-bold text-ink">Tidak Ada Notifikasi</h3>
            <p className="text-sm text-ink-muted mt-2 max-w-xs mx-auto">
              Sepertinya belum ada kabar terbaru di kategori ini. Cek lagi nanti ya!
            </p>
            <button 
              onClick={fetchNotifs}
              className="mt-6 flex items-center gap-2 text-primary-700 font-semibold text-sm hover:opacity-70 transition-opacity"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Segarkan
            </button>
          </div>
        ) : (
          /* List Notifikasi */
          <div className="space-y-12">
            {['HARI INI', 'KEMARIN', 'MINGGU INI'].map(section => grouped[section] && (
              <div key={section} className="space-y-8">
                {/* Section Divider */}
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-ink-light tracking-[0.2em] uppercase">{section}</span>
                  <div className="h-[1px] flex-1 bg-surface-muted"></div>
                </div>

                <div className="space-y-8">
                  {grouped[section].map(n => {
                    const isRead = n.is_read || n.dibaca
                    const { Icon, iconColor, bg, border } = getCfg(n.tipe)
                    
                    return (
                      <div key={n.id} className="relative flex items-start gap-5 group cursor-pointer">
                        {/* Indikator Belum Dibaca (Garis Samping) */}
                        {!isRead && (
                          <div className={`absolute -left-5 top-0 bottom-0 w-1.5 rounded-r-full ${border} bg-current transition-all`} />
                        )}
                        
                        {/* Icon Container */}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${bg} shadow-sm transition-transform group-hover:scale-105`}>
                          <Icon className={`w-6 h-6 ${iconColor}`} />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0 border-b border-surface-muted pb-6">
                          <div className="flex justify-between items-start mb-1.5">
                            <h3 className={`font-bold text-base truncate pr-4 ${isRead ? 'text-ink' : 'text-primary-800'}`}>
                              {n.judul}
                            </h3>
                            <span className="text-[10px] font-semibold text-ink-light whitespace-nowrap uppercase tracking-tighter">
                              {new Date(n.created_at || n.tanggal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                            {n.pesan}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}