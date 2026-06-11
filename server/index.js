require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/ai"); // Week 3 AI Route Importer

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Registration
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes); // Week 3 AI Route Dynamic Integration

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "IntellMeet Backend Running 🚀",
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ DB Error:", err.message);
  });

// Server Initialization
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Socket.io Configured Securely
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Real-Time Socket Connection Handlers
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Global Chat Trigger fallback logic
  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  // Room Connection Trigger
  socket.on("joinMeetingRoom", (meetingId) => {
    socket.join(meetingId);
    console.log(`📡 Socket connection isolation initialized for room: ${meetingId}`);
  });

  // In-Meeting Real-time Live Chat
  socket.on("sendInMeetingMessage", ({ meetingId, message, sender }) => {
    io.to(meetingId).emit("receiveInMeetingMessage", { message, sender });
  });

  // In-Meeting Keyboard Action Indicators Tracking
  socket.on("typingInMeeting", ({ meetingId, sender, isTyping }) => {
    socket.to(meetingId).emit("userTypingInMeeting", { sender, isTyping });
  });

  // Safe Secure Lifecycle Break Down Disconnect Listener
  socket.on("disconnect", () => {
    console.log(`User Disconnected securely: ${socket.id}`);
  });
});