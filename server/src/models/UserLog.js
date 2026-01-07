import mongoose from 'mongoose'

const userLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  action: { type: String, required: true }, // e.g., 'login', 'logout', 'view_book', 'add_to_cart', 'purchase', etc.
  details: { type: String }, // Additional details about the action
  ipAddress: { type: String },
  userAgent: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }, // Flexible field for additional data
}, { timestamps: true })

// Index for efficient queries
userLogSchema.index({ userId: 1, createdAt: -1 })
userLogSchema.index({ createdAt: -1 })

export const UserLog = mongoose.model('UserLog', userLogSchema)
