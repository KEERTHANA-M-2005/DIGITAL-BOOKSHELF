import { Router } from 'express'
import axios from 'axios'

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

export default router


