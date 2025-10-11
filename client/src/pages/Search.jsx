import { useState } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import BookCard from '../components/BookCard.jsx'
import { searchBooks } from '../lib/api.js'

export default function Search() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')

  async function onSubmit(e) {
    e.preventDefault()
    if (!q.trim()) return
    setLoading(true)
    try {
      const data = await searchBooks(q.trim())
      const items = (data.items || []).map(v => ({
        id: v.id,
        title: v.volumeInfo?.title,
        authors: v.volumeInfo?.authors || [],
        thumbnail: v.volumeInfo?.imageLinks?.thumbnail,
        price: v.saleInfo?.listPrice?.amount,
        rating: v.volumeInfo?.averageRating,
        publishedDate: v.volumeInfo?.publishedDate,
      }))
      setResults(items)
    } finally {
      setLoading(false)
    }
  }

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0)
      case 'oldest':
        return new Date(a.publishedDate || 0) - new Date(b.publishedDate || 0)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'price-low':
        return (a.price || 0) - (b.price || 0)
      case 'price-high':
        return (b.price || 0) - (a.price || 0)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Discover Amazing Books
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Search through millions of books and find your next favorite read
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <SearchBar 
          value={q} 
          onChange={setQ} 
          onSubmit={onSubmit} 
          placeholder="Search by title, author, or ISBN..." 
        />
        
        {results.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Found {results.length} books
            </p>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-xl mb-3"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && q && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No books found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try searching with different keywords or check your spelling
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedResults.map(book => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      )}

      {!loading && !q && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Start Your Search
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Enter a book title, author name, or ISBN to begin exploring
          </p>
        </div>
      )}
    </div>
  )
}


