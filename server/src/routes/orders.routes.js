import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { Order } from '../models/Order.js'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(orders)
})

export default router


