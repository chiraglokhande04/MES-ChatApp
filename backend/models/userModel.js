const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String, // hashed
    profilePic: String,
    status: String,
    socketId: String, // for real-time
    isOnline: Boolean
  },{ timestamps: true });

module.exports  = mongoose.model('User', userSchema);
