import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { User } from '../models/User.js'

const router = Router()

router.get('/saved', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id)
  res.json({ savedBooks: user?.savedBooks || [] })
})

router.post('/saved/:id', requireAuth, async (req, res) => {
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
})

export default router


