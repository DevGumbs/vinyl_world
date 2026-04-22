import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import type { AuthUser } from './authTypes'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  refresh: () => Promise<void>
  login: (args: { email: string; password: string }) => Promise<void>
  register: (args: {
    email: string
    username: string
    password: string
    city: string
    state: string
  }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    try {
      const res = await api<{ user: AuthUser }>('/auth/me')
      setUser(res.user)
    } catch {
      setUser(null)
    }
  }

  async function login(args: { email: string; password: string }) {
    const res = await api<{ user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(args),
    })
    setUser(res.user)
  }

  async function register(args: {
    email: string
    username: string
    password: string
    city: string
    state: string
  }) {
    const res = await api<{ user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(args),
    })
    setUser(res.user)
  }

  async function logout() {
    await api<{ ok: boolean }>('/auth/logout', { method: 'POST' })
    setUser(null)
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      await refresh()
      if (mounted) setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, refresh, login, register, logout }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

