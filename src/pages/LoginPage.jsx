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
      </div>
    </section>
  )
}

export default LoginPage
