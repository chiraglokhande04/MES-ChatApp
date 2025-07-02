const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [ObjectId], // users involved
    isGroup: Boolean,
    lastMessage: ObjectId,
    updatedAt: Date
  }, { timestamps: true });

module.exports  = mongoose.model('Chat', chatSchema);
