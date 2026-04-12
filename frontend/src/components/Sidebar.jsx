import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Wallet, Users, ScanLine,
  Bell, User, Settings, LogOut, X, TrendingUp,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { notifikasiAPI } from '../services/api'

const NAV_TOP = [
  { to: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pelacakan',        icon: Wallet,          label: 'Pelacakan Uang' },
  { to: '/tabungan-bersama', icon: Users,           label: 'Tabungan Bersama' },
  { to: '/scan',             icon: ScanLine,        label: 'Scan Struk' },
]

const NAV_AKUN = [
  { to: '/profil',     icon: User,     label: 'Profil' },
  { to: '/notifikasi', icon: Bell,     label: 'Notifikasi' },
  { to: '/pengaturan', icon: Settings, label: 'Pengaturan' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    notifikasiAPI.countUnread()
      .then(({ data }) => setUnread(data.count || data.data?.count || 0))
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initial = user?.username?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() || 'A'

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-30
      w-64 bg-[#F5F3EE] border-r border-slate-200
      flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2E6B44] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-900 text-base tracking-tight">Arvesta</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {/* Menu utama */}
        {NAV_TOP.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#F5A623] text-white font-medium'
                  : 'text-slate-600 hover:bg-black/5'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Section Akun */}
        <div className="pt-5 pb-1">
          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Akun
          </p>
        </div>

        {NAV_AKUN.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#F5A623] text-white font-medium'
                  : 'text-slate-600 hover:bg-black/5'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {to === '/notifikasi' && unread > 0 && (
              <span className="ml-auto min-w-[20px] h-5 px-1.5 text-[10px] font-semibold rounded-full bg-red-500 text-white flex items-center justify-center">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-slate-200 space-y-2">
        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-[#2E6B44] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate leading-tight">
              {user?.username || 'Pengguna'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || ''}</p>
          </div>
        </div>

        {/* Tombol Keluar */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}