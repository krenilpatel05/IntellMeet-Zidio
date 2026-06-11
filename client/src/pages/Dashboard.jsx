import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [meetingCount, setMeetingCount] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState(0);
  const [completedMeetings, setCompletedMeetings] = useState(0);

  const [taskCount, setTaskCount] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [ongoingMeetings, setOngoingMeetings] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const meetingRes = await axios.get("http://localhost:5000/api/meetings");
      const taskRes = await axios.get("http://localhost:5000/api/tasks");

      const meetings = meetingRes.data.meetings;
      const tasks = taskRes.data.tasks;

      setMeetingCount(meetings.length);

      setUpcomingMeetings(
        meetings.filter((meeting) => meeting.status === "Upcoming").length
      );

      setOngoingMeetings(
        meetings.filter((meeting) => meeting.status === "Ongoing").length
      );

      setCompletedMeetings(
        meetings.filter((meeting) => meeting.status === "Completed").length
      );

      setTaskCount(tasks.length);

      setCompletedTasks(
        tasks.filter((task) => task.status === "Completed").length
      );

      setPendingTasks(
        tasks.filter((task) => task.status === "Pending").length
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <h1>📊 IntellMeet Dashboard</h1>
        <h2>Welcome to IntellMeet 🚀</h2>

        {/* 1) Top Section: Statistics Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div style={{ background: "#2563eb", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
            <h3>📅 Meetings</h3>
            <h1 style={{ fontSize: "50px", margin: "10px 0 0 0" }}>{meetingCount}</h1>
          </div>

          <div style={{ background: "#16a34a", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
            <h3>✅ Tasks</h3>
            <h1 style={{ fontSize: "50px", margin: "10px 0 0 0" }}>{taskCount}</h1>
          </div>

          <div style={{ background: "#f97316", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
            <h3>🔄 Ongoing Meetings</h3>
            <h1 style={{ fontSize: "50px", margin: "10px 0 0 0" }}>{ongoingMeetings}</h1>
          </div>

          <div style={{ background: "#22c55e", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
            <h3>🎯 Completed Tasks</h3>
            <h1 style={{ fontSize: "50px", margin: "10px 0 0 0" }}>{completedTasks}</h1>
          </div>

          <div style={{ background: "#eab308", color: "black", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
            <h3>⏳ Pending Tasks</h3>
            <h1 style={{ fontSize: "50px", margin: "10px 0 0 0" }}>{pendingTasks}</h1>
          </div>

          <div style={{ background: "#8b5cf6", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
            <h3>🚀 Upcoming Meetings</h3>
            <h1 style={{ fontSize: "50px", margin: "10px 0 0 0" }}>{upcomingMeetings}</h1>
          </div>

          <div style={{ background: "#ef4444", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
            <h3>🏁 Completed Meetings</h3>
            <h1 style={{ fontSize: "50px", margin: "10px 0 0 0" }}>{completedMeetings}</h1>
          </div>
        </div>

        {/* 🛠️ 2) Bottom Section: AI Summary (Left) aur Recent Activity (Right) Side-by-Side Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", // Dono blocks barabar me adjust honge
            gap: "30px",
            marginTop: "40px",
          }}
        >
          {/* AI Meeting Summary Card (Left Side) */}
          <div
            style={{
              background: "#1e293b", // Premium Dark Theme
              color: "white",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #334155",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2 style={{ textAlign: "left", color: "#38bdf8", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              🤖 AI Meeting Summary
            </h2>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "40px", fontSize: "18px" }}>
              <li style={{ borderBottom: "1px solid #334155", paddingBottom: "5px", color: "#cbd5e1" }}>📌 Total Meetings: <b>{meetingCount}</b></li>
              <li style={{ borderBottom: "1px solid #334155", padding: "5px 0", color: "#cbd5e1" }}>📌 Upcoming Meetings: <b>{upcomingMeetings}</b></li>
              <li style={{ borderBottom: "1px solid #334155", padding: "5px 0", color: "#cbd5e1" }}>📌 Completed Meetings: <b>{completedMeetings}</b></li>
              <li style={{ borderBottom: "1px solid #334155", padding: "5px 0", color: "#cbd5e1" }}>📌 Total Tasks: <b>{taskCount}</b></li>
              <li style={{ borderBottom: "1px solid #334155", padding: "5px 0", color: "#cbd5e1" }}>📌 Pending Tasks: <b>{pendingTasks}</b></li>
              <li style={{ paddingByTop: "5px", color: "#cbd5e1" }}>📌 Completed Tasks: <b>{completedTasks}</b></li>
            </ul>
          </div>

          {/* Recent Activity Card (Right Side) */}
          <div
            style={{
              background: "#1e293b", // Premium Dark Theme
              color: "white",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #334155",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2 style={{ textAlign: "left", color: "#38bdf8", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              📌 Recent Activity
            </h2>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "40px", fontSize: "18px" }}>
              <li style={{ borderBottom: "1px solid #334155", paddingBottom: "5px", color: "#cbd5e1" }}>📅 Total Meetings: <b>{meetingCount}</b></li>
              <li style={{ borderBottom: "1px solid #334155", padding: "5px 0", color: "#cbd5e1" }}>🚀 Upcoming Meetings: <b>{upcomingMeetings}</b></li>
              <li style={{ borderBottom: "1px solid #334155", padding: "5px 0", color: "#cbd5e1" }}>🏁 Completed Meetings: <b>{completedMeetings}</b></li>
              <li style={{ borderBottom: "1px solid #334155", padding: "5px 0", color: "#cbd5e1" }}>✅ Total Tasks: <b>{taskCount}</b></li>
              <li style={{ borderBottom: "1px solid #334155", padding: "5px 0", color: "#cbd5e1" }}>🎯 Completed Tasks: <b>{completedTasks}</b></li>
              <li style={{ borderBottom: "1px solid #334155", padding: "5px 0", color: "#cbd5e1" }}>⏳ Pending Tasks: <b>{pendingTasks}</b></li>
              <li style={{ paddingByTop: "5px", color: "#cbd5e1" }}>💬 Team Chat Enabled</li>
            </ul>
          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;