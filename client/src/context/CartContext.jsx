import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../lib/api.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  function addItem(item) {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === item.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: (copy[idx].quantity || 1) + (item.quantity || 1) }
        return copy
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  function removeItem(id) {
    setItems(prev => prev.filter(p => p.id !== id))
  }

  function clear() { setItems([]) }

  const total = useMemo(() => items.reduce((s, i)=> s + Number(i.price || 0) * Number(i.quantity || 1), 0), [items])

  async function checkout() {
    const payload = { items: items.map(i => ({ volumeId: i.id, title: i.title, price: i.price, quantity: i.quantity })) }
    const { data } = await api.post('/api/cart/checkout', payload)
    return data
  }

  return (
    <CartContext.Provider value={{ items, total, addItem, removeItem, clear, checkout }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }






