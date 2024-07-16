const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();

//Set up Socket.io
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", function (socket) {
  console.log("Socket Connected 🔥");

  socket.on("send-location", function (coordinates) {
    io.emit("receive-location", { id: socket?.id, ...coordinates });
  });

  socket.on("disconnected", function (coordinates) {
    io.emit("on-disconnect", socket?.id);
  });
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀🚀`);
});
