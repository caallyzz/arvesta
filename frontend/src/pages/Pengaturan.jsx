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
  
  // State untuk notifikasi
  const [notifSettings, setNotifSettings] = useState({
    email_transaksi: true,
    email_pengingat: true,
    email_promosi: false,
    push_transaksi: true,
    push_pengingat: true,
    push_promosi: false
  })
  
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
  const [passwordMsg, setPasswordMsg] = useState(null)
  
  // State untuk hapus data
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  
  // Toast notification
  const [toast, setToast] = useState(null)
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  // Simpan notifikasi ke localStorage
  const handleSaveNotifications = () => {
    localStorage.setItem('notifikasi', JSON.stringify(notifSettings))
    showToast('Pengaturan notifikasi berhasil disimpan', 'success')
  }
  
  // Ganti password
  const handleChangePassword = () => {
    if (passwordForm.new_password.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password baru minimal 6 karakter' })
      return
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi password tidak cocok' })
      return
    }
    
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
  ]
  
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
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
                </button>
              ))}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            
            {/* TAB NOTIFIKASI */}
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
                        { key: 'email_transaksi', label: 'Transaksi baru' },
                        { key: 'email_pengingat', label: 'Pengingat menabung' },
                        { key: 'email_promosi', label: 'Promosi & penawaran' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between py-2 cursor-pointer">
                          <span className="text-sm text-[#1B3A2D]">{item.label}</span>
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
                        { key: 'push_transaksi', label: 'Transaksi baru' },
                        { key: 'push_pengingat', label: 'Pengingat menabung' },
                        { key: 'push_promosi', label: 'Promosi & update' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between py-2 cursor-pointer">
                          <span className="text-sm text-[#1B3A2D]">{item.label}</span>
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
                    className="w-full md:w-auto px-6 py-2 bg-[#1B3A2D] text-white rounded-xl font-medium text-sm hover:bg-[#2D5040] transition"
                  >
                    <Save className="w-4 h-4 inline mr-2" /> Simpan Pengaturan
                  </button>
                </div>
              </div>
            )}
            
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
                  </button>
                </div>
              </div>
            )}
            
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
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
      
      {/* Modal Konfirmasi Hapus Data */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#F5F0E8]">
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
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  placeholder="HAPUS"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E0D4] focus:border-red-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
                  className="flex-1 px-4 py-3 border-2 border-[#E8E0D4] rounded-xl text-[#1B3A2D] font-medium hover:bg-[#F5F0E8] transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAllData}
                  disabled={deleteConfirmText !== 'HAPUS'}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}