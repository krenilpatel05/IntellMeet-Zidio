import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import Tasks from "./pages/Tasks";
import ChatRoom from "./pages/ChatRoom";
import VideoRoom from "./pages/VideoRoom";
import PostMeetingAI from "./pages/PostMeetingAI"; // 👈 REGISTERED: Added from Week 3 AI Guidelines
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Module Entry Points */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Secure Workspace Platform Endpoints */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <Meetings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/video"
          element={
            <ProtectedRoute>
              <VideoRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          }
        />

        {/* 🛠️ PDF TIMELINE INTEGRATION: Day 15/16 Post-Meeting AI Summary Matrix */}
        <Route
          path="/ai-insights"
          element={
            <ProtectedRoute>
              <PostMeetingAI />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;