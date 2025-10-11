import { useState } from 'react'
import { api } from '../lib/api.js'

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! Ask me for book recommendations.' }])
  const [input, setInput] = useState('')

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input.trim() }
    setMessages((m)=>[...m, userMsg])
    setInput('')
    try {
      const mood = input.trim().toLowerCase()
      const { data } = await api.get('/api/books/recommendations/mood', { params: { mood } })
      const titles = (data.items || []).slice(0,5).map(v => v.volumeInfo?.title).filter(Boolean)
      const reply = titles.length ? `Here are some picks: ${titles.join(', ')}` : 'No recommendations found.'
      setMessages((m)=>[...m, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages((m)=>[...m, { role: 'assistant', content: 'Sorry, I could not fetch recommendations.' }])
    }
  }

  return (
    <section className="flex flex-col h-[70vh]">
      <h1 className="text-2xl font-semibold mb-4">AI Chatbot</h1>
      <div className="flex-1 border rounded p-3 overflow-auto bg-white dark:bg-gray-950">
        {messages.map((m, idx)=> (
          <div key={idx} className={m.role === 'assistant' ? 'text-blue-700 dark:text-blue-300 mb-2' : 'text-gray-800 dark:text-gray-200 mb-2'}>
            <strong>{m.role === 'assistant' ? 'Assistant' : 'You'}:</strong> {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input value={input} onChange={(e)=>setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Ask for mood-based recommendations..." />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      </form>
    </section>
  )
}


