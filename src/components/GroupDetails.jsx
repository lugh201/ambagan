import { useState } from 'react'
import BalanceSummary from './BalanceSummary'
import ExpenseList from './ExpenseList'
import AddExpenseForm from './AddExpenseForm'
import ContributionPieChart from './ContributionPieChart'
import {
  buildContributionData,
  buildExactDebts,
  buildOutstandingDebts,
  formatCurrency,
} from '../utils/finance'

const GroupDetails = ({
  group,
  expenses,
  // invites = [],
  currentUser,
  onAddExpense,
  onDeleteExpense,
  onMarkPaid,
  onDeleteGroup,
  onMarkDebtPaid,
  // onInvite,
}) => {
  const [copied, setCopied] = useState(false)
  // const [inviteEmail, setInviteEmail] = useState('')
  // const [inviteStatus, setInviteStatus] = useState('idle')
  const contributions = buildContributionData(group.members, expenses)
  const allDebts = buildExactDebts(group.members, expenses)
  const outstandingDebts = buildOutstandingDebts(group.members, expenses)

  const inviteLink = `${window.location.origin}/join/${group.inviteCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const handleDeleteGroup = async () => {
    if (window.confirm('Burahin ang group na ito? Mawawala lahat ng gastos at miyembro.')) {
      await onDeleteGroup()
    }
  }

  const handleMarkDebtPaid = async (debtorId, creditorId) => {
    if (window.confirm('Markahan ang utang na ito bilang bayad?')) {
      await onMarkDebtPaid(debtorId, creditorId)
    }
  }

  // const handleInvite = async (event) => {
  //   event.preventDefault()
  //   if (!inviteEmail.trim() || !onInvite) return
  //   setInviteStatus('loading')
  //   try {
  //     await onInvite(inviteEmail.trim())
  //     setInviteEmail('')
  //     setInviteStatus('sent')
  //     window.setTimeout(() => setInviteStatus('idle'), 2000)
  //   } catch (error) {
  //     setInviteStatus('error')
  //   }
  // }

  return (
    <section className="group-details">
      <header className="card group-hero">
        <div>
          <div className="group-title-row">
            <h2>{group.name}</h2>
            {group.createdByUserId === currentUser?.id && (
              <button type="button" className="btn-small danger" onClick={handleDeleteGroup}>
                Burahin
              </button>
            )}
          </div>
          <div className="invite-row">
            <label className="muted">Invite link</label>
            <div className="invite-actions">
              <input type="text" value={inviteLink} readOnly />
              <button type="button" className="ghost" onClick={handleCopy}>
                {copied ? 'Nakopya!' : 'Copy link'}
              </button>
            </div>
            <span className="muted">Code: {group.inviteCode}</span>
          </div>
          {/* <form className="stack" onSubmit={handleInvite}>
            <label>
              Invite by email
              <input
                type="email"
                placeholder="kaibigan@ambagan.ph"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                required
              />
            </label>
            <button type="submit" className="ghost" disabled={inviteStatus === 'loading'}>
              {inviteStatus === 'loading' ? 'Sending...' : 'Send invite'}
            </button>
            {inviteStatus === 'sent' ? (
              <span className="muted">Invite sent!</span>
            ) : null}
            {inviteStatus === 'error' ? (
              <span className="muted">Failed to send invite.</span>
            ) : null}
          </form>
          {invites.length > 0 ? (
            <div className="pending-invites">
              <p className="muted">Pending invites</p>
              {invites.map((invite) => (
                <div key={invite.id} className="invite-row">
                  <span>{invite.email}</span>
                  <span className="muted">Pending</span>
                </div>
              ))}
            </div>
          ) : null} */}
        </div>
        <div className="member-chips">
          {group.members.map((member) => (
            <span key={member.id} className="chip">
              {member.name}
            </span>
          ))}
        </div>
      </header>

      <div className="grid-two">
        <BalanceSummary currentUser={currentUser} debts={outstandingDebts} />
        <ContributionPieChart data={contributions} />
      </div>

      <section className="card">
        <div className="section-head">
          <h3>Sino ang may utang?</h3>
          <span className="muted">Auto compute</span>
        </div>
        {allDebts.length === 0 ? (
          <p className="muted">Pantay-pantay na ang ambagan.</p>
        ) : (
          <div className="debts">
            {allDebts.map((debt, index) => {
              const isCurrentUserCreditor = debt.toId === currentUser?.id

              return (
                <div key={`${debt.from}-${debt.to}-${index}`} className="debt">
                  <span>{debt.from}</span>
                  <span className="muted">may utang kay</span>
                  <span>{debt.to}</span>
                  <strong>{formatCurrency(debt.amount)}</strong>
                  {debt.isPaid ? (
                    <span className="badge-paid">PAID</span>
                  ) : isCurrentUserCreditor ? (
                    <button
                      type="button"
                      className="btn-small ghost"
                      onClick={() => {
                        handleMarkDebtPaid(debt.fromId, debt.toId)
                      }}
                    >
                      Bayad na
                    </button>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="grid-two">
        <AddExpenseForm
          members={group.members}
          currentUser={currentUser}
          onAddExpense={onAddExpense}
          disabled={!group}
        />
        <ExpenseList
          expenses={expenses}
          members={group.members}
          currentUser={currentUser}
          onDeleteExpense={onDeleteExpense}
          onMarkPaid={onMarkPaid}
        />
      </div>
    </section>
  )
}

export default GroupDetails
