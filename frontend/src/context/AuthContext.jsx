import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'
import { getErrorMessage } from '../utils/mockData'

const AuthContext = createContext(null)

const TOKEN_KEY = 'arvesta_token'
const USER_KEY  = 'arvesta_user'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [token,   setToken]   = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // ── Persist token + user ────────────────────────────────────────────────────
  const saveSession = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setToken(token)
    setUser(userData)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  // ── Verify token on mount ───────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return
    let cancelled = false
    authAPI.getProfile()
      .then(({ data }) => {
        if (!cancelled) setUser(data.user || data.data || data)
      })
      .catch(() => {
        if (!cancelled) clearSession()
      })
    return () => { cancelled = true }
  }, []) // eslint-disable-line

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authAPI.login({ email, password })
      // Backend biasanya: { token, user } atau { data: { token, user } }
      const tok  = data.token  || data.data?.token
      const usr  = data.user   || data.data?.user  || data.data
      if (!tok) throw new Error('Token tidak ditemukan dalam response')
      saveSession(tok, usr)
      return { success: true }
    } catch (err) {
      const msg = getErrorMessage(err)
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [saveSession])

  // ── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(async ({ username, email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authAPI.register({ username, email, password })
      const tok = data.token || data.data?.token
      const usr = data.user  || data.data?.user || data.data
      if (tok) saveSession(tok, usr)
      return { success: true }
    } catch (err) {
      const msg = getErrorMessage(err)
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [saveSession])

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  // ── Refresh profile ─────────────────────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await authAPI.getProfile()
      const usr = data.user || data.data || data
      setUser(usr)
      localStorage.setItem(USER_KEY, JSON.stringify(usr))
    } catch { /* silent */ }
  }, [])

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    refreshProfile,
    setError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus digunakan di dalam AuthProvider')
  return ctx
}
