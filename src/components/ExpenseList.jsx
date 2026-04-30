import { formatCurrency } from '../utils/finance'

const ExpenseList = ({ expenses, members }) => {
  const getName = (id) => members.find((member) => member.id === id)?.name

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
              <div className="expense-amount">
                {formatCurrency(expense.amount)}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default ExpenseList
