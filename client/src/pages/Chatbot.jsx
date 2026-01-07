import { useState, useRef, useEffect } from 'react'
import { api } from '../lib/api.js'
import { Link } from 'react-router-dom'

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi! 👋 I\'m your AI book recommendation assistant. Tell me your mood, favorite genres, or what kind of book you\'re looking for, and I\'ll suggest some great reads! 📚\n\nYou can ask me things like:\n• "I want something adventurous"\n• "Recommend mystery books"\n• "What are popular books?"\n• "Help me find romance novels"',
      timestamp: new Date(),
      recommendations: null
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || loading) return
    
    const userMsg = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date(),
      recommendations: null
    }
    setMessages((m)=>[...m, userMsg])
    const userInput = input.trim()
    setInput('')
    setLoading(true)

    try {
      const { data } = await api.post('/api/chatbot/chat', {
        message: userInput,
        conversationHistory: messages.slice(-5) // Send last 5 messages for context
      })
      
      setMessages((m)=>[...m, { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date(),
        recommendations: data.recommendations || null
      }])
    } catch (e) {
      console.error('Chatbot error:', e)
      setMessages((m)=>[...m, { 
        role: 'assistant', 
        content: e.response?.data?.response || 'Sorry, I encountered an error. Please try again in a moment.',
        timestamp: new Date(),
        recommendations: null
      }])
    } finally {
      setLoading(false)
    }
  }

  const quickMoods = [
    { mood: 'adventurous', emoji: '🏔️', label: 'Adventure' },
    { mood: 'romantic', emoji: '💕', label: 'Romance' },
    { mood: 'mystery', emoji: '🕵️', label: 'Mystery' },
    { mood: 'happy', emoji: '😊', label: 'Feel Good' },
    { mood: 'fantasy', emoji: '✨', label: 'Fantasy' },
    { mood: 'sci-fi', emoji: '🚀', label: 'Sci-Fi' },
    { mood: 'motivational', emoji: '💪', label: 'Self-Help' },
    { mood: 'horror', emoji: '👻', label: 'Horror' }
  ]

  const handleQuickMood = (mood) => {
    setInput(`I want ${mood} books`)
    // Auto-submit after a short delay
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) form.requestSubmit()
    }, 100)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🤖</span>
          <h1 className="text-2xl font-bold">AI Book Assistant</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Get personalized book recommendations based on your mood and preferences
        </p>
      </div>

      {/* Quick Mood Buttons */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick moods:</h3>
        <div className="flex flex-wrap gap-2">
          {quickMoods.map(({ mood, emoji, label }) => (
            <button
              key={mood}
              onClick={() => handleQuickMood(mood)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <span>{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message, idx) => (
            <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}>
                <div className="text-sm font-medium mb-1">
                  {message.role === 'assistant' ? '🤖 Assistant' : '👤 You'}
                </div>
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                
                {/* Book Recommendations */}
                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="mt-3 space-y-2 pt-3 border-t border-gray-300 dark:border-gray-600">
                    {message.recommendations.map((book) => (
                      <Link
                        key={book.id}
                        to={`/book/${book.id}`}
                        className="block p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex gap-3">
                          {book.thumbnail && (
                            <img 
                              src={book.thumbnail} 
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                              {book.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              by {book.authors.join(', ')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                              {book.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  Assistant is thinking...
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input 
              value={input} 
              onChange={(e)=>setInput(e.target.value)} 
              placeholder="Tell me your mood or what you're looking for..." 
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>📤</span>
                  Send
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Tips for better recommendations:</h3>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Describe your current mood (happy, sad, adventurous, romantic, etc.)</li>
          <li>• Mention genres you enjoy (mystery, romance, sci-fi, fantasy, horror, etc.)</li>
          <li>• Ask for popular or trending books</li>
          <li>• Request new releases or bestsellers</li>
          <li>• Click on recommended books to view details and add to cart</li>
        </ul>
      </div>
    </div>
  )
}


