require("dotenv").config();

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

// Routes Registration
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes); 

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "IntellMeet Backend Running 🚀",
  });
});

// 💡 DYNAMIC DB SELECTION: Production/Deployment me Cloud chalega, Local me 127.0.0.1 chalega!
const dbURI = process.env.NODE_ENV === "production"
  ? "mongodb+srv://krenil:Krenil12345@cluster0.1sihu41.mongodb.net/intellmeet?retryWrites=true&w=majority"
  : "mongodb://127.0.0.1:27017/intellmeet";

mongoose
  .connect(dbURI)
  .then(() => {
    console.log(process.env.NODE_ENV === "production"
      ? "✅ MongoDB Connected Successfully to Cloud Atlas!"
      : "✅ Connected Successfully to Local MongoDB Backend!"
    );
  })
  .catch((err) => {
    console.log("❌ DB Connection Error:", err.message);
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