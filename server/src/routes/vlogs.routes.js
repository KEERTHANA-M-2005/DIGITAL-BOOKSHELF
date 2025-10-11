import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { Vlog } from '../models/Vlog.js'

const router = Router()

router.get('/', async (_req, res) => {
  const items = await Vlog.find().sort({ createdAt: -1 }).limit(50)
  res.json(items)
})

router.post('/', requireAuth, async (req, res) => {
  const { volumeId, title, contentUrl, kind } = req.body
  if (!volumeId || !title || !contentUrl) return res.status(400).json({ error: 'Missing fields' })
  const vlog = await Vlog.create({ userId: req.user.id, volumeId, title, contentUrl, kind })
  res.status(201).json(vlog)
})

export default router


