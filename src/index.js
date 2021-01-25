const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const { generateMessage, generateLocation } = require("./utils/message");
const { addUser, removeUser, getUser, getAllUsers } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPathDirectory = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

app.use(express.static(publicPathDirectory));

io.on("connection", (socket) => {
  socket.on("join", ({ username, roomName, password }, cb) => {
    console.log(username);
    const { error, user } = addUser({
      id: socket.id,
      username,
      roomName,
      password,
    });

    console.log(user);

    if (error) {
      return cb(error);
    }

    socket.join(user.roomName);

    socket.emit("message", generateMessage(`Welcome ${user.username}`));
    socket.broadcast
      .to(user.roomName)
      .emit("message", generateMessage(`${user.username} joined`));

    console.log(user.roomName);

    io.to(user.roomName).emit("roomData", {
      room: user.roomName,
      users: getAllUsers(user.roomName),
    });
  });

  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);
    io.to(user.roomName).emit(
      "message",
      generateMessage(user.username, message)
    );
  });

  socket.on("sendLocation", ({ longitude, latitude }) => {
    const user = getUser(socket.id);
    io.to(user.roomName).emit(
      "locationMessage",
      generateLocation(
        `https://google.com/maps?q=${latitude},${longitude}`,
        user.username
      )
    );
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.roomName).emit(
        "message",
        generateMessage(`${user.username} left`)
      );
      io.to(user.roomName).emit("roomData", {
        room: user.roomName,
        users: getAllUsers(user.roomName),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Chat app runing on port ${port}`);
});
