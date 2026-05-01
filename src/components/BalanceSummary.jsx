import { formatCurrency } from '../utils/finance'

const BalanceSummary = ({ currentUser, debts = [] }) => {
  const currentUserId = currentUser?.id
  const youOwe = debts.filter((debt) => debt.fromId === currentUserId)
  const owedToYou = debts.filter((debt) => debt.toId === currentUserId)
  const owes = youOwe.reduce((total, debt) => total + Number(debt.amount), 0)
  const gets = owedToYou.reduce((total, debt) => total + Number(debt.amount), 0)

  return (
    <section className="card balance-summary">
      <h3>Balance mo</h3>
      <div className="balance-grid">
        <div className="balance-section">
          <div className="balance-pill negative">
            <span>May utang ka</span>
            <strong>{formatCurrency(owes)}</strong>
          </div>
          {youOwe.length > 0 ? (
            <div className="balance-person-list">
              {youOwe.map((debt) => (
                <div key={`${debt.fromId}-${debt.toId}`} className="balance-person-row">
                  <span>Kay {debt.to}</span>
                  <strong>{formatCurrency(debt.amount)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted balance-empty">Wala kang utang ngayon.</p>
          )}
        </div>

        <div className="balance-section">
          <div className="balance-pill positive">
            <span>May utang sa'yo</span>
            <strong>{formatCurrency(gets)}</strong>
          </div>
          {owedToYou.length > 0 ? (
            <div className="balance-person-list">
              {owedToYou.map((debt) => (
                <div key={`${debt.fromId}-${debt.toId}`} className="balance-person-row">
                  <span>{debt.from}</span>
                  <strong>{formatCurrency(debt.amount)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted balance-empty">Walang may utang sa'yo ngayon.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default BalanceSummary
