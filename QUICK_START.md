# 🚀 Quick Start Guide - Digital Book Shelf

## ⚡ Fast Setup (5 Minutes)

### 1️⃣ Install Dependencies

**Open Terminal/PowerShell in project root:**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

### 2️⃣ Set Up Environment Variables

**Create `server/.env`:**
```env
MONGO_URI=mongodb://localhost:27017/digital-book-shelf
PORT=5000
JWT_SECRET=your-secret-key-here
GOOGLE_BOOKS_KEY=your-api-key-here
```

**Create `client/.env`:**
```env
VITE_API_BASE=http://localhost:5000
```

### 3️⃣ Start MongoDB

**Option A: MongoDB Atlas (Cloud - Easiest)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Replace `MONGO_URI` in `server/.env`

**Option B: Local MongoDB**
- Install MongoDB Community Edition
- Start MongoDB service
- Use: `mongodb://localhost:27017/digital-book-shelf`

### 4️⃣ Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
✅ Should see: `Server listening on port 5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✅ Should see: `Local: http://localhost:5173`

### 5️⃣ Open in Browser

Go to: **http://localhost:5173**

---

## 🎯 First Steps After Setup

### 1. Create Account
- Click "Sign Up"
- Enter name, email, password
- You're now logged in!

### 2. Make Yourself Admin (Optional)

**In Terminal:**
```bash
cd server
node src/scripts/makeAdmin.js your-email@example.com
```

**Or manually in MongoDB:**
- Find your user in `users` collection
- Set `isAdmin: true`

### 3. Explore Features

- **Home** - Browse trending books
- **Search** - Find books
- **Shorts** - Instagram-style book feed
- **Chat** - AI book recommendations
- **Admin** - User management (if admin)

---

## 📝 Common Commands

```bash
# Start backend
cd server && npm run dev

# Start frontend
cd client && npm run dev

# Make user admin
cd server && node src/scripts/makeAdmin.js email@example.com

# Build for production
cd client && npm run build
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change `PORT` in `server/.env` |
| MongoDB error | Check `MONGO_URI` in `server/.env` |
| CORS error | Verify `VITE_API_BASE` matches backend URL |
| Module not found | Run `npm install` in both folders |
| Admin not showing | Log out and log back in |

---

## 📚 Full Documentation

See `SETUP_GUIDE.md` for detailed instructions.

---

**That's it! You're ready to go! 🎉**
