import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 20000,
  withCredentials: true,
})

export const createAccount = (payload) => api.post('/api/auth/signup', payload)
export const login = (payload) => api.post('/api/auth/login', payload)
export const getCurrentUser = () => api.get('/api/auth/me')
export const logout = () => api.post('/api/auth/logout')
export const checkHealth = () => api.get('/api/health')
export const submitResearch = (payload) => api.post('/api/research', payload)
export const getResearchById = (researchId) => api.get(`/api/research/${researchId}`)
export const getResearchHistory = () => api.get('/api/research')

export default api
