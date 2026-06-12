import { useState } from "react";
// 💡 CENTRAL PRODUCTION CONFIG IMPORT:
import api from "../services/api"; 
import { Link, useNavigate } from "react-router-dom"; 

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // 💡 AUTOMATIC PRODUCTION ROUTING VIA INSTANCE:
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert(res.data.message || "Registration Successful!");
      navigate("/"); // Register hone ke baad automatic login screen par redirect
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      registerUser();
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #475569",
    background: "#0f172a",
    color: "white",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s ease-in-out"
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#3b82f6";
    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.25)";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#475569";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#1e293b",
          padding: "40px 32px",
          borderRadius: "16px",
          border: "1px solid #334155",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              color: "white",
              fontWeight: "800",
              fontSize: "38px",
              margin: "0 0 8px 0",
              letterSpacing: "-0.05em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}
          >
            <span>🚀</span> IntellMeet
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
            Create your account to get started.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px", fontWeight: "600" }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px", fontWeight: "600" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px", fontWeight: "600" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={inputStyle}
            />
          </div>

          <button
            onClick={registerUser}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "10px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#1d4ed8";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#2563eb";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Register
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#94a3b8",
            fontSize: "14px",
            margin: "30px 0 0 0"
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              color: "#38bdf8",
              fontWeight: "bold",
              textDecoration: "none",
              marginLeft: "4px",
              transition: "color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.color = "#7dd3fc"}
            onMouseOut={(e) => e.target.style.color = "#38bdf8"}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;