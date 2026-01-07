import { useEffect, useState, useRef, useCallback } from 'react'
import { api, searchBooks, getLikedBooks, getSavedBooks } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

// Array of diverse book search queries (outside component to avoid recreation)
const searchQueries = [
  'bestsellers',
  'fiction',
  'mystery',
  'romance',
  'science fiction',
  'fantasy',
  'thriller',
  'biography',
  'history',
  'self-help',
  'business',
  'technology',
  'philosophy',
  'poetry',
  'young adult',
  'horror',
  'adventure',
  'comedy',
  'drama',
  'classics',
  'award winners',
  'new releases',
  'non-fiction',
  'memoir',
  'cooking',
  'travel',
  'art',
  'music',
  'sports',
  'health'
]

export default function Shorts() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [likedIds, setLikedIds] = useState(new Set())
  const [savedIds, setSavedIds] = useState(new Set())
  const [usedQueries, setUsedQueries] = useState(new Set())
  const scrollContainerRef = useRef(null)
  const isLoadingRef = useRef(false)

  // Get a random query that hasn't been used yet
  const getRandomQuery = useCallback(() => {
    const availableQueries = searchQueries.filter(q => !usedQueries.has(q))
    if (availableQueries.length === 0) {
      // Reset if all queries used
      setUsedQueries(new Set())
      return searchQueries[Math.floor(Math.random() * searchQueries.length)]
    }
    const randomQuery = availableQueries[Math.floor(Math.random() * availableQueries.length)]
    setUsedQueries(prev => new Set([...prev, randomQuery]))
    return randomQuery
  }, [usedQueries])

  // Load books function
  const loadBooks = useCallback(async (query, append = false) => {
    if (isLoadingRef.current) return // Prevent multiple simultaneous loads
    
    try {
      isLoadingRef.current = true
      if (!append) setLoading(true)
      else setLoadingMore(true)

      const data = await searchBooks(query)
      const books = (data.items || []).map(it => it)
      
      if (append) {
        // Filter out duplicates by book ID
        setItems(prev => {
          const existingIds = new Set(prev.map(b => b.id))
          const newBooks = books.filter(b => b.id && !existingIds.has(b.id))
          return [...prev, ...newBooks]
        })
      } else {
        setItems(books)
      }
      setError('')
    } catch (e) {
      setError('Failed to load shorts')
    } finally {
      setLoading(false)
      setLoadingMore(false)
      isLoadingRef.current = false
    }
  }, [])

  // Load user's liked and saved books on mount
  useEffect(() => {
    async function loadUserBooks() {
      if (!user) return
      try {
        const [liked, saved] = await Promise.all([
          getLikedBooks().catch(() => []),
          getSavedBooks().catch(() => [])
        ])
        setLikedIds(new Set(liked))
        setSavedIds(new Set(saved))
      } catch (e) {
        console.error('Failed to load user books:', e)
      }
    }
    loadUserBooks()
  }, [user])

  // Initial load (only once on mount)
  useEffect(() => {
    const initialQuery = getRandomQuery()
    loadBooks(initialQuery, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Infinite scroll handler with throttling
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let scrollTimeout
    const handleScroll = () => {
      // Throttle scroll events
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = container
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

        // Load more when user scrolls to 80% of the content
        if (scrollPercentage > 0.8 && !isLoadingRef.current && !loading && !loadingMore) {
          const nextQuery = getRandomQuery()
          loadBooks(nextQuery, true)
        }
      }, 200) // Throttle to every 200ms
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [loadingMore, loading, getRandomQuery, loadBooks])

  const handleLike = async (volumeId) => {
    if (!user) {
      alert('Please login to like books')
      return
    }
    try {
      const { data } = await api.post(`/api/books/${volumeId}/like`)
      setLikedIds(prev => {
        const copy = new Set(prev)
        if (data.liked) copy.add(volumeId); else copy.delete(volumeId)
        return copy
      })
    } catch (e) {
      console.error('Failed to like book:', e)
      if (e.response?.status === 401) {
        alert('Please login to like books')
      } else {
        alert('Failed to like book. Please try again.')
      }
    }
  }

  const handleSave = async (volumeId) => {
    if (!user) {
      alert('Please login to save books')
      return
    }
    try {
      const { data } = await api.post(`/api/books/${volumeId}/save`)
      setSavedIds(prev => {
        const copy = new Set(prev)
        if (data.saved) copy.add(volumeId); else copy.delete(volumeId)
        return copy
      })
    } catch (e) {
      console.error('Failed to save book:', e)
      if (e.response?.status === 401) {
        alert('Please login to save books')
      } else {
        alert('Failed to save book. Please try again.')
      }
    }
  }

  const handleShare = (book) => {
    const url = window.location.origin + `/book/${book.id}`
    const text = `Check this book: ${book.volumeInfo?.title} - ${url}`
    if (navigator.share) {
      navigator.share({ title: book.volumeInfo?.title, text, url }).catch(()=>{})
    } else {
      // fallback simple menu
      const wa = `https://wa.me/?text=${encodeURIComponent(text)}`
      const mail = `mailto:?subject=${encodeURIComponent('Check this book')}&body=${encodeURIComponent(text)}`
      const sms = `sms:?body=${encodeURIComponent(text)}`
      window.open(wa, '_blank') || window.location.assign(mail) || window.location.assign(sms)
    }
  }

  if (loading && items.length === 0) {
    return <div className="h-[80vh] flex items-center justify-center text-gray-600 dark:text-gray-300">Loading...</div>
  }
  if (error && items.length === 0) {
    return <div className="h-[80vh] flex items-center justify-center text-red-600">{error}</div>
  }

  return (
    <div className="relative bg-black text-white">
      <div 
        ref={scrollContainerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {items.map((book, idx) => {
          const info = book.volumeInfo || {}
          const thumb = info.imageLinks?.thumbnail || ''
          const isLiked = likedIds.has(book.id)
          const isSaved = savedIds.has(book.id)
          return (
            <section key={book.id || idx} className="relative h-screen w-full flex items-center justify-center snap-start overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-black"></div>

              {/* Mobile/Tablet View - Centered with overlay */}
              <div className="relative z-10 flex items-center justify-center w-full h-full px-3 sm:px-4 md:px-6 lg:hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Book cover container */}
                  {thumb ? (
                    <div className="relative h-[75vh] sm:h-[80vh] md:h-[85vh] w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] flex items-center justify-center overflow-hidden">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                          src={thumb.replace('zoom=1', 'zoom=2') || thumb} 
                          alt={info.title} 
                          className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl" 
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                            const fallback = e.target.parentElement?.querySelector('.image-fallback')
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                        <div className="image-fallback hidden absolute inset-0 h-full w-full rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl shadow-2xl border border-gray-700">
                          <span className="text-xs sm:text-sm md:text-base text-white/70 px-4 text-center">Image too large or failed to load</span>
                        </div>
                      </div>
                      
                      {/* Black transparent overlay over entire book cover */}
                      <div className="absolute inset-0 bg-black/40 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>
                      
                      {/* Text container aligned inside book cover */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/98 via-black/75 to-transparent p-3 sm:p-4 md:p-5 rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl z-10">
                        <h3 className="text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 text-white drop-shadow-lg leading-tight">
                          {info.title || 'Untitled'}
                        </h3>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-200 line-clamp-2 sm:line-clamp-2 md:line-clamp-3 drop-shadow-md leading-snug">
                          {info.description || 'No description available.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-[75vh] sm:h-[80vh] md:h-[85vh] w-[70vw] sm:w-[65vw] md:w-[55vw] max-w-md flex items-center justify-center overflow-hidden">
                      <div className="h-full w-full rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl shadow-2xl border border-gray-700">
                        📚
                      </div>
                      
                      {/* Black transparent overlay */}
                      <div className="absolute inset-0 bg-black/40 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>
                      
                      {/* Text container */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/98 via-black/75 to-transparent p-3 sm:p-4 md:p-5 rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl z-10">
                        <h3 className="text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 text-white drop-shadow-lg leading-tight">
                          {info.title || 'Untitled'}
                        </h3>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-200 line-clamp-2 sm:line-clamp-2 md:line-clamp-3 drop-shadow-md leading-snug">
                          {info.description || 'No description available.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action buttons for mobile */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-2/3 flex flex-col gap-2 sm:gap-3 z-20">
                    <button 
                      onClick={() => handleLike(book.id)} 
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-sm ${isLiked ? 'bg-red-600 text-white' : 'bg-white/95 text-black hover:bg-white'}`} 
                      title="Like"
                    >
                      <span className="text-sm sm:text-base md:text-lg">❤️</span>
                    </button>
                    <button 
                      onClick={() => handleSave(book.id)} 
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-sm ${isSaved ? 'bg-blue-600 text-white' : 'bg-white/95 text-black hover:bg-white'}`} 
                      title="Save"
                    >
                      <span className="text-sm sm:text-base md:text-lg">📚</span>
                    </button>
                    <button 
                      onClick={() => handleShare(book)} 
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-sm bg-white/95 text-black hover:bg-white" 
                      title="Share"
                    >
                      <span className="text-sm sm:text-base md:text-lg">📤</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop View - Three Column Layout */}
              <div className="hidden lg:flex relative z-10 items-center justify-center w-full h-full px-6 xl:px-12">
                <div className="w-full max-w-7xl h-full flex items-center gap-8 xl:gap-12">
                  {/* Left: Book Cover */}
                  <div className="flex-shrink-0 flex items-center justify-center max-w-md xl:max-w-lg">
                    {thumb ? (
                      <div className="relative h-[75vh] lg:h-[80vh] xl:h-[85vh] w-full max-w-full flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img 
                            src={thumb.replace('zoom=1', 'zoom=2') || thumb} 
                            alt={info.title} 
                            className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl xl:rounded-2xl shadow-2xl" 
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              const fallback = e.target.parentElement?.querySelector('.image-fallback')
                              if (fallback) fallback.style.display = 'flex'
                            }}
                          />
                          <div className="image-fallback hidden absolute inset-0 h-full w-full rounded-xl xl:rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-base xl:text-lg shadow-2xl border border-gray-700">
                            <span className="text-white/70 px-4 text-center">Image too large or failed to load</span>
                          </div>
                        </div>
                        {/* Black transparent overlay */}
                        <div className="absolute inset-0 bg-black/40 rounded-xl xl:rounded-2xl pointer-events-none"></div>
                      </div>
                    ) : (
                      <div className="relative h-[75vh] lg:h-[80vh] xl:h-[85vh] w-64 xl:w-72 flex items-center justify-center overflow-hidden">
                        <div className="h-full w-full rounded-xl xl:rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl xl:text-7xl shadow-2xl border border-gray-700">
                          📚
                        </div>
                        {/* Black transparent overlay */}
                        <div className="absolute inset-0 bg-black/40 rounded-xl xl:rounded-2xl pointer-events-none"></div>
                      </div>
                    )}
                  </div>

                  {/* Center: Text Container */}
                  <div className="flex-1 flex flex-col justify-center px-4 xl:px-6">
                    <h3 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-4 xl:mb-6 text-white leading-tight">
                      {info.title || 'Untitled'}
                    </h3>
                    <p className="text-base xl:text-lg 2xl:text-xl text-gray-200 leading-relaxed line-clamp-none">
                      {info.description || 'No description available.'}
                    </p>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex-shrink-0 flex flex-col gap-4 xl:gap-5 z-20">
                    <button 
                      onClick={() => handleLike(book.id)} 
                      className={`w-14 h-14 xl:w-16 xl:h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-sm ${isLiked ? 'bg-red-600 text-white' : 'bg-white/95 text-black hover:bg-white'}`} 
                      title="Like"
                    >
                      <span className="text-2xl xl:text-3xl">❤️</span>
                    </button>
                    <button 
                      onClick={() => handleSave(book.id)} 
                      className={`w-14 h-14 xl:w-16 xl:h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-sm ${isSaved ? 'bg-blue-600 text-white' : 'bg-white/95 text-black hover:bg-white'}`} 
                      title="Save"
                    >
                      <span className="text-2xl xl:text-3xl">📚</span>
                    </button>
                    <button 
                      onClick={() => handleShare(book)} 
                      className="w-14 h-14 xl:w-16 xl:h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-sm bg-white/95 text-black hover:bg-white" 
                      title="Share"
                    >
                      <span className="text-2xl xl:text-3xl">📤</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
        
        {/* Loading indicator for infinite scroll */}
        {loadingMore && (
          <section className="relative h-screen w-full flex items-center justify-center snap-start">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="text-white/70 text-sm">Loading more books...</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}


