/**
 * Script to make a user an admin
 * Usage: node src/scripts/makeAdmin.js <user-email>
 * 
 * This script sets the isAdmin flag to true for a user
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from '../models/User.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || ''

async function makeAdmin(email) {
  try {
    if (!MONGO_URI) {
      console.error('MONGO_URI not set in .env file')
      process.exit(1)
    }

    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    const user = await User.findOne({ email })
    if (!user) {
      console.error(`User with email ${email} not found`)
      process.exit(1)
    }

    user.isAdmin = true
    await user.save()

    console.log(`✅ User ${user.name} (${user.email}) is now an admin`)
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

const email = process.argv[2]
if (!email) {
  console.error('Usage: node src/scripts/makeAdmin.js <user-email>')
  process.exit(1)
}

makeAdmin(email)
