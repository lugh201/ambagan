import { useEffect, useState } from 'react'

const AddExpenseForm = ({ members, currentUser, onAddExpense, disabled }) => {
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(currentUser?.id || members[0]?.id || '')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!members.length) return
    setPaidBy((prev) => prev || currentUser?.id || members[0].id)
  }, [members, currentUser])

  const handleSubmit = (event) => {
    event.preventDefault()
    const parsed = Number(amount)
    if (!parsed || !paidBy) return

    onAddExpense({
      amount: parsed,
      paidBy,
      description: description.trim() || 'Walang label',
    })

    setAmount('')
    setDescription('')
  }

  return (
    <section className="card">
      <div className="section-head">
        <h3>Magdagdag ng gastos</h3>
        <span className="muted">Auto split sa lahat</span>
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="1500"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            disabled={disabled}
            required
          />
        </label>

        <label>
          Paid by
          <select
            value={paidBy}
            onChange={(event) => setPaidBy(event.target.value)}
            disabled={disabled}
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Description
          <input
            type="text"
            placeholder="Halimbawa: Merienda"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={disabled}
          />
        </label>

        <button type="submit" className="primary" disabled={disabled}>
          I-save ang gastos
        </button>
      </form>
    </section>
  )
}

export default AddExpenseForm
