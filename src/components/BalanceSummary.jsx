import { formatCurrency } from '../utils/finance'

const BalanceSummary = ({ currentUser, balances }) => {
  const balance = balances[currentUser.id] || 0
  const owes = balance < 0 ? Math.abs(balance) : 0
  const gets = balance > 0 ? balance : 0

  return (
    <section className="card balance-summary">
      <h3>Balance mo</h3>
      <div className="balance-grid">
        <div className="balance-pill negative">
          <span>May utang ka</span>
          <strong>{formatCurrency(owes)}</strong>
        </div>
        <div className="balance-pill positive">
          <span>May utang sa'yo</span>
          <strong>{formatCurrency(gets)}</strong>
        </div>
      </div>
    </section>
  )
}

export default BalanceSummary
