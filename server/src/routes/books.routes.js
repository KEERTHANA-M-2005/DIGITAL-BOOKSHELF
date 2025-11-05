import { Router } from 'express'
import axios from 'axios'
import { requireAuth } from '../middleware/auth.js'
import { User } from '../models/User.js'

const router = Router()
const googleBase = 'https://www.googleapis.com/books/v1'
const googleKey = process.env.GOOGLE_BOOKS_KEY

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query
    const params = new URLSearchParams({ q: q || '', maxResults: '20' })
    if (googleKey) params.set('key', googleKey)
    const { data } = await axios.get(`${googleBase}/volumes?${params.toString()}`)
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Failed to search' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const params = new URLSearchParams()
    if (googleKey) params.set('key', googleKey)
    const { data } = await axios.get(`${googleBase}/volumes/${id}?${params.toString()}`)
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch book' })
  }
})

router.get('/recommendations/mood', async (req, res) => {
  // Simple heuristic-based recommendations by mood keywords
  const { mood = 'happy' } = req.query
  const moodMap = {
    happy: 'uplifting OR feel-good OR joy',
    sad: 'heartwarming OR hopeful',
    adventurous: 'adventure OR journey OR quest',
    romantic: 'romance OR love story',
    mystery: 'mystery OR thriller',
  }
  const q = moodMap[mood] || 'bestseller'
  try {
    const params = new URLSearchParams({ q, maxResults: '10' })
    if (googleKey) params.set('key', googleKey)
    const { data } = await axios.get(`${googleBase}/volumes?${params.toString()}`)
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Failed to get recommendations' })
  }
})

// Toggle like for a book (per-user)
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(req.user.id)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    const idx = user.likedBooks.findIndex(v => v === id)
    if (idx >= 0) {
      user.likedBooks.splice(idx, 1)
      await user.save()
      return res.json({ liked: false })
    } else {
      user.likedBooks.push(id)
      await user.save()
      return res.json({ liked: true })
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to toggle like' })
  }
})

// Toggle save for a book (per-user)
router.post('/:id/save', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(req.user.id)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    const idx = user.savedBooks.findIndex(v => v === id)
    if (idx >= 0) {
      user.savedBooks.splice(idx, 1)
      await user.save()
      return res.json({ saved: false })
    } else {
      user.savedBooks.push(id)
      await user.save()
      return res.json({ saved: true })
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to toggle save' })
  }
})

export default router


