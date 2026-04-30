import express from 'express'
import crypto from 'crypto'
import { Prisma } from '@prisma/client'
import prisma from '../lib/prisma.js'
import { sendInviteEmail } from '../lib/email.js'
import { requireAuth } from '../lib/auth.js'

const router = express.Router()

router.use(requireAuth)

const normalizeMember = (member) => ({
  id: member.user.id,
  name: member.user.name || member.user.email.split('@')[0] || 'Ikaw',
  email: member.user.email,
})

const serializeExpense = (expense) => ({
  id: expense.id,
  amount: Number(expense.amount),
  paidBy: expense.paidByUserId,
  description: expense.description,
  createdAt: expense.createdAt.toISOString().slice(0, 10),
})

const ensureMember = async (groupId, userId) => {
  return prisma.groupMember.findFirst({ where: { groupId, userId } })
}

const generateInviteCode = () => {
  const random = Math.floor(Math.random() * 900 + 100)
  return `AMB-${random}`
}

const normalizeEmail = (email) => email?.trim().toLowerCase()
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

router.get('/', async (req, res) => {
  const groups = await prisma.group.findMany({
    where: { members: { some: { userId: req.user.id } } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      inviteCode: true,
    },
  })

  return res.json(groups)
})

router.get('/:groupId', async (req, res) => {
  const { groupId } = req.params
  const membership = await ensureMember(groupId, req.user.id)

  if (!membership) {
    return res.status(403).json({ message: 'Not a member' })
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!group) {
    return res.status(404).json({ message: 'Group not found' })
  }

  return res.json({
    id: group.id,
    name: group.name,
    inviteCode: group.inviteCode,
    members: group.members.map(normalizeMember),
  })
})

router.post('/', async (req, res) => {
  const name = req.body.name?.trim()

  if (!name) {
    return res.status(400).json({ message: 'Missing name' })
  }

  const inviteCode = generateInviteCode()

  const group = await prisma.group.create({
    data: {
      name,
      inviteCode,
      createdByUserId: req.user.id,
      members: {
        create: {
          userId: req.user.id,
        },
      },
    },
    include: {
      members: { include: { user: true } },
    },
  })

  return res.status(201).json({
    id: group.id,
    name: group.name,
    inviteCode: group.inviteCode,
    members: group.members.map(normalizeMember),
  })
})

router.post('/join', async (req, res) => {
  const link = req.body.link?.trim()
  const code = req.body.code?.trim()
  const inviteCode = (code || link?.split('/').pop() || '').toUpperCase()

  if (!inviteCode) {
    return res.status(400).json({ message: 'Missing invite code' })
  }

  const group = await prisma.group.findUnique({ where: { inviteCode } })

  if (!group) {
    return res.status(404).json({ message: 'Invite not found' })
  }

  await prisma.groupMember.upsert({
    where: {
      groupId_userId: {
        groupId: group.id,
        userId: req.user.id,
      },
    },
    update: {},
    create: {
      groupId: group.id,
      userId: req.user.id,
    },
  })

  const updated = await prisma.group.findUnique({
    where: { id: group.id },
    include: { members: { include: { user: true } } },
  })

  return res.json({
    id: updated.id,
    name: updated.name,
    inviteCode: updated.inviteCode,
    members: updated.members.map(normalizeMember),
  })
})

router.get('/:groupId/expenses', async (req, res) => {
  const { groupId } = req.params
  const membership = await ensureMember(groupId, req.user.id)

  if (!membership) {
    return res.status(403).json({ message: 'Not a member' })
  }

  const expenses = await prisma.expense.findMany({
    where: { groupId },
    orderBy: { createdAt: 'desc' },
  })

  return res.json(expenses.map(serializeExpense))
})

router.get('/:groupId/invites', async (req, res) => {
  const { groupId } = req.params
  const membership = await ensureMember(groupId, req.user.id)

  if (!membership) {
    return res.status(403).json({ message: 'Not a member' })
  }

  const invites = await prisma.invite.findMany({
    where: { groupId, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      status: true,
      expiresAt: true,
      createdAt: true,
    },
  })

  return res.json(invites)
})

router.post('/:groupId/expenses', async (req, res) => {
  const { groupId } = req.params
  const amount = Number(req.body.amount)
  const paidBy = req.body.paidBy
  const description = req.body.description?.trim() || 'Walang label'

  if (!amount || !paidBy) {
    return res.status(400).json({ message: 'Missing data' })
  }

  const membership = await ensureMember(groupId, req.user.id)
  if (!membership) {
    return res.status(403).json({ message: 'Not a member' })
  }

  const members = await prisma.groupMember.findMany({
    where: { groupId },
    select: { userId: true },
  })

  if (!members.find((member) => member.userId === paidBy)) {
    return res.status(400).json({ message: 'Payer not in group' })
  }

  const shareAmount = new Prisma.Decimal(amount / members.length)

  const expense = await prisma.expense.create({
    data: {
      groupId,
      paidByUserId: paidBy,
      amount: new Prisma.Decimal(amount),
      description,
      splits: {
        create: members.map((member) => ({
          userId: member.userId,
          shareAmount,
        })),
      },
    },
  })

  return res.status(201).json(serializeExpense(expense))
})

router.post('/:groupId/invites', async (req, res) => {
  const { groupId } = req.params
  const email = normalizeEmail(req.body.email)

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' })
  }

  const membership = await ensureMember(groupId, req.user.id)
  if (!membership) {
    return res.status(403).json({ message: 'Not a member' })
  }

  const group = await prisma.group.findUnique({ where: { id: groupId } })
  if (!group) {
    return res.status(404).json({ message: 'Group not found' })
  }

  const existingInvite = await prisma.invite.findFirst({
    where: {
      groupId,
      email,
      status: 'PENDING',
    },
  })

  if (existingInvite) {
    return res.status(409).json({ message: 'Invite already sent' })
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

  const invite = await prisma.invite.create({
    data: {
      groupId,
      email,
      token,
      invitedByUserId: req.user.id,
      expiresAt,
    },
  })

  await sendInviteEmail({
    to: email,
    token,
    groupName: group.name,
  })

  return res.status(201).json({
    id: invite.id,
    email: invite.email,
    status: invite.status,
    expiresAt: invite.expiresAt,
  })
})

export default router
