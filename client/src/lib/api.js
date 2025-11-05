import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export const api = axios.create({
  baseURL: apiBase,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Books API via server (hides Google Books API key)
export async function searchBooks(query) {
  const params = new URLSearchParams({ q: query })
  const { data } = await api.get(`/api/books/search?${params.toString()}`)
  return data
}

export async function getBook(volumeId) {
  const { data } = await api.get(`/api/books/${volumeId}`)
  return data
}

// Vlogs
export async function listVlogs() {
  const { data } = await api.get('/api/vlogs')
  return data
}

export async function createVlog(payload) {
  const { data } = await api.post('/api/vlogs', payload)
  return data
}

// Progress
export async function listProgress() {
  const { data } = await api.get('/api/progress')
  return data
}


