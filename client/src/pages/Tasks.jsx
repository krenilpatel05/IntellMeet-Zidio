import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Tasks() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    if (!title || !description || !assignedTo) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/tasks/create", {
        title,
        description,
        assignedTo,
        status: "Pending"
      });

      alert("✅ Task Created Successfully");
      resetForm();
      fetchTasks();
    } catch (error) {
      alert("Task Creation Failed");
    }
  };

  const editTask = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(task.assignedTo);
  };

  const updateTask = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/edit/${editingId}`, {
        title,
        description,
        assignedTo,
      });

      alert("✏️ Task Updated Successfully");
      resetForm();
      fetchTasks();
    } catch (error) {
      alert("Update Failed");
    }
  };

  const completeTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`);
      alert("✅ Task Completed");
      fetchTasks();
    } catch (error) {
      alert("Failed To Update Task");
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        alert("🗑️ Task Deleted");
        fetchTasks();
      } catch (error) {
        alert("Delete Failed");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setEditingId(null);
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 76px)",
          background: "#0f172a",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "30px 40px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* Top Center Branding Banner matching your signature dashboard layout */}
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0", letterSpacing: "-0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            📋 Task Management
          </h1>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "15px" }}>
            Schedule, track, and execute your team tasks in real-time.
          </p>
        </div>

        {/* Left-Right Split Configuration View */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "35px",
            width: "100%",
            maxWidth: "1440px",
            alignItems: "start"
          }}
        >
          {/* LEFT COLUMN AREA: Dynamic Task Entries Feed Grid */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", letterSpacing: "-0.02em" }}>
                Active Tasks ({filteredTasks.length})
              </h2>
              <input
                type="text"
                placeholder="Search Task by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "260px",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #334155",
                  background: "#1e293b",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>

            {/* Premium Slate Dark Layout Cards Grid System */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px"
              }}
            >
              {filteredTasks.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: "15px", fontStyle: "italic", textAlign: "left", gridColumn: "1/-1" }}>No Tasks Found</p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    style={{
                      background: "#1e293b",
                      borderRadius: "12px",
                      border: "1px solid #334155",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: "220px",
                      position: "relative",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
                    }}
                  >
                    {/* Corner Status Indicator Badge */}
                    <span
                      style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "white",
                        background: task.status === "Completed" ? "#16a34a" : "#ea580c"
                      }}
                    >
                      {task.status || "Pending"}
                    </span>

                    {/* Central Meta Data Information Box */}
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      <h3 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: "700", color: "#f8fafc", wordBreak: "break-word" }}>
                        {task.title}
                      </h3>
                      <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 14px 0", lineHeight: "1.5", wordBreak: "break-word" }}>
                        {task.description}
                      </p>
                      <div style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: "500" }}>
                        👤 <b>Assigned To:</b> {task.assignedTo}
                      </div>
                    </div>

                    {/* 🔄 FIXED ACTION TRUGGERS: Matching exact button names & colors from Screenshot 291 */}
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        marginTop: "20px",
                        borderTop: "1px solid #334155",
                        paddingTop: "16px",
                        flexWrap: "wrap"
                      }}
                    >
                      <button
                        onClick={() => editTask(task)}
                        style={{ padding: "8px 16px", background: "#f59e0b", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        ✏️ Edit
                      </button>

                      {task.status !== "Completed" && (
                        <button
                          onClick={() => completeTask(task._id)}
                          style={{ padding: "8px 16px", background: "#16a34a", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          ✅ Mark Complete
                        </button>
                      )}

                      <button
                        onClick={() => deleteTask(task._id)}
                        style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        🗑️ Delete Task
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN AREA: Sticky Operation Schedule Sidebar */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              border: "1px solid #334155",
              padding: "25px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              position: "sticky",
              top: "20px"
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#38bdf8", fontSize: "16px", fontWeight: "700", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>➕</span> {editingId ? "Edit Task Specifications" : "Schedule New Task"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px", textAlign: "left", fontWeight: "600" }}>Task Title</label>
                <input type="text" placeholder="e.g. Project Sync Up" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px", textAlign: "left", fontWeight: "600" }}>Description</label>
                <input type="text" placeholder="Enter task objective..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px", textAlign: "left", fontWeight: "600" }}>Assigned Specialist</label>
                <input type="text" placeholder="e.g. Krenil Patel" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
              </div>

              <button
                onClick={editingId ? updateTask : createTask}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "15px",
                  boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)"
                }}
              >
                {editingId ? "Update Task Specifications" : "Create Task Entry"}
              </button>
              
              {editingId && (
                <button onClick={resetForm} style={{ width: "100%", padding: "10px", background: "#475569", color: "white", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
                  Cancel
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Tasks;