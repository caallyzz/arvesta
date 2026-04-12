import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Menu, User, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { getErrorMessage } from '../utils/mockData'

export default function Profil() {
  const { toggleSidebar } = useOutletContext()
  const { user, refreshProfile } = useAuth()

  const [tab, setTab] = useState('profil')

  // Profile form
  const [username, setUsername] = useState(user?.username || '')
  const [saving, setSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)

  // Password form
  const [pw, setPw] = useState({ old: '', new: '', confirm: '' })
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState(null)

  const handleProfileSave = async e => {
    e.preventDefault()
    if (!username.trim() || username.length < 2) {
      setProfileMsg({ type: 'error', text: 'Username minimal 2 karakter' })
      return
    }
    setSaving(true)
    setProfileMsg(null)
    try {
      await authAPI.updateProfile({ username })
      await refreshProfile()
      setProfileMsg({ type: 'success', text: 'Profil berhasil diperbarui!' })
    } catch (e) {
      setProfileMsg({ type: 'error', text: getErrorMessage(e) })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async e => {
    e.preventDefault()
    if (!pw.old) {
      setPwMsg({ type: 'error', text: 'Password lama wajib diisi' })
      return
    }
    if (pw.new.length < 6) {
      setPwMsg({ type: 'error', text: 'Password baru minimal 6 karakter' })
      return
    }
    if (pw.new !== pw.confirm) {
      setPwMsg({ type: 'error', text: 'Konfirmasi password tidak cocok' })
      return
    }
    setPwSaving(true)
    setPwMsg(null)
    try {
      await authAPI.changePassword({ oldPassword: pw.old, newPassword: pw.new })
      setPwMsg({ type: 'success', text: 'Password berhasil diubah!' })
      setPw({ old: '', new: '', confirm: '' })
    } catch (e) {
      setPwMsg({ type: 'error', text: getErrorMessage(e) })
    } finally {
      setPwSaving(false)
    }
  }

  const initial = user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F5F0E8]/80 backdrop-blur-md border-b border-[#E8E0D4] px-5 py-3.5">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-[#EDE8DF] text-[#1B3A2D] transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-[#1B3A2D] text-lg">Profil Saya</h2>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">
        {/* Avatar Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D4] p-5 flex items-center gap-5">
          <div className="w-16 h-16 bg-[#1B3A2D] rounded-2xl flex items-center justify-center text-white font-display text-2xl font-bold shadow-md flex-shrink-0">
            {initial}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-[#1B3A2D]">
              {user?.username || 'Pengguna'}
            </h2>
            <p className="text-sm text-[#9E9E9E] mt-0.5">{user?.email || ''}</p>
            <p className="text-xs text-[#BDBDBD] mt-1">
              Bergabung sejak{' '}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('id-ID', {
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#EDE8DF] rounded-xl p-1">
          {[
            ['profil', 'Informasi Profil'],
            ['keamanan', 'Keamanan Akun'],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                tab === k
                  ? 'bg-white shadow-md text-[#1B3A2D]'
                  : 'text-[#9E9E9E] hover:text-[#1B3A2D]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profil' && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D4] p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F5F0E8]">
              <User className="w-4 h-4 text-[#1B3A2D]" />
              <h3 className="font-semibold text-[#1B3A2D]">Informasi Profil</h3>
            </div>

            {profileMsg && (
              <div
                className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
                  profileMsg.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9E9E9E] uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] bg-white text-[#1B3A2D] text-sm outline-none focus:border-[#1B3A2D] transition-colors"
                  minLength={2}
                  required
                  placeholder="Masukkan username"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9E9E9E] uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] bg-[#F5F0E8] text-[#BDBDBD] text-sm cursor-not-allowed"
                />
                <p className="text-xs text-[#BDBDBD] mt-1">Email tidak dapat diubah</p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-[#1B3A2D] hover:bg-[#2D5040] text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  'Menyimpan...'
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Simpan Perubahan
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {tab === 'keamanan' && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D4] p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F5F0E8]">
              <Lock className="w-4 h-4 text-[#1B3A2D]" />
              <h3 className="font-semibold text-[#1B3A2D]">Ubah Password</h3>
            </div>

            {pwMsg && (
              <div
                className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
                  pwMsg.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}
              >
                {pwMsg.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {pwMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { key: 'old', label: 'Password Lama', auto: 'current-password' },
                { key: 'new', label: 'Password Baru', auto: 'new-password' },
                { key: 'confirm', label: 'Konfirmasi Password Baru', auto: 'new-password' },
              ].map(({ key, label, auto }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#9E9E9E] uppercase tracking-wider mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPw[key] ? 'text' : 'password'}
                      value={pw[key]}
                      onChange={e => setPw(v => ({ ...v, [key]: e.target.value }))}
                      autoComplete={auto}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] bg-white text-[#1B3A2D] text-sm outline-none focus:border-[#1B3A2D] transition-colors pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => ({ ...v, [key]: !v[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BDBDBD] hover:text-[#1B3A2D] transition-colors"
                    >
                      {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={pwSaving}
                className="w-full flex items-center justify-center gap-2 bg-[#1B3A2D] hover:bg-[#2D5040] text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pwSaving ? (
                  'Mengubah...'
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Ubah Password
                  </>
                )}
              </button>
            </form>

            {/* Tips Keamanan */}
            <div className="border-t border-[#F5F0E8] pt-4 mt-2">
              <h4 className="text-sm font-semibold text-[#1B3A2D] mb-3">Tips Keamanan</h4>
              <ul className="space-y-2 text-xs text-[#9E9E9E]">
                <li className="flex items-center gap-2">
                  <span className="text-[#1B3A2D] text-base">✓</span>
                  Gunakan minimal 8 karakter
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1B3A2D] text-base">✓</span>
                  Kombinasikan huruf besar, huruf kecil, angka, dan simbol
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1B3A2D] text-base">✓</span>
                  Jangan gunakan password yang sama di tempat lain
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1B3A2D] text-base">✓</span>
                  Ganti password secara berkala (3-6 bulan sekali)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}