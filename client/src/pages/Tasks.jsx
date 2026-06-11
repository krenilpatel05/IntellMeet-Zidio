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
          <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 10px 0" }}>✅ Task Management</h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>Assign workflow items, monitor current progress, and log operations.</p>
        </div>

        {/* 🛠️ Split Screen Layout (Left Side: Cards List, Right Side: Form View) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "35px",
            alignItems: "start"
          }}
        >
          
          {/* LEFT SIDE BLOCK: Search Engine Control panel and Cards listing */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "25px" }}>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "600" }}>All Dashboard Tasks ({filteredTasks.length})</h2>
              <input
                type="text"
                placeholder="🔍 Search Task by title..."
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

            {/* Tasks Dynamic Grid Panel */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredTasks.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: "16px" }}>No Tasks Found</p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
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
                        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "600", color: "#f8fafc" }}>{task.title}</h3>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "11px",
                            whiteSpace: "nowrap",
                            background: task.status === "Completed" ? "#16a34a" : "#f97316",
                          }}
                        >
                          {task.status || "Pending"}
                        </span>
                      </div>

                      <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "0 0 16px 0", lineHeight: "1.5" }}>{task.description}</p>
                      
                      <p style={{ fontSize: "13px", margin: "4px 0", color: "#cbd5e1" }}>
                        👤 <b>Assigned To:</b> {task.assignedTo}
                      </p>
                    </div>

                    {/* Integrated row configurations for Action triggers */}
                    <div style={{ display: "flex", gap: "6px", marginTop: "15px", borderTop: "1px solid #334155", paddingTop: "14px" }}>
                      <button
                        onClick={() => editTask(task)}
                        style={{ flex: "1", padding: "8px 0", background: "#f59e0b", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                      >
                        ✏️ Edit
                      </button>

                      {task.status !== "Completed" && (
                        <button
                          onClick={() => completeTask(task._id)}
                          style={{ flex: "1.4", padding: "8px 0", background: "#10b981", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                        >
                          ✅ Done
                        </button>
                      )}

                      <button
                        onClick={() => deleteTask(task._id)}
                        style={{ flex: "1", padding: "8px 0", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDE BLOCK: Sticky Form Panel Component container */}
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #334155",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
              position: "sticky",
              top: "20px"
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#38bdf8", fontSize: "18px", fontWeight: "600" }}>
              {editingId ? "✏️ Edit Task Specifications" : "➕ Create New Project Task"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "5px" }}>Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design Login UI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "white", fontSize: "15px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "5px" }}>Description</label>
                <input
                  type="text"
                  placeholder="Enter sprint objective details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "white", fontSize: "15px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "5px" }}>Assigned Specialist</label>
                <input
                  type="text"
                  placeholder="e.g. Krenil Patel"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "white", fontSize: "15px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={editingId ? updateTask : createTask}
                  style={{ flex: "1", padding: "12px", background: editingId ? "orange" : "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }}
                >
                  {editingId ? "Update Task" : "Create Task"}
                </button>
                {editingId && (
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

export default Tasks;