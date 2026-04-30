import { Link } from 'react-router-dom'

const AuthPanel = ({ currentUser, onLogout }) => {
  return (
    <section className="card auth-card">
      <h2>Account</h2>
      <p className="muted">Verified users lang ang makakapasok.</p>

      {currentUser ? (
        <div className="auth-summary">
          <div>
            <span className="pill">Active</span>
            <strong>{currentUser.name || currentUser.email}</strong>
            <p className="muted">{currentUser.email}</p>
          </div>
          <button type="button" className="ghost" onClick={onLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="auth-actions">
          <Link className="primary link-button" to="/login">
            Login
          </Link>
          <Link className="ghost link-button" to="/register">
            Register
          </Link>
        </div>
      )}
    </section>
  )
}

export default AuthPanel
