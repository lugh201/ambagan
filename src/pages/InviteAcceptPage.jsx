import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { acceptInvite, getInvite } from '../services/api'
import { useAuth } from '../context/AuthContext'

const InviteAcceptPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { isAuthed } = useAuth()
  const [status, setStatus] = useState('loading')
  const [invite, setInvite] = useState(null)

  useEffect(() => {
    if (!token) {
      setStatus('missing')
      return
    }

    const loadInvite = async () => {
      try {
        const data = await getInvite(token)
        setInvite(data)
        setStatus('ready')
      } catch (error) {
        setStatus('failed')
      }
    }

    loadInvite()
  }, [token])

  useEffect(() => {
    if (!token || isAuthed || status !== 'ready') return
    localStorage.setItem('pending_invite_token', token)
  }, [isAuthed, status, token])

  useEffect(() => {
    if (!token || !isAuthed || status !== 'ready') return

    const accept = async () => {
      try {
        const accepted = await acceptInvite(token)
        localStorage.removeItem('pending_invite_token')
        navigate(`/groups/${accepted.groupId}`, { replace: true })
      } catch (error) {
        setStatus('accept-failed')
      }
    }

    accept()
  }, [isAuthed, navigate, status, token])

  if (status === 'missing') {
    return (
      <section className="auth-page">
        <div className="card auth-card">
          <h2>Invite</h2>
          <p className="muted">Missing invite token.</p>
        </div>
      </section>
    )
  }

  if (status === 'failed') {
    return (
      <section className="auth-page">
        <div className="card auth-card">
          <h2>Invite</h2>
          <p className="muted">Invite not found or expired.</p>
        </div>
      </section>
    )
  }

  if (!isAuthed && status === 'ready') {
    if (invite?.status && invite.status !== 'PENDING') {
      return (
        <section className="auth-page">
          <div className="card auth-card">
            <h2>Invite</h2>
            <p className="muted">Invite is {invite.status.toLowerCase()}.</p>
          </div>
        </section>
      )
    }
    return (
      <section className="auth-page">
        <div className="card auth-card">
          <h2>Invite to {invite?.group?.name}</h2>
          <p className="muted">Login or register with {invite?.email} to accept.</p>
          <div className="auth-actions">
            <Link className="primary link-button" to="/login">
              Login
            </Link>
            <Link className="ghost link-button" to="/register">
              Register
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="auth-page">
      <div className="card auth-card">
        <h2>Invite</h2>
        <p className="muted">
          {status === 'accept-failed'
            ? 'Unable to accept invite. Make sure your email matches.'
            : 'Accepting invite...'}
        </p>
      </div>
    </section>
  )
}

export default InviteAcceptPage
