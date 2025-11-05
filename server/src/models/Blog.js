import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volumeId: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String, default: '' }, // Short preview text
  body: { type: String, default: '' }, // Rich content (markdown or HTML)
  contentUrl: { type: String, default: '' }, // Optional external URL (for backwards compatibility)
  kind: { type: String, enum: ['short', 'blog'], default: 'blog' },
  tags: [{ type: String }], // Tags for categorization
  featuredImage: { type: String, default: '' }, // Image URL
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked
  views: { type: Number, default: 0 }, // View count
  isPublished: { type: Boolean, default: true }, // Draft/published status
}, { timestamps: true })

blogSchema.index({ volumeId: 1 })
blogSchema.index({ tags: 1 })
blogSchema.index({ createdAt: -1 })

export const Blog = mongoose.model('Blog', blogSchema)
