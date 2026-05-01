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
    // Only count unpaid splits for balances
    const unpaidSplits = expense.splits?.filter((s) => !s.isPaid) || []
    
    // What the payer is owed (from unpaid splits)
    totalsPaid[expense.paidBy] += expense.amount
    
    // What each member owes (only unpaid amounts)
    unpaidSplits.forEach((split) => {
      totalsOwed[split.userId] += Number(split.shareAmount)
    })
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
      fromId: debtor.member.id,
      to: creditor.member.name,
      toId: creditor.member.id,
      amount: settled,
    })

    debtor.balance -= settled
    creditor.balance -= settled

    if (debtor.balance <= 0.01) i += 1
    if (creditor.balance <= 0.01) j += 1
  }

  return results
}

// Build all debts including paid ones for overview
export const buildAllDebts = (members, expenses) => {
  // Calculate total owed (including paid)
  const totalsPaid = Object.fromEntries(
    members.map((member) => [member.id, 0])
  )
  const totalsOwed = Object.fromEntries(
    members.map((member) => [member.id, 0])
  )

  expenses.forEach((expense) => {
    // All splits (both paid and unpaid)
    const allSplits = expense.splits || []
    
    // What the payer is owed (total)
    totalsPaid[expense.paidBy] += expense.amount
    
    // What each member owes (total)
    allSplits.forEach((split) => {
      totalsOwed[split.userId] += Number(split.shareAmount)
    })
  })

  const netBalances = {}
  members.forEach((member) => {
    const paid = totalsPaid[member.id] || 0
    const owed = totalsOwed[member.id] || 0
    netBalances[member.id] = paid - owed
  })

  // Build debt pairs from total balances
  const creditors = []
  const debtors = []

  members.forEach((member) => {
    const balance = Number((netBalances[member.id] || 0).toFixed(2))
    if (balance > 0.01) creditors.push({ member, balance })
    if (balance < -0.01) debtors.push({ member, balance: Math.abs(balance) })
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
      fromId: debtor.member.id,
      to: creditor.member.name,
      toId: creditor.member.id,
      amount: settled,
      isPaid: false, // Will be determined by checking unpaid splits
    })

    debtor.balance -= settled
    creditor.balance -= settled

    if (debtor.balance <= 0.01) i += 1
    if (creditor.balance <= 0.01) j += 1
  }

  return results
}

// Build exact debts per expense (no simplification)
export const buildExactDebts = (members, expenses) => {
  // Create a map for quick member lookup
  const memberMap = Object.fromEntries(
    members.map((member) => [member.id, member])
  )

  const debts = []

  expenses.forEach((expense) => {
    const creditorId = expense.paidBy
    const creditor = memberMap[creditorId]
    
    if (!creditor) return

    const splits = expense.splits || []

    splits.forEach((split) => {
      // Skip if the split is for the payer themselves
      if (split.userId === creditorId) return

      // Skip zero or negative amounts
      const shareAmount = Number(split.shareAmount)
      if (shareAmount <= 0) return

      const debtor = memberMap[split.userId]
      if (!debtor) return

      debts.push({
        from: debtor.name,
        fromId: debtor.id,
        to: creditor.name,
        toId: creditor.id,
        amount: shareAmount,
        isPaid: split.isPaid,
      })
    })
  })

  // Optional: Group identical debts (same fromId and toId) and sum amounts
  const groupedDebts = []
  const debtMap = new Map()

  debts.forEach((debt) => {
    const key = `${debt.fromId}-${debt.toId}`
    
    if (debtMap.has(key)) {
      const existing = debtMap.get(key)
      existing.amount += debt.amount
      // If any split is unpaid, mark as unpaid
      if (!debt.isPaid) {
        existing.isPaid = false
      }
    } else {
      debtMap.set(key, { ...debt })
    }
  })

  debtMap.forEach((value) => {
    groupedDebts.push(value)
  })

  return groupedDebts
}
