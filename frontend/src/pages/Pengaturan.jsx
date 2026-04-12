import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Menu } from 'lucide-react'

export default function Pengaturan() {
  const { toggleSidebar } = useOutletContext()

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pengaturan</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola preferensi akun dan aplikasi.</p>
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden btn-ghost p-2 rounded-xl border border-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-sm border border-slate-200">
        <p className="text-slate-600">Halaman pengaturan belum tersedia, tapi menu sidebar sudah siap.</p>
      </div>
    </div>
  )
}
