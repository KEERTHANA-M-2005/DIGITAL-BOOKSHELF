import { Link } from 'react-router-dom'

export default function ChatWidget() {
  return (
    <Link to="/chat" className="fixed bottom-6 right-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white shadow-lg">
      <span>Chat</span>
    </Link>
  )
}


