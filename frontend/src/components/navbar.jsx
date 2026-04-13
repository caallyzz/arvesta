import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Menu, Search, Bell, User, X, TrendingUp,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { notifikasiAPI } from '../services/api'

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [unread, setUnread] = useState(0)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    notifikasiAPI.countUnread()
      .then(({ data }) => setUnread(data.count || data.data?.count || 0))
      .catch(() => {})
  }, [])

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path === '/pelacakan') return 'Pelacakan Uang'
    if (path === '/tabungan-bersama') return 'Tabungan Bersama'
    if (path === '/scan') return 'Scan Struk'
    if (path === '/profil') return 'Profil'
    if (path === '/pengaturan') return 'Pengaturan'
    if (path === '/notifikasi') return 'Notifikasi'
    return 'Arvesta'
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  const initial = user?.username?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() || 'A'

  return (
    <>
      {/* Navbar Desktop */}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-100 lg:pl-64">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          {/* Kiri - Logo & Menu Button (mobile) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Logo untuk mobile, hidden di desktop karena sudah ada di sidebar */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-7 h-7 bg-[#F97316] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-lg">Arvesta</span>
            </div>

            {/* Page Title - hidden di mobile */}
            <h1 className="hidden md:block text-xl font-semibold text-gray-900 ml-2">
              {getPageTitle()}
            </h1>
          </div>

          {/* Kanan - Search, Notifikasi, Profile */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari transaksi, produk..."
                  className="w-80 pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-colors"
                />
              </div>
            </form>

            {/* Search Button - Mobile */}
            <button
              onClick={() => setShowSearch(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifikasi */}
            <button
              onClick={() => navigate('/notifikasi')}
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 text-[10px] font-semibold rounded-full bg-red-500 text-white flex items-center justify-center">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 md:gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#F97316] text-white text-sm font-semibold flex items-center justify-center">
                  {initial}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.username || 'Pengguna'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email?.split('@')[0] || ''}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <button
                    onClick={() => navigate('/profil')}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full"
                  >
                    <User className="w-4 h-4" />
                    <span>Profil Saya</span>
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => navigate('/pengaturan')}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Pengaturan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal untuk Mobile */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari transaksi, produk..."
                  className="w-full pl-10 pr-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F97316]"
                  autoFocus
                />
              </div>
            </form>
            <button
              onClick={() => setShowSearch(false)}
              className="p-2 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Spacer untuk konten agar tidak ketutupan navbar */}
      <div className="h-16 lg:h-[72px]" />
    </>
  )
}