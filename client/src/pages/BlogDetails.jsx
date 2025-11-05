import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { commentBlog, getBlog, likeBlog } from '../lib/api.js'

export default function BlogDetails() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const b = await getBlog(id)
        setBlog(b)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!blog) return <div>Not found</div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{blog.title}</h1>
          <div className="text-sm text-gray-500">by {blog.username}</div>
        </div>
        <button onClick={async()=>{ const r = await likeBlog(blog._id); setLiked(r.liked); setBlog(b=>({...b, likes: r.likes})) }} className={`px-3 py-2 rounded-lg ${liked ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>❤️ {blog.likes || 0}</button>
      </div>
      <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">{blog.content}</div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Comments</h3>
        <div className="space-y-3 mb-4">
          {(blog.comments || []).map((c, i) => (
            <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{c.username}</div>
              <div className="text-sm text-gray-700 dark:text-gray-200">{c.text}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment" className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          <button disabled={sending || !comment} onClick={async()=>{ setSending(true); await commentBlog(blog._id, comment); setComment(''); const b = await getBlog(id); setBlog(b); setSending(false) }} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white">Post</button>
        </div>
      </div>
    </div>
  )
}


