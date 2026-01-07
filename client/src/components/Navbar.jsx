import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar() {
  const { user } = useAuth()
  const { items } = useCart()
  const { theme, toggleTheme } = useTheme()
  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0)

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg md:text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <img 
            src="/logo.jpeg" 
            alt="Digital Book Shelf Logo" 
            className="h-8 w-8 md:h-10 md:w-10 object-contain"
          />
          <span className="hidden sm:block">Digital Book Shelf</span>
          <span className="sm:hidden">DBS</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-5">
          <NavLink 
            to="/" 
            className={({isActive}) => 
              `px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/shorts" 
            className={({isActive}) => 
              `px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            Shorts
          </NavLink>
          <NavLink 
            to="/search" 
            className={({isActive}) => 
              `px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            Search
          </NavLink>
          <NavLink 
            to="/blogs" 
            className={({isActive}) => 
              `px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            Blogs
          </NavLink>
          <Link 
            to="/cart" 
            className="relative px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <NavLink 
            to="/chat" 
            className={({isActive}) => 
              `px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            🤖 Chat
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
                Hi, {user.name}
              </span>
              <NavLink 
                to="/profile" 
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Profile
              </NavLink>
              {/* Logout moved to Profile page */}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="px-3 md:px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs md:text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


