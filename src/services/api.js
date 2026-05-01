import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_API_URL || '/api'
const baseURL = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, '')}/api`

const api = axios.create({
  baseURL,
  timeout: 5000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const registerUser = async ({ email, name, password }) => {
  const response = await api.post('/auth/register', { email, name, password })
  return response.data
}

export const verifyUser = async (token) => {
  const response = await api.get('/auth/verify', { params: { token } })
  return response.data
}

export const loginUser = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const fetchGroups = async () => {
  const response = await api.get('/groups')
  return response.data
}

export const fetchGroupDetails = async (groupId) => {
  const response = await api.get(`/groups/${groupId}`)
  return response.data
}

export const fetchExpenses = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/expenses`)
  return response.data
}

export const fetchInvites = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/invites`)
  return response.data
}

export const createGroup = async (name) => {
  const response = await api.post('/groups', { name })
  return response.data
}

export const joinGroupByLink = async (link) => {
  const response = await api.post('/groups/join', { link })
  return response.data
}

export const joinGroupByCode = async (code) => {
  const response = await api.post('/groups/join', { code })
  return response.data
}

export const createExpense = async (groupId, expense) => {
  const response = await api.post(`/groups/${groupId}/expenses`, expense)
  return response.data
}

export const createInvite = async (groupId, email) => {
  const response = await api.post(`/groups/${groupId}/invites`, { email })
  return response.data
}

export const deleteExpense = async (groupId, expenseId) => {
  const response = await api.delete(`/groups/${groupId}/expenses/${expenseId}`)
  return response.data
}

export const markExpensePaid = async (groupId, expenseId, userId) => {
  const response = await api.post(`/groups/${groupId}/expenses/${expenseId}/mark-paid`, { userId })
  return response.data
}

export const deleteGroup = async (groupId) => {
  const response = await api.delete(`/groups/${groupId}`)
  return response.data
}

export const markDebtPaid = async (groupId, debtorId, creditorId) => {
  const response = await api.post(`/groups/${groupId}/mark-debt-paid`, { debtorId, creditorId })
  return response.data
}

export const getInvite = async (token) => {
  const response = await api.get(`/invites/${token}`)
  return response.data
}

export const acceptInvite = async (token) => {
  const response = await api.post(`/invites/${token}/accept`)
  return response.data
}
