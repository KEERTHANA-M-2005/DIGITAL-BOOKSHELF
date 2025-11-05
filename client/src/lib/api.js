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

// Google Books client
const googleBase = 'https://www.googleapis.com/books/v1'
const googleKey = import.meta.env.VITE_GOOGLE_BOOKS_KEY

export async function searchBooks(query) {
  const params = new URLSearchParams({ q: query, key: googleKey, maxResults: '20' })
  const { data } = await axios.get(`${googleBase}/volumes?${params.toString()}`)
  return data
}

export async function getBook(volumeId) {
  const params = new URLSearchParams({ key: googleKey })
  const { data } = await axios.get(`${googleBase}/volumes/${volumeId}?${params.toString()}`)
  return data
}

// Blogs
export async function listBlogs() {
  const { data } = await api.get('/api/blogs')
  return data
}

export async function createBlog(payload) {
  const { data } = await api.post('/api/blogs', payload)
  return data
}

// Progress
export async function listProgress() {
  const { data } = await api.get('/api/progress')
  return data
}


