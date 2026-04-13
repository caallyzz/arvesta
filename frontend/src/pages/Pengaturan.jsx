<<<<<<< HEAD
import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { 
  Menu, Bell, Lock, Database, Trash2, Eye, EyeOff,
  Check, AlertCircle, Mail, Smartphone, Save
} from 'lucide-react'

export default function Pengaturan() {
  const { toggleSidebar } = useOutletContext()
  
  // Tab aktif
  const [activeTab, setActiveTab] = useState('notifikasi')
=======
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { 
  Menu, User, Bell, Lock, Palette, Globe, Moon, Sun, 
  Shield, CreditCard, Smartphone, Database, LogOut, 
  ChevronRight, Check, AlertCircle, Mail, Phone, 
  MapPin, Calendar, Clock, DollarSign, TrendingUp,
  Download, Upload, RefreshCw, Trash2, Eye, EyeOff,
  Save, X, Edit2, Languages, Volume2, VolumeX
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI, pengaturanAPI } from '../services/api'
import { getErrorMessage, formatRupiah } from '../utils/mockData'

export default function Pengaturan() {
  const { toggleSidebar } = useOutletContext()
  const { user, refreshProfile } = useAuth()
  
  // Tab aktif
  const [activeTab, setActiveTab] = useState('profil')
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  
  // State untuk notifikasi
  const [notifSettings, setNotifSettings] = useState({
    email_transaksi: true,
    email_pengingat: true,
    email_promosi: false,
    push_transaksi: true,
    push_pengingat: true,
    push_promosi: false
  })
  
<<<<<<< HEAD
=======
  // State untuk preferensi
  const [preferences, setPreferences] = useState({
    tema: 'light',
    bahasa: 'id',
    mata_uang: 'IDR',
    format_tanggal: 'DD/MM/YYYY',
    notifikasi_suara: true
  })
  
  // State untuk keamanan
  const [security, setSecurity] = useState({
    two_factor: false,
    session_timeout: 30,
    login_alerts: true
  })
  
  // State untuk profil
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    no_telepon: user?.no_telepon || '',
    alamat: user?.alamat || '',
    jenis_kelamin: user?.jenis_kelamin || '',
    tanggal_lahir: user?.tanggal_lahir || ''
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)
  
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  // State untuk password
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  })
<<<<<<< HEAD
  const [passwordMsg, setPasswordMsg] = useState(null)
  
  // State untuk hapus data
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
=======
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState(null)
  
  // State untuk export/import data
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  
  // State untuk hapus akun
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deletingAccount, setDeletingAccount] = useState(false)
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  
  // Toast notification
  const [toast, setToast] = useState(null)
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
<<<<<<< HEAD
  // Simpan notifikasi ke localStorage
  const handleSaveNotifications = () => {
    localStorage.setItem('notifikasi', JSON.stringify(notifSettings))
    showToast('Pengaturan notifikasi berhasil disimpan', 'success')
  }
  
  // Ganti password
  const handleChangePassword = () => {
=======
  // Simpan preferensi
  const handleSavePreferences = async () => {
    try {
      await pengaturanAPI.updatePreferences(preferences)
      showToast('Preferensi berhasil disimpan', 'success')
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    }
  }
  
  // Simpan notifikasi
  const handleSaveNotifications = async () => {
    try {
      await pengaturanAPI.updateNotifications(notifSettings)
      showToast('Pengaturan notifikasi berhasil disimpan', 'success')
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    }
  }
  
  // Simpan keamanan
  const handleSaveSecurity = async () => {
    try {
      await pengaturanAPI.updateSecurity(security)
      showToast('Pengaturan keamanan berhasil disimpan', 'success')
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    }
  }
  
  // Update profil
  const handleUpdateProfile = async () => {
    setSavingProfile(true)
    setProfileMsg(null)
    try {
      await authAPI.updateProfile({
        username: profileForm.username,
        no_telepon: profileForm.no_telepon,
        alamat: profileForm.alamat,
        jenis_kelamin: profileForm.jenis_kelamin,
        tanggal_lahir: profileForm.tanggal_lahir
      })
      await refreshProfile()
      setEditingProfile(false)
      showToast('Profil berhasil diperbarui', 'success')
    } catch (error) {
      setProfileMsg({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setSavingProfile(false)
    }
  }
  
  // Ganti password
  const handleChangePassword = async () => {
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
    if (passwordForm.new_password.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password baru minimal 6 karakter' })
      return
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi password tidak cocok' })
      return
    }
<<<<<<< HEAD
    
    // Cek password lama
    const savedPassword = localStorage.getItem('user_password')
    if (savedPassword && passwordForm.old_password !== savedPassword) {
      setPasswordMsg({ type: 'error', text: 'Password lama salah' })
      return
    }
    
    // Simpan password baru
    localStorage.setItem('user_password', passwordForm.new_password)
    setPasswordMsg({ type: 'success', text: 'Password berhasil diubah!' })
    setPasswordForm({ old_password: '', new_password: '', confirm_password: '' })
    setTimeout(() => setPasswordMsg(null), 3000)
  }
  
  // Hapus semua data
  const handleDeleteAllData = () => {
    if (deleteConfirmText !== 'HAPUS') {
      showToast('Ketik "HAPUS" untuk konfirmasi', 'error')
      return
    }
    localStorage.clear()
    showToast('Semua data berhasil dihapus', 'success')
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }
  
  const tabs = [
    { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
    { id: 'keamanan', label: 'Keamanan', icon: Lock },
    { id: 'data', label: 'Data', icon: Database },
=======
    setChangingPassword(true)
    setPasswordMsg(null)
    try {
      await authAPI.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      })
      setPasswordMsg({ type: 'success', text: 'Password berhasil diubah!' })
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' })
      setTimeout(() => setPasswordMsg(null), 3000)
    } catch (error) {
      setPasswordMsg({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setChangingPassword(false)
    }
  }
  
  // Export data
  const handleExportData = async () => {
    setExporting(true)
    try {
      const response = await pengaturanAPI.exportData()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `arvesta_data_${new Date().toISOString().slice(0,10)}.json`
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('Data berhasil diekspor', 'success')
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setExporting(false)
    }
  }
  
  // Import data
  const handleImportData = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await pengaturanAPI.importData(formData)
      showToast('Data berhasil diimpor', 'success')
      window.location.reload()
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setImporting(false)
    }
  }
  
  // Hapus akun
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'HAPUS AKUN') {
      showToast('Ketik "HAPUS AKUN" untuk konfirmasi', 'error')
      return
    }
    setDeletingAccount(true)
    try {
      await authAPI.deleteAccount()
      localStorage.clear()
      window.location.href = '/login'
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
      setDeletingAccount(false)
      setShowDeleteConfirm(false)
    }
  }
  
  const tabs = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
    { id: 'preferensi', label: 'Preferensi', icon: Palette },
    { id: 'keamanan', label: 'Keamanan', icon: Shield },
    { id: 'data', label: 'Data & Privasi', icon: Database },
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
  ]
  
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Toast Notification */}
      {toast && (
<<<<<<< HEAD
        <div className="fixed bottom-5 right-5 z-50">
=======
        <div className="fixed bottom-5 right-5 z-50 animate-fade-up">
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
          <div className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F5F0E8]/80 backdrop-blur-md border-b border-[#E8E0D4] px-5 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-xl hover:bg-[#EDE8DF] transition">
              <Menu className="w-5 h-5 text-[#1B3A2D]" />
            </button>
            <div>
              <h2 className="font-semibold text-[#1B3A2D] text-lg">Pengaturan</h2>
<<<<<<< HEAD
=======
              <p className="text-xs text-[#9E9E9E] hidden sm:block">Kelola preferensi akun dan aplikasi</p>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto px-5 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden sticky top-20">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 transition ${
                    activeTab === tab.id 
                      ? 'bg-[#1B3A2D] text-white' 
                      : 'text-[#1B3A2D] hover:bg-[#F5F0E8]'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium flex-1 text-left">{tab.label}</span>
<<<<<<< HEAD
=======
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                </button>
              ))}
            </div>
          </div>
          
          {/* Main Content */}
