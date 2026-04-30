export const formatCurrency = (value) => {
  const amount = Number(value || 0)
  const formatted = amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `₱${formatted}`
}

export const calculateBalances = (members, expenses) => {
  const totalsPaid = Object.fromEntries(
    members.map((member) => [member.id, 0])
  )
  const totalsOwed = Object.fromEntries(
    members.map((member) => [member.id, 0])
  )

  expenses.forEach((expense) => {
    const split = expense.amount / members.length
    members.forEach((member) => {
      totalsOwed[member.id] += split
    })
    totalsPaid[expense.paidBy] += expense.amount
  })

  const netBalances = {}
  members.forEach((member) => {
    const paid = totalsPaid[member.id] || 0
    const owed = totalsOwed[member.id] || 0
    netBalances[member.id] = paid - owed
  })

  return { totalsPaid, totalsOwed, netBalances }
}

export const buildContributionData = (members, expenses) => {
  const { totalsPaid } = calculateBalances(members, expenses)
  return members.map((member) => ({
    name: member.name,
    value: Number((totalsPaid[member.id] || 0).toFixed(2)),
  }))
}

export const buildDebtPairs = (members, netBalances) => {
  const creditors = []
  const debtors = []

  members.forEach((member) => {
    const balance = Number((netBalances[member.id] || 0).toFixed(2))
    if (balance > 0) creditors.push({ member, balance })
    if (balance < 0) debtors.push({ member, balance: Math.abs(balance) })
  })

  const results = []
  let i = 0
  let j = 0

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    const settled = Math.min(debtor.balance, creditor.balance)

    results.push({
      from: debtor.member.name,
      to: creditor.member.name,
      amount: settled,
    })

    debtor.balance -= settled
    creditor.balance -= settled

    if (debtor.balance <= 0.01) i += 1
    if (creditor.balance <= 0.01) j += 1
  }

  return results
}
