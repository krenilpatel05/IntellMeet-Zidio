require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/ai"); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes); 

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "IntellMeet Backend Running 🚀",
  });
});

// Direct MongoDB Atlas URI
const dbURI = "mongodb://pkrenil1432_db_user:Krenil12345@ac-ttdy390-shard-00-00.drqhze9.mongodb.net:27017,ac-ttdy390-shard-00-01.drqhze9.mongodb.net:27017,ac-ttdy390-shard-00-02.drqhze9.mongodb.net:27017/intellmeet?ssl=true&replicaSet=atlas-elo8kk-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose
  .connect(dbURI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("🔥 MongoDB Connected Successfully to Cloud Atlas!");
  })
  .catch((err) => {
    console.log("❌ DB Connection Error:", err.message);
  });

// Server Initialization
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://intell-meet-zidio-psi.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  socket.on("joinMeetingRoom", (meetingId) => {
    socket.join(meetingId);
    console.log(`📡 Socket connection isolation initialized for room: ${meetingId}`);
  });

  socket.on("sendInMeetingMessage", ({ meetingId, message, sender }) => {
    io.to(meetingId).emit("receiveInMeetingMessage", { message, sender });
  });

  socket.on("typingInMeeting", ({ meetingId, sender, isTyping }) => {
    socket.to(meetingId).emit("userTypingInMeeting", { sender, isTyping });
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected securely: ${socket.id}`);
  });
});