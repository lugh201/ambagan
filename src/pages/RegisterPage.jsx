import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../services/api'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('loading')

    try {
      await registerUser({ email, name, password })
      setStatus('sent')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      setStatus('idle')
    }
  }

  return (
    <section className="auth-page">
      <div className="card auth-card">
        <h2>Register</h2>
        <p className="muted">Magpadala tayo ng verification link sa email mo.</p>

        {status === 'sent' ? (
          <div className="notice">
            <p className="muted">Check your inbox para sa verification link.</p>
            <Link className="ghost link-button" to="/login">
              Proceed to login
            </Link>
          </div>
        ) : (
          <form className="stack" onSubmit={handleSubmit}>
            <label>
              Name (optional)
              <input
                type="text"
                placeholder="Halimbawa: Louie"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
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
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="primary" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sandali...' : 'Register'}
            </button>
          </form>
        )}

        <div className="auth-actions">
          <span className="muted">May account ka na?</span>
          <Link className="ghost link-button" to="/login">
            Login
          </Link>
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
