const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        chatId: ObjectId,
        sender: ObjectId,
        content: String,
        type: String, // 'text' | 'image' | 'file'
        status: String, // sent | delivered | seen
        createdAt: Date
      },{ timestamps: true })

module.exports  = mongoose.model('Message', messageSchema);
