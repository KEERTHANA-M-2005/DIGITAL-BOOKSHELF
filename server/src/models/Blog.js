import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  comments: [{ userId: String, username: String, text: String, date: { type: Date, default: Date.now } }],
  viewedBy: [{ type: String }],
}, { timestamps: true })

blogSchema.index({ createdAt: -1 })

export const Blog = mongoose.model('Blog', blogSchema)
