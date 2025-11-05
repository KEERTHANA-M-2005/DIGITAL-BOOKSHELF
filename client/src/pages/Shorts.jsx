import { useEffect, useMemo, useState } from 'react'
import { api, searchBooks } from '../lib/api.js'

export default function Shorts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [likedIds, setLikedIds] = useState(new Set())
  const [savedIds, setSavedIds] = useState(new Set())

  useEffect(() => {
    async function load() {
      try {
        const data = await searchBooks('bestsellers')
        const books = (data.items || []).map(it => it)
        setItems(books)
      } catch (e) {
        setError('Failed to load shorts')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLike = async (volumeId) => {
    try {
      const { data } = await api.post(`/api/books/${volumeId}/like`)
      setLikedIds(prev => {
        const copy = new Set(prev)
        if (data.liked) copy.add(volumeId); else copy.delete(volumeId)
        return copy
      })
    } catch {}
  }

  const handleSave = async (volumeId) => {
    try {
      const { data } = await api.post(`/api/books/${volumeId}/save`)
      setSavedIds(prev => {
        const copy = new Set(prev)
        if (data.saved) copy.add(volumeId); else copy.delete(volumeId)
        return copy
      })
    } catch {}
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

  if (loading) return <div className="h-[80vh] flex items-center justify-center text-gray-600 dark:text-gray-300">Loading...</div>
  if (error) return <div className="h-[80vh] flex items-center justify-center text-red-600">{error}</div>

  return (
    <div className="relative bg-black text-white">
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        {items.map((book, idx) => {
          const info = book.volumeInfo || {}
          const thumb = info.imageLinks?.thumbnail || ''
          const isLiked = likedIds.has(book.id)
          const isSaved = savedIds.has(book.id)
          return (
            <section key={book.id || idx} className="relative h-screen w-full flex items-center justify-center snap-start">
              {/* Background overlay with gradient */}
              <div className="absolute inset-0 bg-black">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent"/>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"/>
              </div>

              {/* Center content */}
              <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-center">
                  <div className="col-span-1 flex justify-center">
                    {thumb ? (
                      <img src={thumb} alt={info.title} className="max-h-[70vh] object-contain rounded-2xl shadow-2xl" />
                    ) : (
                      <div className="h-[70vh] w-60 rounded-2xl bg-gray-800 flex items-center justify-center">📚</div>
                    )}
                  </div>

                  <div className="hidden md:block col-span-1 md:col-span-2 text-gray-200">
                    <h3 className="text-2xl font-bold mb-4">{info.title}</h3>
                    <p className="opacity-80 line-clamp-[12]">
                      {info.description || 'No description available.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Title for mobile */}
              <div className="md:hidden absolute bottom-36 left-0 right-0 px-4">
                <h3 className="text-xl font-semibold">{info.title}</h3>
              </div>

              {/* Mobile description */}
              <div className="md:hidden absolute bottom-20 left-0 right-0 px-4 text-sm text-gray-300 line-clamp-4">
                {info.description}
              </div>

              {/* Floating action buttons */}
              <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                <button onClick={() => handleLike(book.id)} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition ${isLiked ? 'bg-red-600' : 'bg-white/90 text-black'}`} title="Like">
                  <span>❤️</span>
                </button>
                <button onClick={() => handleSave(book.id)} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition ${isSaved ? 'bg-blue-600' : 'bg-white/90 text-black'}`} title="Save">
                  <span>📚</span>
                </button>
                <button onClick={() => handleShare(book)} className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition bg-white/90 text-black" title="Share">
                  <span>📤</span>
                </button>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}


