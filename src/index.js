const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

const eventRoutes = require("./controllers/eventControllers");
const organizationsRoutes = require("./controllers/organizationController");
const authRoutes = require("./controllers/authController");
const tickeRoutes = require("./controllers/ticketController");
const userRoutes = require("./controllers/userController");
const wikisRoutes = require("./controllers/wikiController");
const guestsRoutes = require("./controllers/guestController");
const userMessagesRoutes = require("./controllers/userMessagesController");

const {
  deleteWiki,
  joinEventWikisRoomsAndSendAllWikis,
  postWiki,
  postWikiComment,
} = require("./controllers/wikiSocketEvents");

const {
  joinAUserForMessaging,
  sendAChat,
} = require("./controllers/userMessagingEvents");

const app = express();
const server = http.createServer(app);

const io = socketio(server);

mongoose.connect(
  "mongodb://localhost:27017/event-booking-node",
  { useNewUrlParser: true },
  () => console.log("Mongo db is connected")
);

// middle wares
app.use(express.json());
app.use(fileUpload());

// controller routes
app.use("/api/v1", tickeRoutes);
app.use("/api/v1", eventRoutes);
app.use("/api/v1", guestsRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", wikisRoutes);
app.use("/api/v1", organizationsRoutes);
app.use("/api/v1", userMessagesRoutes);
app.use("/api/v1", authRoutes);

io.on("connection", (socket) => {
  // do something went client connect
  // catch the number of people online

  joinEventWikisRoomsAndSendAllWikis(socket);
  deleteWiki(socket);
  postWikiComment(socket);
  postWiki(socket);

  joinAUserForMessaging(socket);
  sendAChat(socket);

  socket.on("disconnect", () => {
    // do something went client disconnects
    // reduce the number of people online
  });
});

server.listen(process.env.PORT || 5000, () => console.log("App is running"));
