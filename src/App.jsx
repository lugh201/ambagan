import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyPage from './pages/VerifyPage'
import JoinGroupPage from './pages/JoinGroupPage'
import GroupsPage from './pages/GroupsPage'
import InviteAcceptPage from './pages/InviteAcceptPage'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Ambagan App</p>
          <h1>Ambagan made klaro.</h1>
          <p className="muted">
            Quick ambagan tracker para sa barkada, pamilya, at officemates.
          </p>
        </div>
        <div className="header-badge">
          <span>Group Expense Sharing</span>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/groups" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/invite/:token" element={<InviteAcceptPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:groupId" element={<GroupsPage />} />
            <Route path="/join/:code" element={<JoinGroupPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}

export default App
