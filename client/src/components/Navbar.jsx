import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "15px",
        display: "flex",
        gap: "20px",
      }}
    >
      <Link to="/dashboard" style={{ color: "white" }}>
        Dashboard
      </Link>

      <Link to="/meetings" style={{ color: "white" }}>
        Meetings
      </Link>

      <Link to="/tasks" style={{ color: "white" }}>
        Tasks
      </Link>

      <Link to="/chat" style={{ color: "white" }}>
        Chat
      </Link>

      <Link to="/video" style={{ color: "white" }}>
        Video Meeting
      </Link>

          

      <Link
        to="/"
        onClick={handleLogout}
        style={{ color: "red" }}
      >
        Logout
      </Link>
    </div>
  );
}

export default Navbar;