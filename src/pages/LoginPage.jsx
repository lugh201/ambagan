import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { acceptInvite, loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      login(data.user, data.token)
      const pendingInvite = localStorage.getItem('pending_invite_token')
      if (pendingInvite) {
        try {
          const accepted = await acceptInvite(pendingInvite)
          localStorage.removeItem('pending_invite_token')
          navigate(`/groups/${accepted.groupId}`)
          return
        } catch (inviteError) {
          localStorage.removeItem('pending_invite_token')
        }
      }
      navigate('/groups')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="card auth-card">
        <h2>Login</h2>
        <p className="muted">Verified email lang ang puwede mag-login.</p>

        <form className="stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="halimbawa@ambagan.ph"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="Ilagay ang password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Sandali...' : 'Login'}
          </button>
        </form>

        <div className="auth-actions">
          <span className="muted">Wala pang account?</span>
          <Link className="ghost link-button" to="/register">
            Register
          </Link>
        </div>

        {/* TEMP: Show all relevant environment variables for testing */}
        <div className="env-debug" style={{ marginBottom: 16, background: '#f8f8f8', padding: 8, borderRadius: 4 }}>
          <div><b>VITE_API_URL:</b> {import.meta.env.VITE_API_URL || 'not set'}</div>
          <div><b>FRONTEND_URL:</b> {import.meta.env.FRONTEND_URL || 'not set'}</div>
          <div><b>NODE_ENV:</b> {import.meta.env.MODE}</div>
          <div><b>DATABASE_URL:</b> {import.meta.env.DATABASE_URL ? 'set' : 'not set'}</div>
          <div><b>DIRECT_URL:</b> {import.meta.env.DIRECT_URL ? 'set' : 'not set'}</div>
          <div><b>JWT_SECRET:</b> {import.meta.env.JWT_SECRET ? 'set' : 'not set'}</div>
          <div><b>RESEND_API_KEY:</b> {import.meta.env.RESEND_API_KEY ? 'set' : 'not set'}</div>
          <div><b>RESEND_FROM:</b> {import.meta.env.RESEND_FROM ? 'set' : 'not set'}</div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
