import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Meetings() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Upcoming");

  const [meetings, setMeetings] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const filteredMeetings = meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(search.toLowerCase())
  );

  const fetchMeetings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/meetings");
      setMeetings(res.data.meetings || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const createMeeting = async () => {
    if (!title || !description || !date) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/meetings/create", {
        title,
        description,
        date,
        status,
      });

      alert("✅ Meeting Created Successfully");
      resetForm();
      fetchMeetings();
    } catch (error) {
      alert("Error Creating Meeting");
    }
  };

  const updateMeeting = async () => {
    try {
      await axios.put(`http://localhost:5000/api/meetings/${editId}`, {
        title,
        description,
        date,
        status,
      });

      alert("✏️ Meeting Updated Successfully");
      resetForm();
      fetchMeetings();
    } catch (error) {
      alert("Update Failed");
    }
  };

  const editMeeting = (meeting) => {
    setEditId(meeting._id);
    setTitle(meeting.title);
    setDescription(meeting.description);
    setDate(new Date(meeting.date).toISOString().split("T")[0]);
    setStatus(meeting.status || "Upcoming");
  };

  const deleteMeeting = async (id) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      try {
        await axios.delete(`http://localhost:5000/api/meetings/${id}`);
        alert("🗑️ Meeting Deleted");
        fetchMeetings();
      } catch (error) {
        alert("Delete Failed");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setStatus("Upcoming");
    setEditId(null);
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "40px 30px",
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 10px 0" }}>📅 Meeting Management</h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>Schedule, track, and join your team calls in real-time.</p>
        </div>

        {/* 🛠️ SOLUTION: Split Screen Layout (Left: Card List, Right: Form Container) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px", // 400px space for form panel, rest for listing cards
            gap: "35px",
            alignItems: "start"
          }}
        >
          
          {/* LEFT SIDE BLOCK: Search and All Meetings Cards Grid */}
          <div>
            {/* Search and Title row layout alignment */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "25px" }}>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "600" }}>Scheduled Meetings ({filteredMeetings.length})</h2>
              <input
                type="text"
                placeholder="🔍 Search Meeting by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "300px",
                  padding: "12px 16px",
                  borderRadius: "24px",
                  border: "1px solid #334155",
                  background: "#1e293b",
                  color: "white",
                  fontSize: "15px"
                }}
              />
            </div>

            {/* Meetings Dynamic Grid Container layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredMeetings.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: "16px" }}>No Meetings Found</p>
              ) : (
                filteredMeetings.map((meeting) => (
                  <div
                    key={meeting._id}
                    style={{
                      background: "#1e293b",
                      color: "white",
                      padding: "24px",
                      borderRadius: "12px",
                      border: "1px solid #334155",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: "180px"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "600", color: "#f8fafc" }}>{meeting.title}</h3>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "11px",
                            whiteSpace: "nowrap",
                            background:
                              meeting.status === "Upcoming"
                                ? "#2563eb"
                                : meeting.status === "Ongoing"
                                ? "#f97316"
                                : "#16a34a",
                          }}
                        >
                          {meeting.status || "Upcoming"}
                        </span>
                      </div>

                      <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "0 0 16px 0", lineHeight: "1.5" }}>{meeting.description}</p>
                      
                      <p style={{ fontSize: "13px", margin: "8px 0", color: "#cbd5e1" }}>
                        📅 <b>Date:</b> {new Date(meeting.date).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action buttons list elements row */}
                    <div style={{ display: "flex", gap: "6px", marginTop: "15px", borderTop: "1px solid #334155", paddingTop: "14px" }}>
                      <button
                        onClick={() => editMeeting(meeting)}
                        style={{ flex: "1", padding: "8px 0", background: "#f59e0b", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => deleteMeeting(meeting._id)}
                        style={{ flex: "1", padding: "8px 0", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                      >
                        🗑️ Delete
                      </button>

                      <button
                        onClick={() => window.location.href = "/video"}
                        style={{ flex: "1.2", padding: "8px 0", background: "#10b981", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                      >
                        🎥 Join
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDE BLOCK: Fixed Form Panel Section for adding/updating meeting inputs */}
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #334155",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
              position: "sticky",
              top: "20px" // Scrolling ke dauran right form box top par hamesha chipka rahega
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#38bdf8", fontSize: "18px", fontWeight: "600" }}>
              {editId ? "✏️ Edit Schedule Details" : "➕ Schedule New Meeting"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "5px" }}>Meeting Title</label>
                <input
                  type="text"
                  placeholder="e.g. Project Sync Up"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "white", fontSize: "15px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "5px" }}>Description</label>
                <input
                  type="text"
                  placeholder="Enter meeting objective..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "white", fontSize: "15px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "5px" }}>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "white", fontSize: "15px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "5px" }}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "white", fontSize: "15px", boxSizing: "border-box" }}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={editId ? updateMeeting : createMeeting}
                  style={{ flex: "1", padding: "12px", background: editId ? "orange" : "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }}
                >
                  {editId ? "Update Details" : "Create Meeting"}
                </button>
                {editId && (
                  <button
                    onClick={resetForm}
                    style={{ padding: "12px", background: "#475569", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Meetings;