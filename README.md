# Digital Book Shelf (MERN)

A full-stack book recommendation and e-commerce platform built with React, Express, MongoDB, and Google Books API.

## 🚀 Quick Start

See **[QUICK_START.md](./QUICK_START.md)** for a 5-minute setup guide.

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed documentation.

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)
- Google Books API Key (Optional but recommended)

## ⚡ Quick Setup

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Set up environment variables (see SETUP_GUIDE.md)

# 3. Start servers
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm run dev

# 4. Open http://localhost:5173
```

## ✨ Features

### User Features
- 📚 **Home** - Browse trending and recommended books
- 🔍 **Search** - Search books using Google Books API
- 📖 **Shorts** - Instagram/Youtube-style infinite scroll book feed
- 🤖 **AI Chatbot** - Get personalized book recommendations
- 🛒 **Shopping Cart** - Add books to cart and checkout
- 📝 **Blogs** - Read and create blog posts
- 👤 **Profile** - Manage saved books, progress, and orders
- ❤️ **Like & Save** - Bookmark favorite books

### Admin Features
- 👥 **User Management** - View and manage all users
- 📊 **Activity Logs** - Track user activities
- 📈 **Statistics** - Dashboard with user and activity stats
- 🔐 **Admin Control** - Promote/demote users to admin

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router

**Backend:**
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Google Books API

## 📁 Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── lib/
│   └── public/
│
└── server/          # Express backend
    ├── src/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   └── utils/
    └── .env
```

## 🔐 Admin Setup

After creating your account, make yourself admin:

```bash
cd server
node src/scripts/makeAdmin.js your-email@example.com
```

Then log out and log back in to see the Admin link in navbar.

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup and usage guide

## 🐛 Troubleshooting

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting) for common issues and solutions.

## 📝 License

This project is for educational purposes.


