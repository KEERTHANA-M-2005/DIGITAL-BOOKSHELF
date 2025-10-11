import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { Order } from '../models/Order.js'

const router = Router()

router.post('/checkout', requireAuth, async (req, res) => {
  const { items = [] } = req.body
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' })
  const amount = items.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.quantity || 1)), 0)
  const order = await Order.create({ userId: req.user.id, items, amount, status: 'paid', provider: 'mock' })
  res.json({ success: true, orderId: order._id })
})

export default router


