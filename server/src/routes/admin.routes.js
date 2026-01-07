import { Router } from 'express'
import { requireAdmin } from '../middleware/admin.js'
import { User } from '../models/User.js'
import { UserLog } from '../models/UserLog.js'

const router = Router()

// Get all users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    // Build search query
    const searchQuery = search 
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {}
    
    const [users, total] = await Promise.all([
      User.find(searchQuery)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(searchQuery)
    ])
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (e) {
    console.error('Error fetching users:', e)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Get user logs (admin only)
router.get('/logs', requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      userId, 
      action,
      startDate,
      endDate 
    } = req.query
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    // Build query
    const query = {}
    if (userId) query.userId = userId
    if (action) query.action = action
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }
    
    const [logs, total] = await Promise.all([
      UserLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      UserLog.countDocuments(query)
    ])
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (e) {
    console.error('Error fetching logs:', e)
    res.status(500).json({ error: 'Failed to fetch logs' })
  }
})

// Get user statistics (admin only)
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      recentUsers,
      totalLogs,
      recentLogs
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isAdmin: true }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      UserLog.countDocuments(),
      UserLog.find().sort({ createdAt: -1 }).limit(10)
    ])
    
    // Get action counts
    const actionCounts = await UserLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
    
    res.json({
      users: {
        total: totalUsers,
        admins: totalAdmins,
        regular: totalUsers - totalAdmins,
        recent: recentUsers
      },
      logs: {
        total: totalLogs,
        recent: recentLogs,
        actionCounts
      }
    })
  } catch (e) {
    console.error('Error fetching stats:', e)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

// Toggle user admin status (admin only)
router.patch('/users/:id/admin', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { isAdmin } = req.body
    
    // Prevent removing your own admin status
    if (id === req.user.id && isAdmin === false) {
      return res.status(400).json({ error: 'Cannot remove your own admin status' })
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { isAdmin: isAdmin === true },
      { new: true }
    ).select('-passwordHash')
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ user, message: `User ${isAdmin ? 'promoted to' : 'removed from'} admin` })
  } catch (e) {
    console.error('Error updating user admin status:', e)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

export default router
