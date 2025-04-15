const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userID, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userID, targetUserId].sort().join("_"))
    .digest("hex");
};

const initilizeSocket = (server) => {
  //creating http server and this app is the express application(we doing this to confugure socket.io)

  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  //accepting or listening the connections
  io.on("connection", (socket) => {
    //Handle events

    socket.on("joinChat", ({ userID, targetUserId }) => {
      const roomId = getSecretRoomId(userID, targetUserId);
      console.log("Joining Room : " + roomId);
      socket.join(roomId);
    });

    //receiving all the data fronm FE -(((((( firstName,lastName, userID, targetUserId, text const sendMessage = () => {
    // const socket = createSocketConnection();
    // socket.emit("sendMessage", {           ))))))
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userID, targetUserId, text }) => {

 
        //save messages to the Database
        //finding the existing chat
        try {
          const roomId = getSecretRoomId(userID, targetUserId);
          console.log(firstName + " " + text);

          let chat = await Chat.findOne({
            participants: { $all: [userID, targetUserId] },
          });

          //if chant is not present create a new one
          if (!chat) {
            chat = new Chat({
              participants: [userID, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userID,
            text,
          });
          //sending back all these data -{ firstName,lastName, text,senderId: userID, });
          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            senderId: userID,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initilizeSocket;
