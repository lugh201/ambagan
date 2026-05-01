import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthPanel from '../components/AuthPanel'
import GroupList from '../components/GroupList'
import GroupDetails from '../components/GroupDetails'
import {
  createExpense,
  createGroup,
  deleteExpense,
  deleteGroup,
  fetchExpenses,
  fetchGroupDetails,
  fetchGroups,
  fetchInvites,
  joinGroupByLink,
  createInvite,
  markExpensePaid,
  markDebtPaid,
} from '../services/api'
import { useAuth } from '../context/AuthContext'

const GroupsPage = () => {
  const { user, logout } = useAuth()
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [activeGroupId, setActiveGroupId] = useState(null)
  const [activeGroup, setActiveGroup] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const loadGroups = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchGroups()
        setGroups(data)
        const nextGroupId = groupId || data[0]?.id || null
        setActiveGroupId(nextGroupId)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load groups')
      } finally {
        setLoading(false)
      }
    }

    loadGroups()
  }, [user, groupId])

  useEffect(() => {
    if (!activeGroupId) {
      setActiveGroup(null)
      setExpenses([])
      setInvites([])
      return
    }

    const loadDetails = async () => {
      setLoading(true)
      setError('')
      try {
        const groupData = await fetchGroupDetails(activeGroupId)
        const expenseData = await fetchExpenses(activeGroupId)
        const inviteData = await fetchInvites(activeGroupId)
        setActiveGroup(groupData)
        setExpenses(expenseData)
        setInvites(inviteData)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load group')
      } finally {
        setLoading(false)
      }
    }

    loadDetails()
  }, [activeGroupId])

  const memberUser = useMemo(() => {
    if (!user || !activeGroup) return null
    return (
      activeGroup.members.find((member) => member.id === user.id) || {
        id: user.id,
        name: user.name || 'Ikaw',
        email: user.email,
      }
    )
  }, [user, activeGroup])

  const handleSelect = (nextId) => {
    setActiveGroupId(nextId)
    navigate(`/groups/${nextId}`)
  }

  const handleCreateGroup = async (name) => {
    setLoading(true)
    setError('')
    try {
      const created = await createGroup(name)
      setGroups((prev) => [created, ...prev])
      setActiveGroupId(created.id)
      navigate(`/groups/${created.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async (link) => {
    setLoading(true)
    setError('')
    try {
      const joined = await joinGroupByLink(link)
      setGroups((prev) => {
        const exists = prev.some((group) => group.id === joined.id)
        return exists ? prev : [joined, ...prev]
      })
      setActiveGroupId(joined.id)
      navigate(`/groups/${joined.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group')
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (expense) => {
    if (!activeGroup) return
    setLoading(true)
    setError('')
    try {
      const created = await createExpense(activeGroup.id, expense)
      setExpenses((prev) => [created, ...prev])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (email) => {
    if (!activeGroup) return
    await createInvite(activeGroup.id, email)
    const inviteData = await fetchInvites(activeGroup.id)
    setInvites(inviteData)
  }

  const handleDeleteExpense = async (expenseId) => {
    if (!activeGroup) return
    setLoading(true)
    setError('')
    try {
      await deleteExpense(activeGroup.id, expenseId)
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (expenseId, userId) => {
    if (!activeGroup) return
    setLoading(true)
    setError('')
    try {
      await markExpensePaid(activeGroup.id, expenseId, userId)
      // Refresh expenses to get updated splits
      const expenseData = await fetchExpenses(activeGroup.id)
      setExpenses(expenseData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as paid')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGroup = async () => {
    if (!activeGroup) return
    setLoading(true)
    setError('')
    try {
      await deleteGroup(activeGroup.id)
      setGroups((prev) => prev.filter((g) => g.id !== activeGroup.id))
      setActiveGroupId(null)
      setActiveGroup(null)
      navigate('/groups')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete group')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkDebtPaid = async (debtorId, creditorId) => {
    if (!activeGroup) return
    setLoading(true)
    setError('')
    try {
      await markDebtPaid(activeGroup.id, debtorId, creditorId)
      // Refresh expenses to get updated splits
      const expenseData = await fetchExpenses(activeGroup.id)
      setExpenses(expenseData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark debt as paid')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AuthPanel currentUser={user} onLogout={logout} />

      {error ? <div className="card error-card">{error}</div> : null}

      <div className="layout">
        <aside>
          <GroupList
            groups={groups}
            activeGroupId={activeGroupId}
            onSelect={handleSelect}
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
            disabled={loading}
          />
        </aside>

        <section className="content">
          {loading && !activeGroup ? (
            <section className="card empty">
              <h2>Sandali lang...</h2>
              <p className="muted">Kinukuha ang latest na ambagan.</p>
            </section>
          ) : groups.length === 0 ? (
            <section className="card empty">
              <h2>Wala pang grupo</h2>
              <p className="muted">Gumawa o sumali sa grupo.</p>
            </section>
          ) : activeGroup && memberUser ? (
            <GroupDetails
              group={activeGroup}
              expenses={expenses}
              invites={invites}
              currentUser={memberUser}
              onAddExpense={handleAddExpense}
              onInvite={handleInvite}
              onDeleteExpense={handleDeleteExpense}
              onMarkPaid={handleMarkPaid}
              onDeleteGroup={handleDeleteGroup}
              onMarkDebtPaid={handleMarkDebtPaid}
            />
          ) : (
            <section className="card empty">
              <h2>Walang group selected</h2>
              <p className="muted">Pumili o gumawa ng ambagan.</p>
            </section>
          )}
        </section>
      </div>
    </>
  )
}

export default GroupsPage
