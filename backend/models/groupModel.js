const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groupImage: { type: String, default: "default.jpg" },
  isGroup: { type: Boolean, default: true },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);
