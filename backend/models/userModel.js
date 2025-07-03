const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  bio: String,
  verificationToken: { type: String },
  verificationTokenExpiresAt: { type: Date },
  password: String, // hashed
  profilePic: String,
  status: String,
  socketId: String, // for real-time
  isOnline: Boolean
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
