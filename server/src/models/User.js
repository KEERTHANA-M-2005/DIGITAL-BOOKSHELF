import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  savedBooks: [{ type: String }], // Google volume IDs
  likedBooks: [{ type: String }],
  recentBlogs: [{ type: String }],
}, { timestamps: true })

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash)
}

export const User = mongoose.model('User', userSchema)


