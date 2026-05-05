const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socket = require("socket.io");
const multer = require("multer");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socket(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/chat");

// Schema
const User = mongoose.model("User", {
  username: String,
  password: String,
});

const Message = mongoose.model("Message", {
  sender: String,
  text: String,
  file: String,
});

// สมัคร
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send("ok");
});

// ล็อกอิน
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (user) res.send({ success: true });
  else res.send({ success: false });
});

// อัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname),
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.send({ file: req.file.filename });
});

// socket
io.on("connection", (socket) => {
  socket.on("sendMessage", async (data) => {
    const msg = new Message(data);
    await msg.save();
    io.emit("newMessage", msg);
  });
});

server.listen(3000, () => console.log("Server running"));