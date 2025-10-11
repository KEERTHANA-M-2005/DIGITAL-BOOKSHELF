import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Cart() {
  const { items, total, removeItem, clear, checkout } = useCart()
  const { user } = useAuth()
  const [msg, setMsg] = useState('')

  async function onCheckout() {
    setMsg('')
    if (!user) { setMsg('Please login to checkout.'); return }
    try {
      const res = await checkout()
      setMsg(`Order placed: ${res.orderId}`)
      clear()
    } catch (e) {
      setMsg('Checkout failed')
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {items.map(it => (
            <div key={it.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-gray-500">Qty: {it.quantity}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">₹ {Number(it.price || 0) * Number(it.quantity || 1)}</span>
                <button className="text-red-600" onClick={()=>removeItem(it.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-semibold">Total: ₹ {total}</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded" onClick={clear}>Clear</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={onCheckout}>Checkout</button>
            </div>
          </div>
          {msg && <p className="text-sm">{msg}</p>}
        </div>
      )}
    </section>
  )
}


