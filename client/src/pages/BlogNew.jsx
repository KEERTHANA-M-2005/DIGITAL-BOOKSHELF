import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBlog } from '../lib/api.js'

export default function BlogNew() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!title || !content) { setError('Both fields are required'); return }
    setSubmitting(true)
    try {
      await createBlog({ title, content })
      navigate('/blogs', { replace: true })
    } catch (e) {
      setError('Failed to publish')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Blog</h1>
        <div className="flex gap-2">
          <button onClick={()=>navigate('/blogs')} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Cancel</button>
          <button onClick={onSubmit} disabled={submitting} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white">{submitting ? 'Publishing...' : 'Publish'}</button>
        </div>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">{error}</div>}
      <div className="space-y-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Write your blog..." rows={14} className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white [background-image:repeating-linear-gradient(transparent,transparent_31px,#e5e7eb_32px)] dark:[background-image:repeating-linear-gradient(transparent,transparent_31px,#374151_32px)]" />
      </div>
    </div>
  )
}


