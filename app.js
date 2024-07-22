import express from "express";
import { Server } from "socket.io";
import http from "http";
import { name } from "ejs";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

// Database
const data = [];

// io connection
io.on("connection", (socket) => {
  // Username is coming and userjoined
  socket.on("user-join", (username) => {
    data.push({ username, id: socket.id });
  });

  // Get the roomname
  socket.on("roomname", (roomname) => {
    const index = data.findIndex((user) => user.id === socket.id);
    data[index].groups = roomname;

    socket.join(roomname);

    io.to(roomname).emit("message", {
      roomname: roomname,
      id: socket.id,
      name: data[index].username,
    });
  });

  // room message
  socket.on("send-message", (message) => {
    const index = data.findIndex((user) => user.id === socket.id);

    io.to(message.room).emit("send-message", {
      msg: message.msg,
      id: socket.id,
      room: data[index].groups,
      name: data[index].username,
      time: socket.handshake.time,
    });
  });

  socket.on("disconnect", () => {
    const index = data.findIndex((user) => user.id === socket.id);

    if (data[index]) {
      io.to(data[index].groups).emit("offline", data[index]);
    }
  });
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
