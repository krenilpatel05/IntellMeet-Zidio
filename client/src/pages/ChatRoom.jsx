import { useState, useEffect } from "react";
import { io } from "socket.io-client";

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
  return (
    <div style={{ padding: "20px" }}>
      <h1>💬 Team Chat</h1>

      {messages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type Message"
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}

export default ChatRoom;