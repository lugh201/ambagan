import { formatCurrency } from '../utils/finance'

const ExpenseList = ({ expenses, members, currentUser, onDeleteExpense, onMarkPaid }) => {
  const getName = (id) => members.find((member) => member.id === id)?.name

  const handleDelete = async (expenseId) => {
    if (window.confirm('Burahin ang gastos na ito?')) {
      await onDeleteExpense(expenseId)
    }
  }

  const handleMarkPaid = async (expenseId, userId) => {
    if (window.confirm('Markahan bilang bayad?')) {
      await onMarkPaid(expenseId, userId)
    }
  }

  return (
    <section className="card">
      <div className="section-head">
        <h3>Mga gastos</h3>
        <span className="muted">{expenses.length} entries</span>
      </div>

      {expenses.length === 0 ? (
        <p className="muted">Wala pang gastos. Simulan na ang ambagan!</p>
      ) : (
        <div className="expense-list">
          {expenses.map((expense) => (
            <article key={expense.id} className="expense-item">
              <div>
                <strong>{expense.description}</strong>
                <span className="muted">
                  {getName(expense.paidBy)} • {expense.createdAt}
                </span>
              </div>
              <div className="expense-actions">
                <div className="expense-amount">
                  {formatCurrency(expense.amount)}
                </div>
                {/* Paid button - only for the payer */}
                {expense.paidBy === currentUser?.id && expense.splits?.some((s) => !s.isPaid && s.userId !== currentUser?.id) && (
                  <div className="paid-dropdown">
                    <button type="button" className="btn-small ghost">
                      Bayad
                    </button>
                    <div className="paid-menu">
                      {expense.splits
                        ?.filter((s) => !s.isPaid && s.userId !== currentUser?.id)
                        .map((split) => (
                          <button
                            key={split.userId}
                            type="button"
                            className="paid-item"
                            onClick={() => handleMarkPaid(expense.id, split.userId)}
                          >
                            {getName(split.userId)} - Bayad na
                          </button>
                        ))}
                    </div>
                  </div>
                )}
                {/* Delete button - only for the creator */}
                {expense.paidBy === currentUser?.id && (
                  <button
                    type="button"
                    className="btn-small danger"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default ExpenseList
