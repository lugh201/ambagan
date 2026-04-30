import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('auth_user') || 'null')
  } catch {
    return null
  }
}

const readStoredToken = () => localStorage.getItem('auth_token')

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(readStoredToken)

  const login = (nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem('auth_user', JSON.stringify(nextUser))
    localStorage.setItem('auth_token', nextToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthed: Boolean(token),
      login,
      logout,
    }),
    [user, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
