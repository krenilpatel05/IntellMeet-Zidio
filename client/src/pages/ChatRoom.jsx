import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";

const socket = io("http://localhost:5000");

function ChatRoom() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", message);
    setMessage("");
  };

  // 🛠️ Enter Key Press Handler taaki input box me Enter dabate hi message send ho jaye
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          minHeight: "calc(100vh - 70px)", // Navbar ki height ko nikal kar full layout
          background: "#0f172a",
          color: "white",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* Chat Room Window Container */}
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            background: "#1e293b",
            borderRadius: "12px",
            border: "1px solid #334155",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            height: "75vh" // Fixed height taaki message area scrollable rahe
          }}
        >
          {/* Header Panel */}
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #334155",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "600", color: "#38bdf8" }}>
              💬 Team Collaboration Chat
            </h2>
            <span style={{ fontSize: "12px", background: "#10b981", color: "white", padding: "3px 8px", borderRadius: "10px", fontWeight: "bold" }}>
              Live
            </span>
          </div>

          {/* 📜 Scrollable Messages Display Box */}
          <div
            style={{
              flex: "1",
              padding: "20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "#0f172a", // Inner text frame background contrast
              margin: "15px",
              borderRadius: "8px",
              border: "1px solid #1e293b"
            }}
          >
            {messages.length === 0 ? (
              <p style={{ color: "#64748b", textAlign: "center", marginTop: "20px", fontSize: "15px" }}>
                No active conversations yet. Start typing below...
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: "flex-start", // Default received message placement logic
                    maxWidth: "75%",
                    background: "#334155", // Neutral slate bubble
                    color: "#f8fafc",
                    padding: "10px 16px",
                    borderRadius: "12px 12px 12px 2px", // Smooth speech bubble corners
                    fontSize: "15px",
                    lineHeight: "1.4",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    wordBreak: "break-word"
                  }}
                >
                  {msg}
                </div>
              ))
            )}
          </div>

          {/* Input control panel dock */}
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #334155",
              display: "flex",
              gap: "12px",
              alignItems: "center"
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress} // Force checking keyboard actions
              placeholder="Type your message here..."
              style={{
                flex: "1",
                padding: "14px 18px",
                borderRadius: "24px",
                border: "1px solid #475569",
                background: "#0f172a",
                color: "white",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                padding: "13px 28px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "24px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "15px",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
              onMouseOut={(e) => (e.target.style.background = "#2563eb")}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatRoom;