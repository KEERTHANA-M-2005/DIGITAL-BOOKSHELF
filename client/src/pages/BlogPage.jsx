import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBlogs } from '../lib/api.js'

export default function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, short, blog

  async function load() {
    setLoading(true)
    try {
      const data = await listBlogs()
      setBlogs(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> { load() }, [])

  const filteredBlogs = blogs

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Community Blogs & Shorts</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Share your book reviews and discover what others are reading
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Blogs List */}
        <div className="lg:col-span-2">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'all', label: 'All', icon: '📰' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                  filter === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <div className="flex-1"/>
            <Link to="/blogs/new" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm">Create Blog</Link>
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-xl mb-3"></div>
                  <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No {filter === 'all' ? 'content' : filter + 's'} yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Be the first to share a book review!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredBlogs.map(blog => (
                <Link to={`/blogs/${blog._id}`} key={blog._id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow p-6 block">
                  <div className="text-xs text-gray-500">by {blog.username}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{blog.content}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column intentionally left for future filters */}
        <div className="lg:col-span-1" />
      </div>
    </div>
  )
}
