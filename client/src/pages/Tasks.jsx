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

  // 1) Screenshot 1: search state ke niche ye filter logic add kar diya hai
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data.tasks);
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

    setTitle("");
    setDescription("");
    setAssignedTo("");

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

      setEditingId(null);
      setTitle("");
      setDescription("");
      setAssignedTo("");

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
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);

      alert("🗑️ Task Deleted");

      fetchTasks();
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
        <h1>✅ Task Management</h1>

        <input
          type="text"
          placeholder="Task Title"
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
          placeholder="Task Description"
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
          type="text"
          placeholder="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            margin: "10px",
          }}
        />

        <br />

        {/* 2) Screenshot 1 & 2: "Assigned To" input ke niche Search Box add kar diya hai */}
        <input
          type="text"
          placeholder="🔍 Search Task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            margin: "10px",
          }}
        />

        <br />

        {editingId ? (
          <button
            onClick={updateTask}
            style={{
              padding: "10px 20px",
              background: "orange",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ✏️ Update Task
          </button>
        ) : (
          <button
            onClick={createTask}
            style={{
              padding: "10px 20px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Create Task
          </button>
        )}

        <hr style={{ margin: "30px 0" }} />

        <h2>All Tasks</h2>

        {/* 3) Screenshot 2 & 3: Purane section ko naye filteredTasks section se replace kar diya hai */}
        {filteredTasks.length === 0 ? (
          <p>No Tasks Found</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              style={{
                background: "white",
                color: "black",
                padding: "15px",
                marginTop: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <p>
                <b>Assigned To:</b> {task.assignedTo}
              </p>

              <p>
                <b>Status:</b> {task.status}
              </p>

              <button
                onClick={() => editTask(task)}
                style={{
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

              {task.status !== "Completed" && (
                <button
                  onClick={() => completeTask(task._id)}
                  style={{
                    marginRight: "10px",
                    padding: "8px 15px",
                    background: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ✅ Mark Complete
                </button>
              )}

              <button
                onClick={() => deleteTask(task._id)}
                style={{
                  padding: "8px 15px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                🗑️ Delete Task
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Tasks;