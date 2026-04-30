import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { joinGroupByCode } from '../services/api'

const JoinGroupPage = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!code) {
      setStatus('missing')
      return
    }

    const join = async () => {
      try {
        const group = await joinGroupByCode(code)
        setStatus('success')
        navigate(`/groups/${group.id}`)
      } catch (error) {
        setStatus('failed')
      }
    }

    join()
  }, [code, navigate])

  return (
    <section className="auth-page">
      <div className="card auth-card">
        <h2>Join Group</h2>
        {status === 'loading' ? <p className="muted">Joining group...</p> : null}
        {status === 'missing' ? (
          <p className="muted">Missing invite code.</p>
        ) : null}
        {status === 'failed' ? (
          <p className="muted">Invite code not found.</p>
        ) : null}
        {status === 'success' ? (
          <p className="muted">Success! Redirecting...</p>
        ) : null}
      </div>
    </section>
  )
}

export default JoinGroupPage
