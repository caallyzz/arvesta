import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, TrendingUp, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function InputField({ label, id, type = 'text', value, onChange, placeholder, icon: Icon, error, autoComplete }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div>
      <label htmlFor={id} className="input-label">{label}</label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-light pointer-events-none">
            <Icon className="w-4 h-4" />
          </span>
        )}
        <input
          id={id}
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`input-field ${Icon ? 'pl-10' : ''} ${isPassword ? 'pr-10' : ''} ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function LoginPage() {
  const { login, register, loading, error, setError, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'

  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated])

  const handleChange = (field) => (e) => {
    setForm(v => ({ ...v, [field]: e.target.value }))
    setFieldErrors(v => ({ ...v, [field]: '' }))
    setError(null)
  }

  const validate = () => {
    const errs = {}
    if (mode === 'register' && !form.username.trim()) errs.username = 'Username wajib diisi'
    if (!form.email.trim())    errs.email    = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Format email tidak valid'
    if (!form.password)        errs.password = 'Password wajib diisi'
    else if (form.password.length < 6) errs.password = 'Password minimal 6 karakter'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    if (mode === 'login') {
      const res = await login({ email: form.email, password: form.password })
      if (res.success) navigate('/dashboard', { replace: true })
    } else {
      const res = await register({ username: form.username, email: form.email, password: form.password })
      if (res.success) {
        setSuccess('Akun berhasil dibuat! Silakan login.')
        setMode('login')
        setForm(v => ({ ...v, password: '' }))
      }
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setFieldErrors({})
    setError(null)
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-hero-mesh flex items-center justify-center p-4">
      {/* decorative blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full bg-green-100/40 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full bg-yellow-100/40 blur-3xl pointer-events-none translate-x-1/4 translate-y-1/4" />

      <div className="w-full max-w-md animate-fade-up relative">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-float border border-gray-100 overflow-hidden">
          {/* Top brand bar */}
          <div className="bg-primary-700 px-8 pt-7 pb-6">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-white text-lg">Arvesta</span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-white">
              {mode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h1>
            <p className="text-green-200 text-sm mt-1">
              {mode === 'login'
                ? 'Masuk ke dashboard keuanganmu'
                : 'Kelola keuanganmu lebih cerdas bersama Arvesta'}
            </p>
          </div>

          <div className="px-8 py-7">
            {/* Tab switcher */}
            <div className="flex bg-surface-muted rounded-xl p-1 mb-6">
              {['login', 'register'].map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    mode === m
                      ? 'bg-white text-primary-700 shadow-card'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {m === 'login' ? 'Masuk' : 'Daftar'}
                </button>
              ))}
            </div>

            {/* Success msg */}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
                <span className="text-green-500">✓</span> {success}
              </div>
            )}

            {/* Global API error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {mode === 'register' && (
                <InputField
                  label="Username"
                  id="username"
                  value={form.username}
                  onChange={handleChange('username')}
                  placeholder="namapengguna"
                  icon={User}
                  error={fieldErrors.username}
                  autoComplete="username"
                />
              )}

              <InputField
                label="Alamat Email"
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="nama@domain.com"
                icon={Mail}
                error={fieldErrors.email}
                autoComplete="email"
              />

              <InputField
                label="Password"
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                icon={Lock}
                error={fieldErrors.password}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-primary-700 hover:underline">
                    Lupa Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {mode === 'login' ? 'Masuk...' : 'Mendaftar...'}
                  </span>
                ) : (
                  <>
                    {mode === 'login' ? 'Masuk ke Arvesta' : 'Buat Akun'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-ink-muted mt-5">
              {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-primary-700 font-semibold hover:underline"
              >
                {mode === 'login' ? 'Daftar di sini' : 'Masuk'}
              </button>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-4 mt-5 text-xs text-ink-light">
          <span className="flex items-center gap-1">🔒 Keamanan Bank Grade</span>
          <span>·</span>
          <span className="flex items-center gap-1">🔐 SSL Terenkripsi</span>
        </div>
      </div>
    </div>
  )
}
