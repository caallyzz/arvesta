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

const NAV_BOTTOM = [
  { to: '/notifikasi', icon: Bell,     label: 'Notifikasi' },
  { to: '/profil',     icon: User,     label: 'Profil' },
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
      w-64 bg-white border-r border-gray-100
      flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-700 rounded-xl flex items-center justify-center shadow-green">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-semibold text-ink text-lg">Arvesta</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface-muted text-ink-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav top */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_TOP.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="pt-4 pb-1">
          <p className="px-4 text-xs font-semibold text-ink-light uppercase tracking-wider">
            Akun
          </p>
        </div>

        {NAV_BOTTOM.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {to === '/notifikasi' && unread > 0 && (
              <span className="ml-auto min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full bg-red-500 text-white flex items-center justify-center">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-muted">
          <div className="w-8 h-8 rounded-full bg-primary-700 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink truncate">
              {user?.username || 'Pengguna'}
            </p>
            <p className="text-xs text-ink-muted truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full mt-1 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
