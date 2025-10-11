import mongoose from 'mongoose'

const vlogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volumeId: { type: String, required: true },
  title: { type: String, required: true },
  contentUrl: { type: String, required: true }, // video url or short text url
  kind: { type: String, enum: ['short', 'vlog'], default: 'short' },
}, { timestamps: true })

export const Vlog = mongoose.model('Vlog', vlogSchema)


