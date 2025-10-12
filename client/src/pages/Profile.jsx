import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { listProgress } from '../lib/api.js'

export default function Profile() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('progress')

  useEffect(()=>{
    async function load() {
      setLoading(true)
      try {
        const data = await listProgress()
        setItems(data)
      } finally {
        setLoading(false)
      }
    }
    if (user) load()
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">👤</div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Please Login</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          You need to be logged in to view your profile.
        </p>
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          <span>🔑</span>
          Login Now
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: 'progress', label: 'Reading Progress', icon: '📚' },
    { id: 'saved', label: 'Saved Books', icon: '❤️' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
            {user.name?.charAt(0).toUpperCase() || '👤'}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-blue-100">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'progress' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reading Progress</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {items.length} books in progress
              </span>
            </div>
            
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-xl mb-3"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No reading progress yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Start reading books to track your progress here.
                </p>
                <Link 
                  to="/search" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  <span>🔍</span>
                  Find Books
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {item.volumeId}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Pages Read:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{item.pagesRead}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Reading Time:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.round((item.secondsRead || 0) / 60)} min
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((item.pagesRead || 0) / 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Saved Books
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your saved books will appear here.
            </p>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Order History
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your order history will appear here.
            </p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    value={user.name} 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={user.email} 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                <div className="pt-4">
                  <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


