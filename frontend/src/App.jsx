import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import MainLayout  from './layouts/MainLayout'
import LandingPage from './pages/LandingPage'
import LoginPage   from './pages/LoginPage'
import Dashboard   from './pages/Dashboard'
import PelacakanUang    from './pages/PelacakanUang'
import TabunganBersama  from './pages/TabunganBersama'
import ScanStruk        from './pages/ScanStruk'
import Profil           from './pages/Profil'
import Notifikasi       from './pages/Notifikasi'
import Pengaturan       from './pages/Pengaturan'

// ── Protected Route ───────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// ── Guest Route (redirect ke dashboard jika sudah login) ─────────────────────
function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={
            <GuestRoute><LoginPage /></GuestRoute>
          } />

          {/* Protected — semua di bawah MainLayout */}
          <Route element={
            <ProtectedRoute><MainLayout /></ProtectedRoute>
          }>
            <Route path="/dashboard"         element={<Dashboard />} />
            <Route path="/pelacakan"         element={<PelacakanUang />} />
            <Route path="/tabungan-bersama"  element={<TabunganBersama />} />
            <Route path="/scan"              element={<ScanStruk />} />
            <Route path="/notifikasi"        element={<Notifikasi />} />
            <Route path="/profil"            element={<Profil />} />
            <Route path="/pengaturan"       element={<Pengaturan />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
