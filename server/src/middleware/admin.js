import { requireAuth } from './auth.js'
import { User } from '../models/User.js'

// Middleware to check if user is admin
export function requireAdmin(req, res, next) {
  // First authenticate the user
  requireAuth(req, res, async () => {
    try {
      // Then check if user is admin
      const user = await User.findById(req.user.id)
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' })
      }
      
      req.user.isAdmin = true
      next()
    } catch (e) {
      return res.status(403).json({ error: 'Admin access required' })
    }
  })
}