<<<<<<< HEAD
          <div className="flex-1">
            
            {/* TAB NOTIFIKASI */}
=======
          <div className="flex-1 space-y-5">
            
            {/* ========== TAB PROFIL ========== */}
            {activeTab === 'profil' && (
              <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden">
                <div className="p-6 border-b border-[#F5F0E8]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1B3A2D] text-lg">Informasi Profil</h3>
                      <p className="text-sm text-[#9E9E9E] mt-1">Kelola data diri Anda</p>
                    </div>
                    {!editingProfile ? (
                      <button
                        onClick={() => setEditingProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F5F0E8] rounded-xl text-[#1B3A2D] font-medium text-sm hover:bg-[#EDE8DF] transition"
                      >
                        <Edit2 className="w-4 h-4" /> Edit Profil
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProfile(false)}
                          className="px-4 py-2 border-2 border-[#E8E0D4] rounded-xl text-[#9E9E9E] font-medium text-sm hover:bg-[#F5F0E8] transition"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleUpdateProfile}
                          disabled={savingProfile}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1B3A2D] rounded-xl text-white font-medium text-sm hover:bg-[#2D5040] transition disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" /> {savingProfile ? 'Menyimpan...' : 'Simpan'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 space-y-5">
                  {profileMsg && (
                    <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
                      profileMsg.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {profileMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {profileMsg.text}
                    </div>
                  )}
                  
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-[#1B3A2D] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {(profileForm.username?.[0] || user?.email?.[0] || 'U')?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1B3A2D]">{profileForm.username || 'Pengguna'}</p>
                      <p className="text-sm text-[#9E9E9E]">Member sejak {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}</p>
                    </div>
                  </div>
                  
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Username</label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={e => setProfileForm({...profileForm, username: e.target.value})}
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition ${
                          !editingProfile ? 'bg-[#F5F0E8] text-[#9E9E9E]' : 'bg-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] bg-[#F5F0E8] text-[#9E9E9E] cursor-not-allowed"
                      />
                      <p className="text-xs text-[#BDBDBD] mt-1">Email tidak dapat diubah</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">No. Telepon</label>
                      <input
                        type="tel"
                        value={profileForm.no_telepon}
                        onChange={e => setProfileForm({...profileForm, no_telepon: e.target.value})}
                        disabled={!editingProfile}
                        placeholder="+62 xxx xxx xxx"
                        className={`w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition ${
                          !editingProfile ? 'bg-[#F5F0E8] text-[#9E9E9E]' : 'bg-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={profileForm.tanggal_lahir}
                        onChange={e => setProfileForm({...profileForm, tanggal_lahir: e.target.value})}
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition ${
                          !editingProfile ? 'bg-[#F5F0E8] text-[#9E9E9E]' : 'bg-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Jenis Kelamin</label>
                      <select
                        value={profileForm.jenis_kelamin}
                        onChange={e => setProfileForm({...profileForm, jenis_kelamin: e.target.value})}
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition ${
                          !editingProfile ? 'bg-[#F5F0E8] text-[#9E9E9E]' : 'bg-white'
                        }`}
                      >
                        <option value="">Pilih</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Alamat</label>
                      <textarea
                        value={profileForm.alamat}
                        onChange={e => setProfileForm({...profileForm, alamat: e.target.value})}
                        disabled={!editingProfile}
                        rows="2"
                        placeholder="Masukkan alamat lengkap"
                        className={`w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition resize-none ${
                          !editingProfile ? 'bg-[#F5F0E8] text-[#9E9E9E]' : 'bg-white'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Ganti Password Section */}
                <div className="border-t border-[#F5F0E8] p-6">
                  <h3 className="font-semibold text-[#1B3A2D] mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Ganti Password
                  </h3>
                  
                  {passwordMsg && (
                    <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4 ${
                      passwordMsg.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {passwordMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {passwordMsg.text}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Password Lama</label>
                      <div className="relative">
                        <input
                          type={showPassword.old ? 'text' : 'password'}
                          value={passwordForm.old_password}
                          onChange={e => setPasswordForm({...passwordForm, old_password: e.target.value})}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({...showPassword, old: !showPassword.old})}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]"
                        >
                          {showPassword.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Password Baru</label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          value={passwordForm.new_password}
                          onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})}
                          placeholder="Minimal 6 karakter"
                          className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]"
                        >
                          {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-1">Konfirmasi Baru</label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={passwordForm.confirm_password}
                          onChange={e => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                          placeholder="Konfirmasi password"
                          className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]"
                        >
                          {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="mt-4 px-6 py-2 bg-[#1B3A2D] text-white rounded-xl font-medium text-sm hover:bg-[#2D5040] transition disabled:opacity-50"
                  >
                    {changingPassword ? 'Mengubah...' : 'Ubah Password'}
                  </button>
                </div>
              </div>
            )}
            
            {/* ========== TAB NOTIFIKASI ========== */}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
            {activeTab === 'notifikasi' && (
              <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden">
                <div className="p-6 border-b border-[#F5F0E8]">
                  <h3 className="font-semibold text-[#1B3A2D] text-lg">Notifikasi</h3>
                  <p className="text-sm text-[#9E9E9E] mt-1">Atur notifikasi yang ingin Anda terima</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h4 className="font-medium text-[#1B3A2D] mb-3 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Notifikasi Email
                    </h4>
                    <div className="space-y-3">
                      {[
<<<<<<< HEAD
                        { key: 'email_transaksi', label: 'Transaksi baru' },
                        { key: 'email_pengingat', label: 'Pengingat menabung' },
                        { key: 'email_promosi', label: 'Promosi & penawaran' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between py-2 cursor-pointer">
                          <span className="text-sm text-[#1B3A2D]">{item.label}</span>
=======
                        { key: 'email_transaksi', label: 'Transaksi baru', desc: 'Dapatkan email setiap ada transaksi baru' },
                        { key: 'email_pengingat', label: 'Pengingat menabung', desc: 'Pengingat rutin untuk mencapai target tabungan' },
                        { key: 'email_promosi', label: 'Promosi & penawaran', desc: 'Informasi promo dan penawaran menarik' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between py-2 cursor-pointer">
                          <div>
                            <p className="font-medium text-[#1B3A2D] text-sm">{item.label}</p>
                            <p className="text-xs text-[#9E9E9E]">{item.desc}</p>
                          </div>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                          <button
                            onClick={() => setNotifSettings({...notifSettings, [item.key]: !notifSettings[item.key]})}
                            className={`w-11 h-6 rounded-full transition ${
                              notifSettings[item.key] ? 'bg-[#1B3A2D]' : 'bg-[#E8E0D4]'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                              notifSettings[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Push Notifications */}
                  <div className="pt-4 border-t border-[#F5F0E8]">
                    <h4 className="font-medium text-[#1B3A2D] mb-3 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> Notifikasi Push
                    </h4>
                    <div className="space-y-3">
                      {[
<<<<<<< HEAD
                        { key: 'push_transaksi', label: 'Transaksi baru' },
                        { key: 'push_pengingat', label: 'Pengingat menabung' },
                        { key: 'push_promosi', label: 'Promosi & update' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between py-2 cursor-pointer">
                          <span className="text-sm text-[#1B3A2D]">{item.label}</span>
=======
                        { key: 'push_transaksi', label: 'Transaksi baru', desc: 'Notifikasi realtime untuk transaksi' },
                        { key: 'push_pengingat', label: 'Pengingat menabung', desc: 'Pengingat harian/mingguan' },
                        { key: 'push_promosi', label: 'Promosi & update', desc: 'Update fitur dan promo terbaru' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between py-2 cursor-pointer">
                          <div>
                            <p className="font-medium text-[#1B3A2D] text-sm">{item.label}</p>
                            <p className="text-xs text-[#9E9E9E]">{item.desc}</p>
                          </div>
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                          <button
                            onClick={() => setNotifSettings({...notifSettings, [item.key]: !notifSettings[item.key]})}
                            className={`w-11 h-6 rounded-full transition ${
                              notifSettings[item.key] ? 'bg-[#1B3A2D]' : 'bg-[#E8E0D4]'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                              notifSettings[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSaveNotifications}
<<<<<<< HEAD
                    className="w-full md:w-auto px-6 py-2 bg-[#1B3A2D] text-white rounded-xl font-medium text-sm hover:bg-[#2D5040] transition"
                  >
                    <Save className="w-4 h-4 inline mr-2" /> Simpan Pengaturan
=======
                    className="mt-4 px-6 py-2 bg-[#1B3A2D] text-white rounded-xl font-medium text-sm hover:bg-[#2D5040] transition"
                  >
                    Simpan Pengaturan Notifikasi
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                  </button>
                </div>
              </div>
            )}
            
<<<<<<< HEAD
            {/* TAB KEAMANAN - GANTI PASSWORD */}
            {activeTab === 'keamanan' && (
              <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden">
                <div className="p-6 border-b border-[#F5F0E8]">
                  <h3 className="font-semibold text-[#1B3A2D] text-lg">Ganti Password</h3>
                  <p className="text-sm text-[#9E9E9E] mt-1">Perbarui password akun Anda</p>
                </div>
                
                <div className="p-6">
                  {passwordMsg && (
                    <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4 ${
                      passwordMsg.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {passwordMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {passwordMsg.text}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B3A2D] mb-1">Password Lama</label>
                      <div className="relative">
                        <input
                          type={showPassword.old ? 'text' : 'password'}
                          value={passwordForm.old_password}
                          onChange={e => setPasswordForm({...passwordForm, old_password: e.target.value})}
                          placeholder="Masukkan password lama"
                          className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none"
                        />
                        <button
                          onClick={() => setShowPassword({...showPassword, old: !showPassword.old})}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]"
                        >
                          {showPassword.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#1B3A2D] mb-1">Password Baru</label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          value={passwordForm.new_password}
                          onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})}
                          placeholder="Minimal 6 karakter"
                          className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none"
                        />
                        <button
                          onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]"
                        >
                          {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#1B3A2D] mb-1">Konfirmasi Password Baru</label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={passwordForm.confirm_password}
                          onChange={e => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                          placeholder="Konfirmasi password baru"
                          className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none"
                        />
                        <button
                          onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]"
                        >
                          {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleChangePassword}
                    className="w-full md:w-auto mt-6 px-6 py-2 bg-[#1B3A2D] text-white rounded-xl font-medium text-sm hover:bg-[#2D5040] transition"
                  >
                    <Lock className="w-4 h-4 inline mr-2" /> Ubah Password
=======
            {/* ========== TAB PREFERENSI ========== */}
            {activeTab === 'preferensi' && (
              <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden">
                <div className="p-6 border-b border-[#F5F0E8]">
                  <h3 className="font-semibold text-[#1B3A2D] text-lg">Preferensi Aplikasi</h3>
                  <p className="text-sm text-[#9E9E9E] mt-1">Sesuaikan tampilan dan bahasa aplikasi</p>
                </div>
                
                <div className="p-6 space-y-5">
                  {/* Tema */}
                  <div>
                    <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-2">Tema</label>
                    <div className="flex gap-3">
                      {[
                        { id: 'light', label: 'Terang', icon: Sun },
                        { id: 'dark', label: 'Gelap', icon: Moon }
                      ].map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setPreferences({...preferences, tema: theme.id})}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition ${
                            preferences.tema === theme.id 
                              ? 'border-[#1B3A2D] bg-[#1B3A2D] text-white' 
                              : 'border-[#E8E0D4] text-[#1B3A2D]'
                          }`}
                        >
                          <theme.icon className="w-4 h-4" />
                          {theme.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bahasa */}
                  <div>
                    <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-2">Bahasa</label>
                    <div className="flex gap-3">
                      {[
                        { id: 'id', label: 'Indonesia' },
                        { id: 'en', label: 'English' }
                      ].map(lang => (
                        <button
                          key={lang.id}
                          onClick={() => setPreferences({...preferences, bahasa: lang.id})}
                          className={`flex-1 py-3 rounded-xl border-2 transition ${
                            preferences.bahasa === lang.id 
                              ? 'border-[#1B3A2D] bg-[#1B3A2D] text-white' 
                              : 'border-[#E8E0D4] text-[#1B3A2D]'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Mata Uang */}
                  <div>
                    <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-2">Mata Uang</label>
                    <select
                      value={preferences.mata_uang}
                      onChange={e => setPreferences({...preferences, mata_uang: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition"
                    >
                      <option value="IDR">IDR - Rupiah Indonesia</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="SGD">SGD - Singapore Dollar</option>
                    </select>
                  </div>
                  
                  {/* Format Tanggal */}
                  <div>
                    <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-2">Format Tanggal</label>
                    <select
                      value={preferences.format_tanggal}
                      onChange={e => setPreferences({...preferences, format_tanggal: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                    </select>
                  </div>
                  
                  {/* Suara Notifikasi */}
                  <div>
                    <label className="flex items-center justify-between py-2 cursor-pointer">
                      <div>
                        <p className="font-medium text-[#1B3A2D] text-sm">Suara Notifikasi</p>
                        <p className="text-xs text-[#9E9E9E]">Aktifkan suara saat menerima notifikasi</p>
                      </div>
                      <button
                        onClick={() => setPreferences({...preferences, notifikasi_suara: !preferences.notifikasi_suara})}
                        className={`w-11 h-6 rounded-full transition ${
                          preferences.notifikasi_suara ? 'bg-[#1B3A2D]' : 'bg-[#E8E0D4]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          preferences.notifikasi_suara ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </label>
                  </div>
                  
                  <button
                    onClick={handleSavePreferences}
                    className="mt-4 px-6 py-2 bg-[#1B3A2D] text-white rounded-xl font-medium text-sm hover:bg-[#2D5040] transition"
                  >
                    Simpan Preferensi
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                  </button>
                </div>
              </div>
            )}
            
<<<<<<< HEAD
            {/* TAB DATA - HAPUS SEMUA DATA */}
            {activeTab === 'data' && (
              <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden">
                <div className="p-6 border-b border-[#F5F0E8]">
                  <h3 className="font-semibold text-[#1B3A2D] text-lg">Kelola Data</h3>
                  <p className="text-sm text-[#9E9E9E] mt-1">Hapus semua data yang tersimpan</p>
                </div>
                
                <div className="p-6">
                  <div className="border border-red-200 rounded-xl p-4 bg-red-50">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="font-medium text-red-600">Hapus Semua Data</p>
                        <p className="text-xs text-red-500 mt-1">
                          Menghapus semua pengaturan notifikasi dan password
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus Semua
=======
            {/* ========== TAB KEAMANAN ========== */}
            {activeTab === 'keamanan' && (
              <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden">
                <div className="p-6 border-b border-[#F5F0E8]">
                  <h3 className="font-semibold text-[#1B3A2D] text-lg">Keamanan Akun</h3>
                  <p className="text-sm text-[#9E9E9E] mt-1">Tingkatkan keamanan akun Anda</p>
                </div>
                
                <div className="p-6 space-y-5">
                  {/* Two Factor Authentication */}
                  <div>
                    <label className="flex items-center justify-between py-2 cursor-pointer">
                      <div>
                        <p className="font-medium text-[#1B3A2D] text-sm">Autentikasi Dua Faktor (2FA)</p>
                        <p className="text-xs text-[#9E9E9E]">Amankan akun dengan verifikasi 2 langkah</p>
                      </div>
                      <button
                        onClick={() => setSecurity({...security, two_factor: !security.two_factor})}
                        className={`w-11 h-6 rounded-full transition ${
                          security.two_factor ? 'bg-[#1B3A2D]' : 'bg-[#E8E0D4]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          security.two_factor ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </label>
                  </div>
                  
                  {/* Session Timeout */}
                  <div>
                    <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-2">Session Timeout</label>
                    <select
                      value={security.session_timeout}
                      onChange={e => setSecurity({...security, session_timeout: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-[#1B3A2D] outline-none transition"
                    >
                      <option value="15">15 menit</option>
                      <option value="30">30 menit</option>
                      <option value="60">1 jam</option>
                      <option value="120">2 jam</option>
                      <option value="480">8 jam</option>
                    </select>
                    <p className="text-xs text-[#9E9E9E] mt-1">Waktu tidak aktif sebelum sesi berakhir</p>
                  </div>
                  
                  {/* Login Alerts */}
                  <div>
                    <label className="flex items-center justify-between py-2 cursor-pointer">
                      <div>
                        <p className="font-medium text-[#1B3A2D] text-sm">Peringatan Login Baru</p>
                        <p className="text-xs text-[#9E9E9E]">Dapatkan notifikasi saat ada login dari perangkat baru</p>
                      </div>
                      <button
                        onClick={() => setSecurity({...security, login_alerts: !security.login_alerts})}
                        className={`w-11 h-6 rounded-full transition ${
                          security.login_alerts ? 'bg-[#1B3A2D]' : 'bg-[#E8E0D4]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          security.login_alerts ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </label>
                  </div>
                  
                  <button
                    onClick={handleSaveSecurity}
                    className="mt-4 px-6 py-2 bg-[#1B3A2D] text-white rounded-xl font-medium text-sm hover:bg-[#2D5040] transition"
                  >
                    Simpan Pengaturan Keamanan
                  </button>
                </div>
              </div>
            )}
            
            {/* ========== TAB DATA & PRIVASI ========== */}
            {activeTab === 'data' && (
              <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden">
                <div className="p-6 border-b border-[#F5F0E8]">
                  <h3 className="font-semibold text-[#1B3A2D] text-lg">Data & Privasi</h3>
                  <p className="text-sm text-[#9E9E9E] mt-1">Kelola data dan privasi akun Anda</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Export Data */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-[#1B3A2D] text-sm">Ekspor Data</p>
                      <p className="text-xs text-[#9E9E9E]">Download semua data transaksi Anda dalam format JSON</p>
                    </div>
                    <button
                      onClick={handleExportData}
                      disabled={exporting}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-[#E8E0D4] rounded-xl text-[#1B3A2D] font-medium text-sm hover:bg-[#F5F0E8] transition disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" /> {exporting ? 'Mengekspor...' : 'Ekspor'}
                    </button>
                  </div>
                  
                  {/* Import Data */}
                  <div className="flex items-center justify-between py-3 border-t border-[#F5F0E8]">
                    <div>
                      <p className="font-medium text-[#1B3A2D] text-sm">Impor Data</p>
                      <p className="text-xs text-[#9E9E9E]">Impor data transaksi dari file JSON</p>
                    </div>
                    <label className={`flex items-center gap-2 px-4 py-2 border-2 border-[#E8E0D4] rounded-xl text-[#1B3A2D] font-medium text-sm hover:bg-[#F5F0E8] transition cursor-pointer ${importing ? 'opacity-50' : ''}`}>
                      <Upload className="w-4 h-4" />
                      {importing ? 'Mengimpor...' : 'Impor'}
                      <input type="file" accept=".json" onChange={handleImportData} className="hidden" disabled={importing} />
                    </label>
                  </div>
                  
                  {/* Hapus Akun */}
                  <div className="py-3 border-t border-[#F5F0E8]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-600 text-sm">Hapus Akun</p>
                        <p className="text-xs text-[#9E9E9E]">Hapus akun dan semua data secara permanen</p>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium text-sm hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus Akun
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
      
<<<<<<< HEAD
      {/* Modal Konfirmasi Hapus Data */}
=======
      {/* Modal Konfirmasi Hapus Akun */}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#F5F0E8]">
<<<<<<< HEAD
              <h3 className="text-lg font-semibold text-red-600">Hapus Semua Data</h3>
              <p className="text-sm text-[#9E9E9E] mt-1">Tindakan ini tidak dapat dibatalkan</p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[#1B3A2D] text-sm">
                Semua pengaturan notifikasi dan password akan dihapus secara permanen.
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-2">
                  Ketik <span className="text-red-600">"HAPUS"</span> untuk konfirmasi
=======
              <h3 className="text-lg font-semibold text-red-600">Hapus Akun</h3>
              <p className="text-sm text-[#9E9E9E] mt-1">Tindakan ini tidak dapat dibatalkan</p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[#1B3A2D]">
                Semua data transaksi, circle tabungan, dan informasi akun Anda akan dihapus secara permanen.
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#9E9E9E] uppercase mb-2">
                  Ketik <span className="text-red-600">"HAPUS AKUN"</span> untuk konfirmasi
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
<<<<<<< HEAD
                  placeholder="HAPUS"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-red-500 outline-none"
=======
                  placeholder="HAPUS AKUN"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-red-500 outline-none transition"
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
<<<<<<< HEAD
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
=======
                  onClick={() => setShowDeleteConfirm(false)}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                  className="flex-1 px-4 py-3 border-2 border-[#E8E0D4] rounded-xl text-[#1B3A2D] font-medium hover:bg-[#F5F0E8] transition"
                >
                  Batal
                </button>
                <button
<<<<<<< HEAD
                  onClick={handleDeleteAllData}
                  disabled={deleteConfirmText !== 'HAPUS'}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  Hapus
=======
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount || deleteConfirmText !== 'HAPUS AKUN'}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deletingAccount ? 'Menghapus...' : 'Hapus Permanen'}
>>>>>>> a746e39ab2e663decaa161c14576cad2e38df54f
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}