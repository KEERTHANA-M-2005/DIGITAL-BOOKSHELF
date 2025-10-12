import { useState, useRef, useEffect } from 'react'
import { api } from '../lib/api.js'

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi! I\'m your AI book recommendation assistant. Tell me your mood or what kind of book you\'re looking for, and I\'ll suggest some great reads! 📚',
      timestamp: new Date()
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
      timestamp: new Date()
    }
    setMessages((m)=>[...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const mood = input.trim().toLowerCase()
      const { data } = await api.get('/api/books/recommendations/mood', { params: { mood } })
      const titles = (data.items || []).slice(0,5).map(v => v.volumeInfo?.title).filter(Boolean)
      
      let reply
      if (titles.length) {
        reply = `Based on your mood "${mood}", here are some book recommendations:\n\n${titles.map((title, i) => `${i + 1}. ${title}`).join('\n')}\n\nWould you like me to suggest more books or help with something else?`
      } else {
        reply = `I couldn't find specific recommendations for "${mood}". Try asking for books by mood like "adventurous", "romantic", "mystery", or "self-help".`
      }
      
      setMessages((m)=>[...m, { 
        role: 'assistant', 
        content: reply,
        timestamp: new Date()
      }])
    } catch (e) {
      setMessages((m)=>[...m, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while fetching recommendations. Please try again in a moment.',
        timestamp: new Date()
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
    { mood: 'sad', emoji: '😢', label: 'Heartwarming' },
    { mood: 'motivational', emoji: '💪', label: 'Self-Help' }
  ]

  const handleQuickMood = (mood) => {
    setInput(mood)
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
          <li>• Describe your current mood (happy, sad, adventurous, etc.)</li>
          <li>• Mention genres you enjoy (mystery, romance, sci-fi, etc.)</li>
          <li>• Ask for books similar to ones you've loved</li>
          <li>• Specify if you want fiction or non-fiction</li>
        </ul>
      </div>
    </div>
  )
}


