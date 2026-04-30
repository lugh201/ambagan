import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyUser } from '../services/api'

const VerifyPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('missing')
      return
    }

    const verify = async () => {
      try {
        await verifyUser(token)
        setStatus('success')
        window.setTimeout(() => {
          navigate('/login', { replace: true })
        }, 1200)
      } catch (error) {
        setStatus('failed')
      }
    }

    verify()
  }, [navigate, searchParams])

  return (
    <section className="auth-page">
      <div className="card auth-card">
        <h2>Verify Email</h2>
        {status === 'loading' ? (
          <p className="muted">Vine-verify pa ang account mo...</p>
        ) : null}
        {status === 'missing' ? (
          <p className="muted">Missing verification token.</p>
        ) : null}
        {status === 'failed' ? (
          <p className="muted">Invalid or expired token.</p>
        ) : null}
        {status === 'success' ? (
          <div className="notice">
            <p className="muted">Verified na ang account mo. Redirecting...</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default VerifyPage
