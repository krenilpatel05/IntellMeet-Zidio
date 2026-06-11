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
        padding: "18px 30px", // Padding thodi aur badha di hai taaki bade text ke sath balance rahe
        display: "flex",
        gap: "30px", // Gaps ko bhi thoda increase kiya hai
        alignItems: "center",
      }}
    >
      {/* 🛠️ Size ko 18px se badha kar 20px aur heavy bold kar diya hai */}
      <Link 
        to="/dashboard" 
        style={{ color: "white", fontSize: "20px", fontWeight: "700", textDecoration: "none" }}
      >
        Dashboard
      </Link>

      <Link 
        to="/meetings" 
        style={{ color: "white", fontSize: "20px", fontWeight: "700", textDecoration: "none" }}
      >
        Meetings
      </Link>

      <Link 
        to="/tasks" 
        style={{ color: "white", fontSize: "20px", fontWeight: "700", textDecoration: "none" }}
      >
        Tasks
      </Link>

      <Link 
        to="/chat" 
        style={{ color: "white", fontSize: "20px", fontWeight: "700", textDecoration: "none" }}
      >
        Chat
      </Link>

      <Link 
        to="/video" 
        style={{ color: "white", fontSize: "20px", fontWeight: "700", textDecoration: "none" }}
      >
        Video Meeting
      </Link>

      <Link
        to="/"
        onClick={handleLogout}
        style={{ color: "#ef4444", fontSize: "20px", fontWeight: "700", textDecoration: "none", marginLeft: "auto" }}
      >
        Logout
      </Link>
    </div>
  );
}

export default Navbar;