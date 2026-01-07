import { verifyJwt } from '../utils/jwt.js'
import { User } from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const decoded = verifyJwt(token)
    const user = await User.findById(decoded.userId)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    req.user = { id: user._id.toString(), email: user.email, name: user.name, isAdmin: user.isAdmin || false }
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}


