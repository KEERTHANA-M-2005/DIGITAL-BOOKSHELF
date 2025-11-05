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

export async function toggleBookSave(volumeId) {
  const { data } = await api.post(`/api/books/${volumeId}/save`)
  return data
}

export async function toggleBookLike(volumeId) {
  const { data } = await api.post(`/api/books/${volumeId}/like`)
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

export async function getBlog(id) {
  const { data } = await api.get(`/api/blogs/${id}`)
  return data
}

export async function likeBlog(id) {
  const { data } = await api.post(`/api/blogs/${id}/like`)
  return data
}

export async function commentBlog(id, text) {
  const { data } = await api.post(`/api/blogs/${id}/comment`, { text })
  return data
}

export async function recentBlogs() {
  const { data } = await api.get('/api/blogs/recent')
  return data
}

// Progress
export async function listProgress() {
  const { data } = await api.get('/api/progress')
  return data
}

export async function updateProgress({ volumeId, pagesRead = 0, secondsRead = 0 }) {
  const { data } = await api.post('/api/progress', { volumeId, pagesRead, secondsRead })
  return data
}

// User saved books
export async function getSavedBooks() {
  const { data } = await api.get('/api/user/saved')
  return data.savedBooks || []
}

export async function toggleSavedBook(volumeId) {
  const { data } = await api.post(`/api/user/saved/${volumeId}`)
  return data
}

// Orders
export async function listOrders() {
  const { data } = await api.get('/api/orders')
  return data
}


