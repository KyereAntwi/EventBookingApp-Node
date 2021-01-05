const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserMessageSchema = new schema({
  toUserId: {
    type: String,
    required: true,
  },

  fromUserId: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  sentAt: {
    type: String,
    default: new Date().toISOString,
  },

  read: {
    type: Boolean,
    default: false,
  },
});

const UserMessage = mongoose.model("usermessage", UserMessageSchema);
module.exports = UserMessage;
