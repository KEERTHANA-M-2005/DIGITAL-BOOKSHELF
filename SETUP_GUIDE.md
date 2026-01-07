# Digital Book Shelf - Complete Setup & Usage Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Variables](#environment-variables)
4. [Running the Application](#running-the-application)
5. [Using the Website](#using-the-website)
6. [Admin Portal Setup](#admin-portal-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either:
  - MongoDB Atlas (Cloud - Recommended) - [Sign up here](https://www.mongodb.com/cloud/atlas)
  - MongoDB Community Edition (Local) - [Download here](https://www.mongodb.com/try/download/community)
- **Google Books API Key** (Free) - [Get it here](https://developers.google.com/books/docs/v1/using#APIKey)

---

## Initial Setup

### Step 1: Clone/Navigate to Project
```bash
cd "c:\Users\jlaks\OneDrive\Desktop\Git Final MAjor project"
```

### Step 2: Install Server Dependencies
```bash
cd server
npm install
```

### Step 3: Install Client Dependencies
```bash
cd ../client
npm install
```

---

## Environment Variables

### Server Environment (.env file in `server/` folder)

Create a file named `.env` in the `server/` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/digital-book-shelf
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/digital-book-shelf?retryWrites=true&w=majority

# Server Port (optional, defaults to 5000)
PORT=5000

# JWT Secret (use a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google Books API Key (optional, but recommended)
GOOGLE_BOOKS_KEY=your-google-books-api-key-here
```

### Client Environment (.env file in `client/` folder)

Create a file named `.env` in the `client/` directory:

```env
# Backend API URL (usually localhost:5000 for development)
VITE_API_BASE=http://localhost:5000

# Google Books API Key (optional)
VITE_GOOGLE_BOOKS_KEY=your-google-books-api-key-here
```

---

## Running the Application

### Option 1: Run Both Servers Separately (Recommended for Development)

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```
You should see: `Server listening on port 5000`

**Terminal 2 - Start Frontend Server:**
```bash
cd client
npm run dev
```
You should see: `Local: http://localhost:5173`

### Option 2: Run Both in One Command (if you have a process manager)

You can use tools like `concurrently` or `npm-run-all` to run both servers together.

---

## Using the Website

### 1. **Homepage** (`/`)
- Browse trending books
- See recommended books
- View continue reading (if logged in)

### 2. **Search** (`/search`)
- Search for books using Google Books API
- Filter and browse results
- Click on books to view details

### 3. **Shorts** (`/shorts`) - *Requires Login*
- Instagram/Youtube-style book browsing
- Infinite scroll with varied book recommendations
- Like, save, and share books
- Responsive design for mobile and desktop

### 4. **Book Details** (`/book/:id`) - *Requires Login*
- View full book information
- Read description
- Add to cart
- Like and save books

### 5. **Cart** (`/cart`) - *Requires Login*
- View items in cart
- Proceed to checkout
- Manage cart items

### 6. **Blogs** (`/blogs`)
- Read blog posts
- Create new blogs (if logged in)
- Like and comment on blogs

### 7. **Chatbot** (`/chat`)
- AI-powered book recommendation assistant
- Ask for books by mood, genre, or preferences
- Get personalized recommendations

### 8. **Profile** (`/profile`) - *Requires Login*
- View your saved books
- Track reading progress
- View order history
- Manage profile settings

### 9. **Admin Dashboard** (`/admin`) - *Requires Admin Access*
- View all users
- Manage user admin status
- View user activity logs
- View statistics

---

## Admin Portal Setup

### Step 1: Create Your First User

1. Go to `/signup` on the website
2. Create an account with your email and password

### Step 2: Make Yourself Admin

**Option A: Using the Script (Recommended)**
```bash
cd server
node src/scripts/makeAdmin.js your-email@example.com
```

**Option B: Using MongoDB Directly**
1. Open MongoDB Compass or MongoDB shell
2. Connect to your database
3. Find the `users` collection
4. Find your user document
5. Set `isAdmin: true`
6. Save

**Option C: Using MongoDB Atlas (if using cloud)**
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Find your database → `users` collection
4. Find your user document
5. Edit and set `isAdmin: true`

### Step 3: Access Admin Portal

1. Log out and log back in (to refresh your session)
2. You should now see "⚙️ Admin" in the navbar
3. Click it to access the admin dashboard

---

## Key Features Explained

### Authentication
- **Sign Up**: Create a new account
- **Login**: Access your account
- **Protected Routes**: Some pages require login (Shorts, Cart, Profile, etc.)

### Book Features
- **Search**: Find books using Google Books API
- **Like**: Save books you're interested in
- **Save**: Bookmark books for later
- **Cart**: Add books to shopping cart
- **Shorts**: Discover books in a TikTok-style feed

### Admin Features
- **User Management**: View all users, search, pagination
- **Admin Toggle**: Promote/demote users to admin
- **Activity Logs**: View all user activities
- **Statistics**: Dashboard with user and activity stats

---

## Troubleshooting

### Issue: "MongoDB connection failed"
**Solution:**
- Check your `MONGO_URI` in `server/.env`
- Make sure MongoDB is running (if local)
- Verify MongoDB Atlas connection string (if cloud)
- Check firewall settings

### Issue: "Cannot find module" errors
**Solution:**
```bash
# Delete node_modules and reinstall
cd server
rm -rf node_modules
npm install

cd ../client
rm -rf node_modules
npm install
```

### Issue: "Port already in use"
**Solution:**
- Change `PORT` in `server/.env` to a different port (e.g., 5001)
- Update `VITE_API_BASE` in `client/.env` to match

### Issue: "Google Books API errors"
**Solution:**
- Verify your API key is correct
- Check API key quota/limits
- API key is optional - app will work without it but with limited functionality

### Issue: "Admin link not showing"
**Solution:**
- Make sure you set `isAdmin: true` in database
- Log out and log back in
- Check browser console for errors

### Issue: "CORS errors"
**Solution:**
- Make sure backend is running on the port specified in `VITE_API_BASE`
- Check that `VITE_API_BASE` in client matches backend URL

---

## Project Structure

```
Digital Book Shelf/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts (Auth, Cart, etc.)
│   │   └── lib/           # API utilities
│   └── public/            # Static files (logo, etc.)
│
├── server/                # Express Backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, admin middleware
│   │   ├── utils/         # Helper functions
│   │   └── scripts/       # Utility scripts
│   └── .env              # Environment variables
│
└── README.md             # Project documentation
```

---

## Next Steps

1. ✅ Set up environment variables
2. ✅ Install dependencies
3. ✅ Start both servers
4. ✅ Create your first account
5. ✅ Make yourself admin
6. ✅ Explore all features!

---

## Need Help?

- Check the console for error messages
- Verify all environment variables are set
- Make sure MongoDB is running
- Ensure both servers are running
- Check that ports are not blocked by firewall

---

**Happy Coding! 📚✨**
