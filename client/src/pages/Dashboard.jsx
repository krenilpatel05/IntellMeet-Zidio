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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const meetingRes = await axios.get(
        "http://localhost:5000/api/meetings"
      );

      const taskRes = await axios.get(
        "http://localhost:5000/api/tasks"
      );

      const meetings = meetingRes.data.meetings;
      const tasks = taskRes.data.tasks;

      setMeetingCount(meetings.length);

      setUpcomingMeetings(
        meetings.filter(
          (meeting) => meeting.status === "Upcoming"
        ).length
      );

      setCompletedMeetings(
        meetings.filter(
          (meeting) => meeting.status === "Completed"
        ).length
      );

      setTaskCount(tasks.length);

      setCompletedTasks(
        tasks.filter(
          (task) => task.status === "Completed"
        ).length
      );

      setPendingTasks(
        tasks.filter(
          (task) => task.status === "Pending"
        ).length
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
        }}
      >
        <h1>📊 IntellMeet Dashboard</h1>
        <h2>Welcome to IntellMeet 🚀</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              background: "#2563eb",
              padding: "20px",
              borderRadius: "10px",
              width: "220px",
              textAlign: "center",
            }}
          >
            <h3>📅 Meetings</h3>
            <h1>{meetingCount}</h1>
          </div>

          <div
            style={{
              background: "#16a34a",
              padding: "20px",
              borderRadius: "10px",
              width: "220px",
              textAlign: "center",
            }}
          >
            <h3>✅ Tasks</h3>
            <h1>{taskCount}</h1>
          </div>

          <div
            style={{
              background: "#22c55e",
              padding: "20px",
              borderRadius: "10px",
              width: "220px",
              textAlign: "center",
            }}
          >
            <h3>🎯 Completed Tasks</h3>
            <h1>{completedTasks}</h1>
          </div>

          <div
            style={{
              background: "#eab308",
              color: "black",
              padding: "20px",
              borderRadius: "10px",
              width: "220px",
              textAlign: "center",
            }}
          >
            <h3>⏳ Pending Tasks</h3>
            <h1>{pendingTasks}</h1>
          </div>

          <div
            style={{
              background: "#8b5cf6",
              padding: "20px",
              borderRadius: "10px",
              width: "220px",
              textAlign: "center",
            }}
          >
            <h3>🚀 Upcoming Meetings</h3>
            <h1>{upcomingMeetings}</h1>
          </div>

          <div
            style={{
              background: "#ef4444",
              padding: "20px",
              borderRadius: "10px",
              width: "220px",
              textAlign: "center",
            }}
          >
            <h3>🏁 Completed Meetings</h3>
            <h1>{completedMeetings}</h1>
          </div>
        </div>

        <div
          style={{
            background: "white",
            color: "black",
            padding: "20px",
            marginTop: "30px",
            borderRadius: "10px",
          }}
        >
         <h2 style={{ textAlign: "center" }}>
  🤖 AI Meeting Summary
</h2>

<ul
  style={{
    listStyle: "none",
    lineHeight: "35px",
    fontSize: "18px",
  }}
>
  <li>📌 Total Meetings: {meetingCount}</li>
  <li>📌 Upcoming Meetings: {upcomingMeetings}</li>
  <li>📌 Completed Meetings: {completedMeetings}</li>
  <li>📌 Total Tasks: {taskCount}</li>
  <li>📌 Pending Tasks: {pendingTasks}</li>
  <li>📌 Completed Tasks: {completedTasks}</li>
</ul>
        </div>

        <div
          style={{
            background: "white",
            color: "black",
            padding: "20px",
            marginTop: "30px",
            borderRadius: "10px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            📌 Recent Activity
          </h2>

          <ul
            style={{
              listStyle: "none",
              lineHeight: "35px",
              fontSize: "18px",
            }}
          >
            <li>📅 Total Meetings: {meetingCount}</li>
            <li>🚀 Upcoming Meetings: {upcomingMeetings}</li>
            <li>🏁 Completed Meetings: {completedMeetings}</li>
            <li>✅ Total Tasks: {taskCount}</li>
            <li>🎯 Completed Tasks: {completedTasks}</li>
            <li>⏳ Pending Tasks: {pendingTasks}</li>
            <li>💬 Team Chat Enabled</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Dashboard;