import { Router } from 'express'
import axios from 'axios'

const router = Router()
const googleBase = 'https://www.googleapis.com/books/v1'
const googleKey = process.env.GOOGLE_BOOKS_KEY

// Mood to search query mapping
const moodMap = {
  happy: 'uplifting OR feel-good OR joy',
  sad: 'heartwarming OR hopeful',
  adventurous: 'adventure OR journey OR quest',
  romantic: 'romance OR love story',
  mystery: 'mystery OR thriller',
  motivational: 'self-help OR motivation OR success',
  fantasy: 'fantasy OR magic',
  sciFi: 'science fiction OR sci-fi',
  horror: 'horror OR scary',
  comedy: 'comedy OR humorous',
  drama: 'drama OR emotional',
  biography: 'biography OR memoir',
  history: 'history OR historical',
  business: 'business OR entrepreneurship',
  technology: 'technology OR tech',
}

// Check if message is book-related
function isBookRelated(message) {
  const lowerMsg = message.toLowerCase()
  
  // Book-related keywords
  const bookKeywords = [
    'book', 'books', 'novel', 'novels', 'story', 'stories', 'read', 'reading', 'reader',
    'author', 'authors', 'genre', 'genres', 'fiction', 'non-fiction', 'literature',
    'recommend', 'recommendation', 'recommendations', 'suggest', 'suggestion',
    'popular', 'trending', 'bestseller', 'bestsellers', 'new release', 'latest',
    'mystery', 'romance', 'fantasy', 'sci-fi', 'science fiction', 'horror', 'thriller',
    'adventure', 'adventurous', 'romantic', 'happy', 'sad', 'motivational', 'self-help',
    'biography', 'memoir', 'history', 'business', 'technology', 'comedy', 'drama',
    'mood', 'looking for', 'want', 'need', 'find', 'search', 'explore', 'discover'
  ]
  
  // Check if message contains any book-related keywords
  return bookKeywords.some(keyword => lowerMsg.includes(keyword))
}

// Extract mood/keywords from user message
function extractQuery(message) {
  const lowerMsg = message.toLowerCase()
  
  // Check for specific moods
  for (const [mood, query] of Object.entries(moodMap)) {
    if (lowerMsg.includes(mood) || lowerMsg.includes(mood.replace(/([A-Z])/g, ' $1').toLowerCase())) {
      return { type: 'mood', query, mood }
    }
  }
  
  // Check for genre keywords
  const genreKeywords = {
    'fiction': 'fiction',
    'non-fiction': 'non-fiction',
    'novel': 'fiction',
    'story': 'fiction',
    'book': 'bestseller',
    'recommend': 'bestseller',
    'popular': 'bestseller',
    'trending': 'bestseller',
    'new': 'new releases',
    'latest': 'new releases',
  }
  
  for (const [keyword, query] of Object.entries(genreKeywords)) {
    if (lowerMsg.includes(keyword)) {
      return { type: 'genre', query }
    }
  }
  
  // Default to bestseller search
  return { type: 'default', query: 'bestseller' }
}

// Chatbot endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }
    
    const userMessage = message.trim().toLowerCase()
    
    // Handle greetings
    if (userMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
      return res.json({
        response: "Hello! 👋 I'm your AI book assistant. I can help you find books based on your mood, genre preferences, or specific interests. What kind of books are you looking for today?",
        recommendations: null
      })
    }
    
    // Handle help requests
    if (userMessage.includes('help') || userMessage.includes('what can you do')) {
      return res.json({
        response: "I can help you with:\n\n📚 Book recommendations based on your mood\n🔍 Finding books by genre (fiction, mystery, romance, sci-fi, etc.)\n📖 Suggesting popular and trending books\n💡 Helping you discover new releases\n\nJust tell me what you're in the mood for or what genre interests you!",
        recommendations: null
      })
    }
    
    // Handle thank you
    if (userMessage.match(/^(thanks|thank you|thank|appreciate)/)) {
      return res.json({
        response: "You're welcome! 😊 Feel free to ask me for more book recommendations anytime. Happy reading! 📚",
        recommendations: null
      })
    }
    
    // Check if message is book-related
    if (!isBookRelated(message)) {
      return res.json({
        response: "Sorry, I can only help with book suggestions. Please ask me about books, genres, or book recommendations! 📚",
        recommendations: null
      })
    }
    
    // Extract query and search for books
    const { query, mood } = extractQuery(message)
    const searchQuery = query || 'bestseller'
    
    try {
      const params = new URLSearchParams({ q: searchQuery, maxResults: '10' })
      if (googleKey) params.set('key', googleKey)
      
      const { data } = await axios.get(`${googleBase}/volumes?${params.toString()}`)
      const books = (data.items || []).slice(0, 5).map(item => ({
        id: item.id,
        title: item.volumeInfo?.title,
        authors: item.volumeInfo?.authors || ['Unknown'],
        description: item.volumeInfo?.description?.substring(0, 150) + '...' || 'No description available',
        thumbnail: item.volumeInfo?.imageLinks?.thumbnail || null,
        previewLink: item.volumeInfo?.previewLink || null
      }))
      
      if (books.length > 0) {
        const bookList = books.map((book, idx) => 
          `${idx + 1}. **${book.title}** by ${book.authors.join(', ')}`
        ).join('\n')
        
        let response = `Great! Here are some book recommendations for you:\n\n${bookList}\n\n`
        
        if (mood) {
          response += `These books match your "${mood}" mood. Would you like more recommendations or help with something else?`
        } else {
          response += `Would you like more recommendations or help finding books in a specific genre?`
        }
        
        return res.json({
          response,
          recommendations: books
        })
      } else {
        return res.json({
          response: "I couldn't find specific books for that query. Try asking for books by mood (happy, adventurous, romantic) or genre (mystery, sci-fi, fantasy). What would you like to explore?",
          recommendations: null
        })
      }
    } catch (searchError) {
      console.error('Google Books API error:', searchError)
      return res.json({
        response: "I'm having trouble searching for books right now. Please try again in a moment, or ask me about book recommendations in a different way!",
        recommendations: null
      })
    }
  } catch (error) {
    console.error('Chatbot error:', error)
    res.status(500).json({ 
      error: 'Failed to process chat message',
      response: "I encountered an error. Please try again!"
    })
  }
})

export default router
