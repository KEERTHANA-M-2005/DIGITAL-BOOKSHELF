import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BookCard from '../components/BookCard.jsx'
import { searchBooks } from '../lib/api.js'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBooks() {
      try {
        const [trendingData, recommendedData] = await Promise.all([
          searchBooks('bestseller fiction 2024'),
          searchBooks('self help motivation')
        ])
        setTrending((trendingData.items || []).slice(0, 6))
        setRecommended((recommendedData.items || []).slice(0, 6))
      } catch (e) {
        console.error('Failed to load books:', e)
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [])

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Discover Your Next
            <span className="block text-yellow-300">Great Read</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Explore thousands of books, share reviews, and connect with fellow readers
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/search" 
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Browse Books
            </Link>
            <Link 
              to="/vlogs" 
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Watch Reviews
            </Link>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-yellow-300/20 rounded-full"></div>
      </section>

      {/* Trending Books */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">🔥 Trending Now</h2>
          <Link to="/search" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-lg mb-3"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trending.map(book => (
              <BookCard 
                key={book.id}
                id={book.id}
                title={book.volumeInfo?.title}
                authors={book.volumeInfo?.authors}
                thumbnail={book.volumeInfo?.imageLinks?.thumbnail}
                price={book.saleInfo?.listPrice?.amount}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recommended Books */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">⭐ Recommended for You</h2>
          <Link to="/search" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-lg mb-3"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {recommended.map(book => (
              <BookCard 
                key={book.id}
                id={book.id}
                title={book.volumeInfo?.title}
                authors={book.volumeInfo?.authors}
                thumbnail={book.volumeInfo?.imageLinks?.thumbnail}
                price={book.saleInfo?.listPrice?.amount}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Why Choose Digital Book Shelf?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Vast Collection</h3>
            <p className="text-gray-600 dark:text-gray-300">Access millions of books from Google Books API</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Community Reviews</h3>
            <p className="text-gray-600 dark:text-gray-300">Watch vlogs and shorts from fellow readers</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">AI Recommendations</h3>
            <p className="text-gray-600 dark:text-gray-300">Get personalized suggestions based on your mood</p>
          </div>
        </div>
      </section>
    </div>
  )
}


