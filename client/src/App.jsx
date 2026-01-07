import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { PaymentProvider } from './context/PaymentContext.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import BookDetails from './pages/BookDetails.jsx'
import Cart from './pages/Cart.jsx'
import BlogPage from './pages/BlogPage.jsx'
import BlogNew from './pages/BlogNew.jsx'
import BlogDetails from './pages/BlogDetails.jsx'
import Profile from './pages/Profile.jsx'
import Shorts from './pages/Shorts.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Chatbot from './pages/Chatbot.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PaymentProvider>
          <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/blogs/new" element={<ProtectedRoute><BlogNew /></ProtectedRoute>} />
                <Route path="/blogs/:id" element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} />
                <Route path="/shorts" element={<ProtectedRoute><Shorts /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/chat" element={<Chatbot />} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </main>
            <ThemeToggle />
          </div>
        </CartProvider>
        </PaymentProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}


