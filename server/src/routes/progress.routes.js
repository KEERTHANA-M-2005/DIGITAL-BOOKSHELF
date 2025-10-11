import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { Progress } from '../models/Progress.js'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  const items = await Progress.find({ userId: req.user.id }).sort({ updatedAt: -1 })
  res.json(items)
})

router.post('/', requireAuth, async (req, res) => {
  const { volumeId, pagesRead = 0, secondsRead = 0 } = req.body
  if (!volumeId) return res.status(400).json({ error: 'Missing volumeId' })
  const prog = await Progress.findOneAndUpdate(
    { userId: req.user.id, volumeId },
    { $inc: { pagesRead, secondsRead } },
    { upsert: true, new: true }
  )
  res.json(prog)
})

export default router


