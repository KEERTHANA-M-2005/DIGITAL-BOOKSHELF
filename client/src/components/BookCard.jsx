import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function BookCard({ id, title, authors = [], thumbnail, price, rating }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleViewDetails = (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
    } else {
      navigate(`/book/${id}`)
    }
  }

  return (
    <div className="group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <span className="text-4xl text-gray-400">📚</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
          {price ? `₹${price}` : 'Free'}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
          {authors.join(', ')}
        </p>
        {rating && (
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{rating}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {price ? `₹${price}` : 'Free'}
          </span>
          <button
            onClick={handleViewDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}


