import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { listProgress } from '../lib/api.js'

export default function Profile() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load() {
      setLoading(true)
      try {
        const data = await listProgress()
        setItems(data)
      } finally {
        setLoading(false)
      }
    }
    if (user) load()
  }, [user])

  if (!user) return <p>Please login to view your profile.</p>

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No reading progress yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p._id} className="border rounded p-3">
              <div className="font-medium">Book: {p.volumeId}</div>
              <div className="text-sm text-gray-600">Pages read: {p.pagesRead} • Time: {Math.round((p.secondsRead||0)/60)} min</div>
              <div className="text-xs text-gray-500">Updated: {new Date(p.updatedAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}


