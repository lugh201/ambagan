import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const resendFrom = process.env.RESEND_FROM
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

export const sendVerificationEmail = async ({ to, token }) => {
  if (!resendFrom) {
    throw new Error('RESEND_FROM is not set')
  }

  const verifyLink = `${frontendUrl}/verify?token=${token}`

  try {
    const result = await resend.emails.send({
      from: resendFrom,
      to,
      subject: 'Verify your Ambagan account',
      text: `Click to verify your Ambagan account: ${verifyLink}`,
    })
    console.log('[mail] verification sent', { to, id: result?.id })
    return result
  } catch (error) {
    console.error('[mail] verification failed', {
      to,
      message: error?.message,
    })
    throw error
  }
}

export const sendInviteEmail = async ({ to, token, groupName }) => {
  if (!resendFrom) {
    throw new Error('RESEND_FROM is not set')
  }

  const inviteLink = `${frontendUrl}/invite/${token}`

  try {
    const result = await resend.emails.send({
      from: resendFrom,
      to,
      subject: `Invite to join ${groupName}`,
      text: `You have been invited to join ${groupName}. Click to accept: ${inviteLink}`,
    })
    console.log('[mail] invite sent', { to, groupName, id: result?.id })
    return result
  } catch (error) {
    console.error('[mail] invite failed', {
      to,
      groupName,
      message: error?.message,
    })
    throw error
  }
}
