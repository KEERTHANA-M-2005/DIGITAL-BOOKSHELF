import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import BookDetails from './pages/BookDetails.jsx'
import Cart from './pages/Cart.jsx'
import BlogPage from './pages/BlogPage.jsx'
import Profile from './pages/Profile.jsx'
import Chatbot from './pages/Chatbot.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<Chatbot />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </main>
            <ThemeToggle />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}


