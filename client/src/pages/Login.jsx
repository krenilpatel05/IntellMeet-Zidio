import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      alert(res.data.message);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  // 🛠️ Enter key press automatic validation trigger handler
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      loginUser();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        fontFamily: "system-ui, sans-serif",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      {/* 🛠️ Polished Slate Card Wrapper Panel */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#1e293b",
          padding: "40px 30px",
          borderRadius: "16px",
          border: "1px solid #334155",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "800",
            fontSize: "36px",
            margin: "0 0 10px 0",
            letterSpacing: "-0.05em"
          }}
        >
          🚀 IntellMeet
        </h1>
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "14px", margin: "0 0 30px 0" }}>
          Welcome back! Please sign in to your portal.
        </p>

        {/* Form Inputs Fields Stack with full width tracking */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
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
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #475569",
                background: "#0f172a",
                color: "white",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box"
              }}
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
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #475569",
                background: "#0f172a",
                color: "white",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            onClick={loginUser}
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
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.background = "#2563eb")}
          >
            Sign In
          </button>
        </div>

        {/* Form Bottom Toggle Info Redirection layer */}
        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#94a3b8",
            fontSize: "14px",
            margin: "25px 0 0 0"
          }}
        >
          Don't have an account?{" "}
          <a
            href="/register"
            style={{
              color: "#38bdf8",
              fontWeight: "bold",
              textDecoration: "none",
              marginLeft: "4px"
            }}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;