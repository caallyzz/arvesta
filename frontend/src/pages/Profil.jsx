import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Menu, User, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { getErrorMessage } from '../utils/mockData'

export default function Profil() {
  const { toggleSidebar }  = useOutletContext()
  const { user, refreshProfile } = useAuth()

  const [tab, setTab] = useState('profil')

  // Profile form
  const [username, setUsername] = useState(user?.username || '')
  const [saving,   setSaving]   = useState(false)
  const [profileMsg, setProfileMsg] = useState(null) // { type, text }

  // Password form
  const [pw, setPw] = useState({ old:'', new:'', confirm:'' })
  const [showPw, setShowPw] = useState({ old:false, new:false, confirm:false })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState(null)

  const handleProfileSave = async e => {
    e.preventDefault()
    if (!username.trim() || username.length < 2) { setProfileMsg({ type:'error', text:'Username minimal 2 karakter' }); return }
    setSaving(true); setProfileMsg(null)
    try {
      await authAPI.updateProfile({ username })
      await refreshProfile()
      setProfileMsg({ type:'success', text:'Profil berhasil diperbarui!' })
    } catch (e) { setProfileMsg({ type:'error', text: getErrorMessage(e) }) }
    finally { setSaving(false) }
  }

  const handlePasswordChange = async e => {
    e.preventDefault()
    if (!pw.old)                          { setPwMsg({ type:'error', text:'Password lama wajib diisi' }); return }
    if (pw.new.length < 6)                { setPwMsg({ type:'error', text:'Password baru minimal 6 karakter' }); return }
    if (pw.new !== pw.confirm)            { setPwMsg({ type:'error', text:'Konfirmasi password tidak cocok' }); return }
    setPwSaving(true); setPwMsg(null)
    try {
      await authAPI.changePassword({ oldPassword: pw.old, newPassword: pw.new })
      setPwMsg({ type:'success', text:'Password berhasil diubah!' })
      setPw({ old:'', new:'', confirm:'' })
    } catch (e) { setPwMsg({ type:'error', text: getErrorMessage(e) }) }
    finally { setPwSaving(false) }
  }

  const initial = user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-gray-100 px-5 py-3.5">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={toggleSidebar} className="lg:hidden btn-ghost p-2"><Menu className="w-5 h-5" /></button>
          <h2 className="font-semibold text-ink">Profil</h2>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">
        {/* Avatar + info */}
        <div className="card flex items-center gap-5">
          <div className="w-16 h-16 bg-primary-700 rounded-2xl flex items-center justify-center text-white font-display text-2xl font-bold shadow-green flex-shrink-0">
            {initial}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">{user?.username || 'Pengguna'}</h2>
            <p className="text-sm text-ink-muted mt-0.5">{user?.email || ''}</p>
            <p className="text-xs text-ink-light mt-1">
              Bergabung sejak {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('id-ID', { month:'long', year:'numeric' })
                : '—'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-surface-muted rounded-xl p-1">
          {[['profil','Informasi Profil'],['keamanan','Keamanan']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab===k ? 'bg-white shadow-card text-primary-700' : 'text-ink-muted hover:text-ink'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profil' && (
          <div className="card space-y-5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary-700" />
              <h3 className="font-semibold text-ink">Informasi Profil</h3>
            </div>

            {profileMsg && (
              <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
                profileMsg.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="input-label">Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)}
                  className="input-field" minLength={2} required />
              </div>
              <div>
                <label className="input-label">Email</label>
                <input value={user?.email || ''} disabled className="input-field bg-surface-muted text-ink-muted cursor-not-allowed" />
                <p className="text-xs text-ink-light mt-1">Email tidak dapat diubah</p>
              </div>
              <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-60">
                {saving ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
              </button>
            </form>
          </div>
        )}

        {/* Password tab */}
        {tab === 'keamanan' && (
          <div className="card space-y-5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary-700" />
              <h3 className="font-semibold text-ink">Ubah Password</h3>
            </div>

            {pwMsg && (
              <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
                pwMsg.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                {pwMsg.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                {pwMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { key:'old',     label:'Password Lama',        auto:'current-password' },
                { key:'new',     label:'Password Baru',        auto:'new-password'     },
                { key:'confirm', label:'Konfirmasi Password Baru', auto:'new-password' },
              ].map(({ key, label, auto }) => (
                <div key={key}>
                  <label className="input-label">{label}</label>
                  <div className="relative">
                    <input
                      type={showPw[key] ? 'text' : 'password'}
                      value={pw[key]}
                      onChange={e => setPw(v => ({...v,[key]:e.target.value}))}
                      autoComplete={auto}
                      className="input-field pr-10"
                      placeholder="••••••••"
                    />
                    <button type="button"
                      onClick={() => setShowPw(v => ({...v,[key]:!v[key]}))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink">
                      {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <button type="submit" disabled={pwSaving} className="btn-primary text-sm disabled:opacity-60">
                {pwSaving ? 'Mengubah...' : <><Lock className="w-4 h-4" /> Ubah Password</>}
              </button>
            </form>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-ink mb-2">Tips Keamanan</h4>
              <ul className="space-y-1 text-xs text-ink-muted">
                <li className="flex items-center gap-2"><span className="text-primary-700">✓</span> Gunakan minimal 8 karakter</li>
                <li className="flex items-center gap-2"><span className="text-primary-700">✓</span> Kombinasikan huruf, angka, dan simbol</li>
                <li className="flex items-center gap-2"><span className="text-primary-700">✓</span> Jangan gunakan password yang sama di tempat lain</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
