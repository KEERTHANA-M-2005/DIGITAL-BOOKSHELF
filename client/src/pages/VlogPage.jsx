import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { createVlog, listVlogs } from '../lib/api.js'

export default function VlogPage() {
  const { user } = useAuth()
  const [vlogs, setVlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ volumeId: '', title: '', contentUrl: '', kind: 'short' })
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState('all') // all, short, vlog

  async function load() {
    setLoading(true)
    try {
      const data = await listVlogs()
      setVlogs(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> { load() }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('')
    setUploading(true)
    if (!user) { setMsg('Please login to upload.'); setUploading(false); return }
    if (!form.volumeId || !form.title || !form.contentUrl) { setMsg('All fields are required.'); setUploading(false); return }
    try {
      await createVlog(form)
      setForm({ volumeId: '', title: '', contentUrl: '', kind: 'short' })
      setMsg('Uploaded successfully!')
      load()
    } catch (e) {
      setMsg('Failed to upload. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const filteredVlogs = vlogs.filter(vlog => filter === 'all' || vlog.kind === filter)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Community Vlogs & Shorts</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Share your book reviews and discover what others are reading
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Vlogs List */}
        <div className="lg:col-span-2">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'all', label: 'All', icon: '📺' },
              { id: 'short', label: 'Shorts', icon: '⚡' },
              { id: 'vlog', label: 'Vlogs', icon: '🎥' }
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
          </div>

          {/* Vlogs Grid */}
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
          ) : filteredVlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No {filter === 'all' ? 'content' : filter + 's'} yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {filter === 'all' 
                  ? 'Be the first to share a book review!' 
                  : `No ${filter}s have been shared yet.`
                }
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredVlogs.map(vlog => (
                <div key={vlog._id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                  {/* Video Thumbnail Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {vlog.kind === 'short' ? '⚡' : '🎥'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {vlog.kind?.toUpperCase()}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {vlog.kind === 'short' ? 'SHORT' : 'VLOG'}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                        {vlog.volumeId}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(vlog.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {vlog.title}
                    </h3>

                    <a 
                      href={vlog.contentUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                    >
                      <span>▶️</span>
                      Watch {vlog.kind === 'short' ? 'Short' : 'Vlog'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Share Your Review
            </h2>
            
            {!user ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔒</div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Please login to share your book reviews
                </p>
                <a 
                  href="/login" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  <span>🔑</span>
                  Login
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                {msg && (
                  <div className={`p-3 rounded-lg text-sm ${
                    msg.includes('successfully') 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                      : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}>
                    {msg}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Book Volume ID
                  </label>
                  <input 
                    value={form.volumeId} 
                    onChange={(e)=>setForm(f=>({...f, volumeId: e.target.value}))} 
                    placeholder="Enter Google Books Volume ID" 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input 
                    value={form.title} 
                    onChange={(e)=>setForm(f=>({...f, title: e.target.value}))} 
                    placeholder="Enter review title" 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content URL
                  </label>
                  <input 
                    value={form.contentUrl} 
                    onChange={(e)=>setForm(f=>({...f, contentUrl: e.target.value}))} 
                    placeholder="YouTube, TikTok, or other video URL" 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content Type
                  </label>
                  <select 
                    value={form.kind} 
                    onChange={(e)=>setForm(f=>({...f, kind: e.target.value}))} 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="short">⚡ Short (under 60 seconds)</option>
                    <option value="vlog">🎥 Vlog (longer content)</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      Share Review
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tips for great reviews:</h3>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Keep shorts under 60 seconds</li>
                <li>• Share your honest opinion</li>
                <li>• Mention what you liked/disliked</li>
                <li>• Include the book's Volume ID</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


