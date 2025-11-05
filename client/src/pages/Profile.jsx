import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getBook, getSavedBooks, listOrders, listProgress, toggleSavedBook } from '../lib/api.js'
import BookCard from '../components/BookCard.jsx'

export default function Profile() {
  const { user, logout } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('progress')
  const [savedIds, setSavedIds] = useState([])
  const [savedBooks, setSavedBooks] = useState([])
  const [orders, setOrders] = useState([])
  const [penName, setPenName] = useState('')
  const [penNameError, setPenNameError] = useState('')
  const [penNameSaving, setPenNameSaving] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [addressDraft, setAddressDraft] = useState({ id: '', label: 'Home', line1: '', line2: '', city: '', state: '', zip: '' })
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [showPenEditor, setShowPenEditor] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const fileInputRef = useRef(null)

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

  useEffect(() => {
    async function loadSaved() {
      const ids = await getSavedBooks()
      setSavedIds(ids)
      // fetch book details in parallel (limit to 12)
      const limited = ids.slice(0, 12)
      const books = await Promise.all(limited.map(id => getBook(id).catch(()=>null)))
      setSavedBooks(books.filter(Boolean))
    }
    async function loadOrders() {
      const data = await listOrders()
      setOrders(data)
    }
    function loadProfileLocal() {
      const keyUser = user?.email || 'guest'
      const penMap = JSON.parse(localStorage.getItem('pen_names') || '{}')
      if (penMap[keyUser]) setPenName(penMap[keyUser])
      const addrMap = JSON.parse(localStorage.getItem('addresses') || '{}')
      if (Array.isArray(addrMap[keyUser])) setAddresses(addrMap[keyUser])
      const avatars = JSON.parse(localStorage.getItem('avatars') || '{}')
      if (avatars[keyUser]) setAvatarUrl(avatars[keyUser])
    }
    if (user) {
      loadSaved()
      loadOrders()
      loadProfileLocal()
    }
  }, [user])

  const profileInitial = useMemo(() => (user?.name?.charAt(0)?.toUpperCase() || '👤'), [user])

  function persistPenName(nextPen) {
    const keyUser = user?.email || 'guest'
    const penMap = JSON.parse(localStorage.getItem('pen_names') || '{}')
    penMap[keyUser] = nextPen
    localStorage.setItem('pen_names', JSON.stringify(penMap))
  }

  function isPenNameTaken(candidate) {
    const penMap = JSON.parse(localStorage.getItem('pen_names') || '{}')
    return Object.entries(penMap).some(([k, v]) => v?.toLowerCase() === candidate.toLowerCase() && k !== (user?.email || 'guest'))
  }

  async function savePenName() {
    setPenNameError('')
    if (!penName || penName.trim().length < 3) {
      setPenNameError('Pen Name must be at least 3 characters')
      return
    }
    if (isPenNameTaken(penName.trim())) {
      setPenNameError('This pen name is already taken')
      return
    }
    setPenNameSaving(true)
    try {
      await new Promise(r => setTimeout(r, 500))
      persistPenName(penName.trim())
      setShowPenEditor(false)
    } finally {
      setPenNameSaving(false)
    }
  }

  function persistAddresses(next) {
    const keyUser = user?.email || 'guest'
    const addrMap = JSON.parse(localStorage.getItem('addresses') || '{}')
    addrMap[keyUser] = next
    localStorage.setItem('addresses', JSON.stringify(addrMap))
  }

  function startAddAddress() {
    setAddressDraft({ id: '', label: 'Home', line1: '', line2: '', city: '', state: '', zip: '' })
    setShowAddressModal(true)
  }

  function startEditAddress(addr) {
    setAddressDraft(addr)
    setShowAddressModal(true)
  }

  function saveAddress(e) {
    e.preventDefault()
    const draft = { ...addressDraft }
    const id = draft.id || `${Date.now()}`
    const nextList = draft.id
      ? addresses.map(a => a.id === draft.id ? { ...draft, id } : a)
      : [...addresses, { ...draft, id }]
    setAddresses(nextList)
    persistAddresses(nextList)
    setShowAddressModal(false)
  }

  function deleteAddress(id) {
    const nextList = addresses.filter(a => a.id !== id)
    setAddresses(nextList)
    persistAddresses(nextList)
  }

  function persistAvatar(dataUrl) {
    const keyUser = user?.email || 'guest'
    const avatars = JSON.parse(localStorage.getItem('avatars') || '{}')
    avatars[keyUser] = dataUrl
    localStorage.setItem('avatars', JSON.stringify(avatars))
  }

  function onClickEditAvatar() {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  function onAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setAvatarUrl(dataUrl)
      persistAvatar(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">👤</div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Please Login</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          You need to be logged in to view your profile.
        </p>
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          <span>🔑</span>
          Login Now
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: 'progress', label: 'Reading Stats', icon: '📚' },
    { id: 'saved', label: 'Saved Books', icon: '❤️' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header (Instagram-like) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center gap-6 md:gap-8">
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[3px]">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center text-3xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{profileInitial}</span>
                )}
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            <button onClick={onClickEditAvatar} className="absolute -bottom-1 -right-1 px-2 py-1 text-xs rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow">
              Edit
            </button>
          </div>
          <div className="flex-1 grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                {penName && (
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">@{penName}</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
            <div>{/* Pen name editing moved to Settings > Account */}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'progress' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reading Stats</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">{items.length} active</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Track your ongoing reads here.</p>
            </div>

            {loading ? (
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-xl mb-3"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="lg:col-span-2 text-center py-12">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No reading progress yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Start reading books to track your progress here.</p>
                <Link to="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                  <span>🔍</span>
                  Find Books
                </Link>
              </div>
            ) : (
              <div className="lg:col-span-2 grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                {items.map((item) => (
                  <div key={item._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.volumeId}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Pages Read:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{item.pagesRead}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Reading Time:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{Math.round((item.secondsRead || 0) / 60)} min</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min((item.pagesRead || 0) / 10, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Books</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{savedIds.length} saved</span>
            </div>
            {savedIds.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❤️</div>
                <p className="text-gray-600 dark:text-gray-300">No saved books yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedBooks.map(b => {
                  const info = b.volumeInfo || {}
                  return (
                    <div key={b.id} className="space-y-3">
                      <BookCard 
                        id={b.id}
                        title={info.title}
                        authors={info.authors}
                        thumbnail={info.imageLinks?.thumbnail}
                        price={b.saleInfo?.listPrice?.amount}
                        rating={info.averageRating}
                      />
                      <button 
                        onClick={async()=>{ await toggleSavedBook(b.id); setSavedIds(ids=>ids.filter(x=>x!==b.id)); setSavedBooks(list=>list.filter(x=>x.id!==b.id)) }}
                        className="w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{orders.length} orders</span>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-300">No orders yet.</div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Total: ₹{order.amount}</div>
                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Pending' || order.status==='created' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {order.status === 'created' ? 'Pending' : order.status === 'paid' ? 'Delivered' : order.status}
                        </span>
                      </div>
                    </div>
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-gray-700 dark:text-gray-300">View Details</summary>
                      <div className="mt-3 space-y-2">
                        {(order.items || []).map((it, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">{it.title}</span>
                            <span className="text-gray-500">₹{it.price} × {it.quantity || 1}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input type="text" value={user.name} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input type="email" value={user.email} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pen Name</label>
                  {!showPenEditor && (
                    <div className="flex items-center gap-2">
                      {penName ? (
                        <>
                          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">@{penName}</span>
                          <button onClick={()=>{ setShowPenEditor(true); setPenNameError('') }} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700">Edit</button>
                        </>
                      ) : (
                        <button onClick={()=>setShowPenEditor(true)} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">Add pen name</button>
                      )}
                    </div>
                  )}
                  {showPenEditor && (
                    <div className="mt-2">
                      <div className="flex gap-2">
                        <input
                          value={penName}
                          onChange={(e)=>{ setPenName(e.target.value); setPenNameError('') }}
                          placeholder="Choose your unique pen name"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button onClick={savePenName} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:bg-gray-400" disabled={penNameSaving}>{penNameSaving ? 'Saving...' : 'Save'}</button>
                        <button onClick={()=>{ setShowPenEditor(false); setPenNameError('') }} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
                      </div>
                      {penNameError && <div className="text-xs text-red-600 mt-1">{penNameError}</div>}
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <button onClick={()=>setConfirmLogout(true)} className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors">Logout</button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Addresses</h3>
                <button onClick={startAddAddress} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm">Add Address</button>
              </div>
              {addresses.length === 0 ? (
                <div className="text-sm text-gray-600 dark:text-gray-300">No addresses yet.</div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div key={addr.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{addr.label}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{addr.line1}</div>
                        {addr.line2 && <div className="text-sm text-gray-700 dark:text-gray-300">{addr.line2}</div>}
                        <div className="text-xs text-gray-500">{addr.city}, {addr.state} {addr.zip}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={()=>startEditAddress(addr)} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs">Edit</button>
                        <button onClick={()=>deleteAddress(addr.id)} className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{addressDraft.id ? 'Edit Address' : 'Add Address'}</h4>
            <form onSubmit={saveAddress} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-300">Label</label>
                <select value={addressDraft.label} onChange={(e)=>setAddressDraft(d=>({...d, label: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                  <option>Home</option>
                  <option>Office</option>
                  <option>Delivery</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-300">Address Line 1</label>
                <input value={addressDraft.line1} onChange={(e)=>setAddressDraft(d=>({...d, line1: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-300">Address Line 2</label>
                <input value={addressDraft.line2} onChange={(e)=>setAddressDraft(d=>({...d, line2: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-300">City</label>
                  <input value={addressDraft.city} onChange={(e)=>setAddressDraft(d=>({...d, city: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required />
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-300">State</label>
                  <input value={addressDraft.state} onChange={(e)=>setAddressDraft(d=>({...d, state: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-300">ZIP / PIN</label>
                <input value={addressDraft.zip} onChange={(e)=>setAddressDraft(d=>({...d, zip: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button type="button" onClick={()=>setShowAddressModal(false)} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirm Modal at bottom */}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Logout</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to log out?</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={()=>setConfirmLogout(false)} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={logout} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


