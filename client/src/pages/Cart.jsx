import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Cart() {
  const { items, total, removeItem, clear, checkout } = useCart()
  const { user } = useAuth()
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState('cart') // cart, shipping, payment, success

  async function onCheckout() {
    setMsg('')
    setLoading(true)
    if (!user) { 
      setMsg('Please login to checkout.')
      setLoading(false)
      return 
    }
    try {
      const res = await checkout()
      setMsg(`Order placed successfully! Order ID: ${res.orderId}`)
      setCheckoutStep('success')
      clear()
    } catch (e) {
      setMsg('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checkoutStep === 'success') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-100 dark:bg-green-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Thank you for your purchase. You will receive a confirmation email shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/profile" 
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Looks like you haven't added any books to your cart yet.
          </p>
          <Link 
            to="/search" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            <span>🔍</span>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Book Image */}
                  <div className="flex-shrink-0">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-20 h-28 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-28 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl text-gray-400">📚</span>
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      by {(item.authors || []).join(', ')}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button 
                          onClick={() => {
                            if (item.quantity > 1) {
                              // Decrease quantity logic would go here
                            } else {
                              removeItem(item.id)
                            }
                          }}
                          className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 text-gray-900 dark:text-white font-medium">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => {
                            // Increase quantity logic would go here
                          }}
                          className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{Number(item.price || 0) * Number(item.quantity || 1)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ₹{item.price} each
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button 
                onClick={clear}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal ({items.length} items)</span>
                  <span className="text-gray-900 dark:text-white">₹{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                  <span className="text-gray-900 dark:text-white">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Tax</span>
                  <span className="text-gray-900 dark:text-white">₹0</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">₹{total}</span>
                  </div>
                </div>
              </div>

              {msg && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  msg.includes('successfully') 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                    : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}>
                  {msg}
                </div>
              )}

              {!user ? (
                <div className="space-y-4">
                  <div className="text-center text-gray-600 dark:text-gray-300 text-sm">
                    Please login to checkout
                  </div>
                  <Link 
                    to="/login" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors text-center block"
                  >
                    Login to Continue
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={onCheckout}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>💳</span>
                      Proceed to Checkout
                    </>
                  )}
                </button>
              )}

              <div className="mt-6 text-center">
                <Link 
                  to="/search" 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


