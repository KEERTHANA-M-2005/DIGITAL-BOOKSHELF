import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volumeId: { type: String, required: true },
  pagesRead: { type: Number, default: 0 },
  secondsRead: { type: Number, default: 0 },
}, { timestamps: true })

export const Progress = mongoose.model('Progress', progressSchema)


