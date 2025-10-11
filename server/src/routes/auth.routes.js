import { Router } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/User.js'
import { signJwt } from '../utils/jwt.js'

const router = Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already in use' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    const token = signJwt({ userId: user._id.toString() })
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (e) {
    return res.status(500).json({ error: 'Failed to signup' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })
    const ok = await user.comparePassword(password)
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
    const token = signJwt({ userId: user._id.toString() })
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (e) {
    return res.status(500).json({ error: 'Failed to login' })
  }
})

export default router


