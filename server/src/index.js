import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'digital-book-shelf' });
});

import authRouter from './routes/auth.routes.js'
import booksRouter from './routes/books.routes.js'
import blogsRouter from './routes/blogs.routes.js'
import cartRouter from './routes/cart.routes.js'
import progressRouter from './routes/progress.routes.js'
import userRouter from './routes/user.routes.js'
import ordersRouter from './routes/orders.routes.js'
import chatbotRouter from './routes/chatbot.routes.js'
app.use('/api/auth', authRouter)
app.use('/api/books', booksRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/progress', progressRouter)
app.use('/api/user', userRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/chatbot', chatbotRouter)

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('MONGO_URI not set. Server will run without DB connection.');
    } else {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB connected');
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


