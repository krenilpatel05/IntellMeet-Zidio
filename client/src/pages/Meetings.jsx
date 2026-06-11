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
      setMeetings(res.data.meetings);
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

      setTitle("");
      setDescription("");
      setDate("");
      setStatus("Upcoming");

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

      setTitle("");
      setDescription("");
      setDate("");
      setStatus("Upcoming");
      setEditId(null);

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
    try {
      await axios.delete(`http://localhost:5000/api/meetings/${id}`);
      alert("🗑️ Meeting Deleted");
      fetchMeetings();
    } catch (error) {
      alert("Delete Failed");
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
        <h1>📅 Meeting Management</h1>

        <input
          type="text"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            margin: "10px",
          }}
        />

        <br />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            margin: "10px",
          }}
        />

        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            margin: "10px",
          }}
        />
        <br />

        <input
          type="text"
          placeholder="🔍 Search Meeting..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            margin: "10px",
          }}
        />

        <br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            margin: "10px",
          }}
        >
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <br />

        {editId ? (
          <button
            onClick={updateMeeting}
            style={{
              padding: "10px 20px",
              background: "orange",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ✏️ Update Meeting
          </button>
        ) : (
          <button
            onClick={createMeeting}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Create Meeting
          </button>
        )}

        <hr style={{ margin: "30px 0" }} />

        <h2>All Meetings</h2>

        {filteredMeetings.length === 0 ? (
          <p>No Meetings Found</p>
        ) : (
          filteredMeetings.map((meeting) => (
            <div
              key={meeting._id}
              style={{
                background: "white",
                color: "black",
                padding: "15px",
                marginTop: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>{meeting.title}</h3>

              <p>{meeting.description}</p>

              <p>
                <b>Date:</b>{" "}
                {new Date(meeting.date).toLocaleDateString()}
              </p>

              <p>
                <b>Status:</b>

                <span
                  style={{
                    marginLeft: "10px",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    color: "white",
                    fontWeight: "bold",
                    background:
                      (meeting.status || "Completed") === "Upcoming"
                        ? "#2563eb"
                        : (meeting.status || "Completed") === "Ongoing"
                        ? "#f97316"
                        : "#16a34a",
                  }}
                >
                  {meeting.status || "Completed"}
                </span>
              </p>

              <button
                onClick={() => editMeeting(meeting)}
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                  padding: "8px 15px",
                  background: "orange",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => deleteMeeting(meeting._id)}
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                  padding: "8px 15px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                🗑️ Delete
              </button>

              {/* 🛠️ ADDED FROM SCREENSHOT: Har meeting card ke niche Join Meeting button add ho gaya */}
              <button
                onClick={() => window.location.href = "/video"}
                style={{
                  marginTop: "10px",
                  padding: "8px 15px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                🎥 Join Meeting
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Meetings;