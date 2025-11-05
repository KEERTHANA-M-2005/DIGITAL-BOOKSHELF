import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { Blog } from '../models/Blog.js'
import { User } from '../models/User.js'

const router = Router()

router.get('/', async (_req, res) => {
  const items = await Blog.find().sort({ createdAt: -1 }).limit(50)
  res.json(items)
})

router.post('/', requireAuth, async (req, res) => {
  const { title, content } = req.body
  if (!title || !content) return res.status(400).json({ error: 'Missing fields' })
  const blog = await Blog.create({ userId: req.user.id, username: req.user.name, title, content })
  res.status(201).json(blog)
})

// Recently viewed blogs for the logged-in user
router.get('/recent', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id)
  const ids = user?.recentBlogs || []
  if (ids.length === 0) return res.json([])
  const blogs = await Blog.find({ _id: { $in: ids } })
  // order by recency per ids order
  const map = new Map(blogs.map(b => [b._id.toString(), b]))
  const ordered = ids.map(id => map.get(id)).filter(Boolean)
  res.json(ordered)
})

// Get a single blog and mark viewed by user (and add to user's recentBlogs)
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const blog = await Blog.findById(id)
  if (!blog) return res.status(404).json({ error: 'Not found' })
  const userId = req.user.id
  if (!blog.viewedBy.includes(userId)) {
    blog.viewedBy.push(userId)
    await blog.save()
  }
  const user = await User.findById(userId)
  if (user) {
    // maintain MRU list without duplicates, max 20
    user.recentBlogs = [id, ...user.recentBlogs.filter(b => b !== id)].slice(0, 20)
    await user.save()
  }
  res.json(blog)
})

// Toggle like on a blog
router.post('/:id/like', requireAuth, async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const userIdStr = userId
  const blog = await Blog.findById(id)
  if (!blog) return res.status(404).json({ error: 'Not found' })
  const idx = blog.likedBy.findIndex(u => u === userIdStr)
  if (idx >= 0) {
    blog.likedBy.splice(idx, 1)
  } else {
    blog.likedBy.push(userIdStr)
  }
  blog.likes = blog.likedBy.length
  await blog.save()
  res.json({ liked: idx < 0, likes: blog.likes })
})

// Add a comment
router.post('/:id/comment', requireAuth, async (req, res) => {
  const { id } = req.params
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Missing text' })
  const blog = await Blog.findById(id)
  if (!blog) return res.status(404).json({ error: 'Not found' })
  blog.comments.push({ userId: req.user.id, username: req.user.name, text, date: new Date() })
  await blog.save()
  res.status(201).json({ success: true })
})

export default router
