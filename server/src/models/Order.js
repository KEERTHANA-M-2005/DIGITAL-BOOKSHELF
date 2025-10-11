import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ volumeId: String, title: String, price: Number, quantity: Number }],
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  provider: { type: String, enum: ['mock', 'stripe', 'razorpay'], default: 'mock' },
}, { timestamps: true })

export const Order = mongoose.model('Order', orderSchema)


