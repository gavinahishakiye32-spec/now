import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        if (res.data.loggedIn) setUser({ username: res.data.username, role: res.data.role })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password })
    setUser({ username: res.data.username, role: res.data.role })
  }

  const register = async (username, password) => {
    const res = await api.post('/auth/register', { username, password })
    setUser({ username: res.data.username, role: res.data.role })
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
