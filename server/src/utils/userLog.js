import { UserLog } from '../models/UserLog.js'
import { User } from '../models/User.js'

/**
 * Log user activity
 * @param {Object} params
 * @param {String} params.userId - User ID
 * @param {String} params.action - Action type (e.g., 'login', 'logout', 'view_book', 'add_to_cart')
 * @param {String} params.details - Additional details
 * @param {String} params.ipAddress - User's IP address
 * @param {String} params.userAgent - User's browser/device info
 * @param {Object} params.metadata - Additional metadata
 */
export async function logUserActivity({ userId, action, details = null, ipAddress = null, userAgent = null, metadata = null }) {
  try {
    if (!userId || !action) {
      console.warn('Cannot log activity: userId and action are required')
      return
    }

    // Get user info
    const user = await User.findById(userId)
    if (!user) {
      console.warn(`Cannot log activity: User ${userId} not found`)
      return
    }

    // Create log entry
    await UserLog.create({
      userId,
      userEmail: user.email,
      userName: user.name,
      action,
      details,
      ipAddress,
      userAgent,
      metadata
    })
  } catch (error) {
    // Don't throw - logging should not break the application
    console.error('Error logging user activity:', error)
  }
}

/**
 * Get client IP address from request
 */
export function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         null
}

/**
 * Get user agent from request
 */
export function getUserAgent(req) {
  return req.headers['user-agent'] || null
}
