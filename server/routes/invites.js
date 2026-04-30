import express from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth } from '../lib/auth.js'

const router = express.Router()

const now = () => new Date()

router.get('/:token', async (req, res) => {
  const { token } = req.params

  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { group: true },
  })

  if (!invite) {
    return res.status(404).json({ message: 'Invite not found' })
  }

  if (invite.expiresAt < now() && invite.status === 'PENDING') {
    await prisma.invite.update({
      where: { id: invite.id },
      data: { status: 'EXPIRED' },
    })
  }

  return res.json({
    id: invite.id,
    email: invite.email,
    status: invite.status,
    expiresAt: invite.expiresAt,
    group: {
      id: invite.group.id,
      name: invite.group.name,
    },
  })
})

router.post('/:token/accept', requireAuth, async (req, res) => {
  const { token } = req.params

  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { group: true },
  })

  if (!invite) {
    return res.status(404).json({ message: 'Invite not found' })
  }

  if (invite.status !== 'PENDING') {
    return res.status(400).json({ message: `Invite is ${invite.status.toLowerCase()}` })
  }

  if (invite.expiresAt < now()) {
    await prisma.invite.update({
      where: { id: invite.id },
      data: { status: 'EXPIRED' },
    })
    return res.status(410).json({ message: 'Invite expired' })
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  if (!user || user.email.toLowerCase() !== invite.email.toLowerCase()) {
    return res.status(403).json({ message: 'Invite email mismatch' })
  }

  await prisma.groupMember.upsert({
    where: {
      groupId_userId: {
        groupId: invite.groupId,
        userId: req.user.id,
      },
    },
    update: {},
    create: {
      groupId: invite.groupId,
      userId: req.user.id,
    },
  })

  await prisma.invite.update({
    where: { id: invite.id },
    data: { status: 'ACCEPTED', acceptedAt: now() },
  })

  return res.json({
    groupId: invite.groupId,
    groupName: invite.group.name,
  })
})

export default router
