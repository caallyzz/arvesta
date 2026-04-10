import React, { useEffect, useState, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Menu, Bell, CheckCheck, RefreshCw } from 'lucide-react'
import { notifikasiAPI } from '../services/api'
import { formatTanggalJam, getErrorMessage } from '../utils/mockData'

const ICON_MAP = {
  transaksi:  { emoji: '💸', bg: 'bg-green-50'  },
  peringatan: { emoji: '⚠️', bg: 'bg-yellow-50' },
  tabungan:   { emoji: '🐷', bg: 'bg-blue-50'   },
  login:      { emoji: '🔐', bg: 'bg-purple-50' },
  laporan:    { emoji: '📊', bg: 'bg-orange-50' },
  default:    { emoji: '🔔', bg: 'bg-gray-50'   },
}

function getIconCfg(tipe) {
  const key = Object.keys(ICON_MAP).find(k => tipe?.toLowerCase().includes(k))
  return ICON_MAP[key] || ICON_MAP.default
}

const TABS = ['Semua', 'Transaksi', 'Peringatan', 'Tabungan', 'Promo']

export default function Notifikasi() {
  const { toggleSidebar } = useOutletContext()
  const [notifs,   setNotifs]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('Semua')
  const [marking,  setMarking]  = useState(false)

  const fetchNotifs = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await notifikasiAPI.getAll()
      setNotifs(data.data || data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchNotifs() }, [fetchNotifs])

  const markAllRead = async () => {
    setMarking(true)
    try {
      await notifikasiAPI.markRead('all')
      setNotifs(v => v.map(n => ({ ...n, is_read: true, dibaca: true })))
    } catch (e) { console.error(e) }
    finally { setMarking(false) }
  }

  const markOne = async (id) => {
    try {
      await notifikasiAPI.markRead(id)
      setNotifs(v => v.map(n => n.id === id ? { ...n, is_read: true, dibaca: true } : n))
    } catch { /* silent */ }
  }

  const filtered = tab === 'Semua'
    ? notifs
    : notifs.filter(n => n.tipe?.toLowerCase().includes(tab.toLowerCase()))

  const unreadCount = notifs.filter(n => !n.is_read && !n.dibaca).length

  // Group by date
  const grouped = filtered.reduce((acc, n) => {
    const key = new Date(n.created_at || n.tanggal || Date.now()).toLocaleDateString('id-ID', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    })
    if (!acc[key]) acc[key] = []
    acc[key].push(n)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-gray-100 px-5 py-3.5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="lg:hidden btn-ghost p-2"><Menu className="w-5 h-5" /></button>
            <h2 className="font-semibold text-ink">Notifikasi</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchNotifs} className="btn-ghost p-2"><RefreshCw className="w-4 h-4" /></button>
            {unreadCount > 0 && (
              <button onClick={markAllRead} disabled={marking}
                className="btn-secondary text-xs px-3 py-2 gap-1.5">
                <CheckCheck className="w-3.5 h-3.5" />
                Tandai Semua Dibaca
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Notifikasi</h1>
          <p className="text-sm text-ink-muted mt-1">Tetap pantau aktivitas keuangan Arvesta kamu.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-primary-700 text-white shadow-green'
                  : 'bg-white border border-gray-200 text-ink-muted hover:border-primary-300 hover:text-primary-700'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16">
            <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <h3 className="font-medium text-ink mb-1">Tidak Ada Notifikasi</h3>
            <p className="text-sm text-ink-muted">Semua notifikasi sudah dibaca</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2.5">{date}</p>
              <div className="space-y-2">
                {items.map(n => {
                  const isRead = n.is_read || n.dibaca
                  const cfg    = getIconCfg(n.tipe || n.judul)
                  return (
                    <button key={n.id} onClick={() => !isRead && markOne(n.id)}
                      className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 ${
                        isRead ? 'bg-white border border-gray-100' : 'bg-primary-50/60 border border-primary-100 hover:bg-primary-50'
                      }`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${cfg.bg}`}>
                        {cfg.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium leading-snug ${isRead ? 'text-ink' : 'text-primary-800'}`}>
                            {n.judul || n.title || 'Notifikasi'}
                          </p>
                          {!isRead && <span className="w-2 h-2 bg-primary-700 rounded-full flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                          {n.pesan || n.message || n.isi || ''}
                        </p>
                        <p className="text-[10px] text-ink-light mt-1">
                          {formatTanggalJam(n.created_at || n.tanggal)}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
