import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { createVlog, listVlogs } from '../lib/api.js'

export default function VlogPage() {
  const { user } = useAuth()
  const [vlogs, setVlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ volumeId: '', title: '', contentUrl: '', kind: 'short' })
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    try {
      const data = await listVlogs()
      setVlogs(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> { load() }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('')
    if (!user) { setMsg('Please login to upload.'); return }
    if (!form.volumeId || !form.title || !form.contentUrl) { setMsg('All fields are required.'); return }
    try {
      await createVlog(form)
      setForm({ volumeId: '', title: '', contentUrl: '', kind: 'short' })
      setMsg('Uploaded!')
      load()
    } catch (e) {
      setMsg('Failed to upload')
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Vlogs & Shorts</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {loading ? (
            <p>Loading...</p>
          ) : vlogs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No vlogs yet.</p>
          ) : (
            <div className="space-y-3">
              {vlogs.map(v => (
                <div key={v._id} className="border rounded p-3">
                  <div className="text-sm text-gray-500">{v.kind?.toUpperCase()} • {v.volumeId}</div>
                  <div className="font-semibold">{v.title}</div>
                  <a className="text-blue-600 text-sm" href={v.contentUrl} target="_blank" rel="noreferrer">View</a>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-2">Share your vlog/short</h2>
          {msg && <p className="text-sm mb-2">{msg}</p>}
          <form onSubmit={onSubmit} className="space-y-2">
            <input value={form.volumeId} onChange={(e)=>setForm(f=>({...f, volumeId: e.target.value}))} placeholder="Google Volume ID" className="w-full border rounded px-3 py-2" />
            <input value={form.title} onChange={(e)=>setForm(f=>({...f, title: e.target.value}))} placeholder="Title" className="w-full border rounded px-3 py-2" />
            <input value={form.contentUrl} onChange={(e)=>setForm(f=>({...f, contentUrl: e.target.value}))} placeholder="Video URL or link" className="w-full border rounded px-3 py-2" />
            <select value={form.kind} onChange={(e)=>setForm(f=>({...f, kind: e.target.value}))} className="w-full border rounded px-3 py-2">
              <option value="short">Short</option>
              <option value="vlog">Vlog</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded w-full">Upload</button>
          </form>
        </div>
      </div>
    </section>
  )
}


