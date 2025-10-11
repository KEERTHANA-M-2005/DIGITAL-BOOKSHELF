import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBook } from '../lib/api.js'
import { useCart } from '../context/CartContext.jsx'

export default function BookDetails() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

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

  if (loading) return <p>Loading...</p>
  if (!book) return <p>Not found</p>

  const info = book.volumeInfo || {}
  const sale = book.saleInfo || {}
  const price = sale.listPrice?.amount ? `₹ ${sale.listPrice.amount}` : '—'

  return (
    <section className="grid md:grid-cols-2 gap-6">
      <div>
        {info.imageLinks?.thumbnail ? (
          <img src={info.imageLinks.thumbnail} alt={info.title} className="w-full max-w-sm rounded" />
        ) : (
          <div className="w-full max-w-sm h-80 bg-gray-200 dark:bg-gray-800 rounded" />
        )}
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">{info.title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{(info.authors || []).join(', ')}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{(info.categories || []).join(' • ')}</p>
        <p className="text-sm">Rating: {info.averageRating ?? '—'}</p>
        <p className="font-semibold">Price: {price}</p>
        <div className="flex gap-2 pt-2">
          <button className="px-4 py-2 rounded bg-green-600 text-white">Buy Now</button>
          <button className="px-4 py-2 rounded border" onClick={()=> addItem({ id, title: info.title, price: sale.listPrice?.amount || 0 })}>Add to Cart</button>
        </div>
        {info.previewLink && (
          <a href={info.previewLink} target="_blank" rel="noreferrer" className="inline-block text-blue-600">Preview</a>
        )}
      </div>
    </section>
  )
}


