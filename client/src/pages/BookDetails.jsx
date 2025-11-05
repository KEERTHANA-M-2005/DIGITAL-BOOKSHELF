import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBook, toggleBookSave, updateProgress } from '../lib/api.js'
import { sanitizeHtml } from '../lib/sanitize.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [addedToCart, setAddedToCart] = useState(false)
  const [saved, setSaved] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    async function load() {
      try {
        const data = await getBook(id)
        setBook(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Periodically record reading time while this page is active and visible
  useEffect(() => {
    if (!user) return
    let intervalId
    let isPageVisible = document.visibilityState === 'visible'
    const onVisibility = () => { isPageVisible = document.visibilityState === 'visible' }
    document.addEventListener('visibilitychange', onVisibility)
    intervalId = setInterval(() => {
      if (isPageVisible) updateProgress({ volumeId: id, secondsRead: 10 }).catch(()=>{})
    }, 10000)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      if (intervalId) clearInterval(intervalId)
    }
  }, [id, user])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-300 dark:bg-gray-700 h-96 rounded-2xl"></div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-300 dark:bg-gray-700 h-8 rounded"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-3/4"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300">The book you're looking for doesn't exist.</p>
      </div>
    )
  }

  const info = book.volumeInfo || {}
  const sale = book.saleInfo || {}
  const price = sale.listPrice?.amount ? `₹${sale.listPrice.amount}` : 'Free'
  const rating = info.averageRating || 0
  const ratingsCount = info.ratingsCount || 0

  const handleAddToCart = () => {
    addItem({ 
      id, 
      title: info.title, 
      price: sale.listPrice?.amount || 0,
      thumbnail: info.imageLinks?.thumbnail,
      authors: info.authors
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleSave = async () => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    const { saved } = await toggleBookSave(id)
    setSaved(saved)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📖' },
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Book Image */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="relative group">
              {info.imageLinks?.thumbnail ? (
                <img 
                  src={info.imageLinks.thumbnail} 
                  alt={info.title} 
                  className="w-full rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-300" 
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center">
                  <span className="text-6xl text-gray-400">📚</span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-900 dark:text-white">
                {price}
              </div>
            </div>
          </div>
        </div>

        {/* Book Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {info.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              by {(info.authors || []).join(', ')}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{(info.categories || []).join(' • ')}</span>
              <span>•</span>
              <span>{info.publishedDate}</span>
              <span>•</span>
              <span>{info.pageCount} pages</span>
            </div>
          </div>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-2xl ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({ratingsCount} ratings)
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Buy Now - {price}
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={!user}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                addedToCart 
                  ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                  : user 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {addedToCart ? '✓ Added to Cart!' : user ? 'Add to Cart' : 'Login to Add Cart'}
            </button>
            <button 
              onClick={handleSave}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                saved ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {saved ? 'Saved ✓' : '💾 Save Book'}
            </button>
          </div>

          {/* Preview Link */}
          {info.previewLink && (
            <a 
              href={info.previewLink} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              <span>👁️</span>
              Preview Book
            </a>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
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
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Description</h3>
                {info.description ? (
                  <div
                    className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(info.description) }}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">No description available for this book.</p>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Book Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Publisher:</span>
                      <span className="text-gray-900 dark:text-white">{info.publisher || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Published:</span>
                      <span className="text-gray-900 dark:text-white">{info.publishedDate || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Pages:</span>
                      <span className="text-gray-900 dark:text-white">{info.pageCount || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Language:</span>
                      <span className="text-gray-900 dark:text-white">{info.language || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">ISBN:</span>
                      <span className="text-gray-900 dark:text-white">
                        {info.industryIdentifiers?.[0]?.identifier || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {(info.categories || []).map((category, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Reviews</h3>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">⭐</div>
                  <p>No reviews available yet.</p>
                  <p className="text-sm">Be the first to review this book!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


