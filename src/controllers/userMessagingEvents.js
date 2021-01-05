const UserMessage = require("../models/user-message");

const joinAUserForMessaging = (socket) => {
  socket.on("selectChat", ({ userId, fromId }) => {
    socket.join(`${userId}-${fromId}`);

    const response = [];
    UserMessage.find({ fromUserId: fromId, toUserId: userId }).then((res) => {
      response = res;
    });

    socket.emit("getAllChatMessages", response);
  });
};

const sendAChat = (socket) => {
  socket.on("chatMessage", (msg) => {
    const newUserMessage = new UserMessage(msg);

    newUserMessage.save().then((res) => {
      socket.broadcast
        .to(`${msg.toUserId}-${msg.fromUserId}`)
        .emit("newChatMessage", res);
    });
  });
};

module.exports = {
  joinAUserForMessaging,
  sendAChat,
};
