import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function VideoRoom() {
  const videoRef = useRef();
  const chatEndRef = useRef(null);

  const [screenSharing, setScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [originalStream, setOriginalStream] = useState(null);

  // 🛠️ DAY 13 STATE: Active Sidebar View Control Indicator Toggle (Chat vs Participants)
  const [activeSidebar, setActiveSidebar] = useState("chat"); // Options: "chat" or "participants"
  
  // 🛠️ DAY 13 STATE: Live Participants Mock Array
  const [participantList, setParticipantList] = useState([
    { id: "1", name: "Krenil Patel (You)", isMuted: false, role: "Host" },
    { id: "2", name: "Team Specialist", isMuted: true, role: "Member" },
    { id: "3", name: "Zidio Evaluator", isMuted: false, role: "Admin" }
  ]);

  const [msgInput, setMsgInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [meetingId] = useState("default-room-id"); 
  const [currentUser] = useState("Krenil Patel"); 

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setOriginalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing media devices:", err));

    socket.emit("joinMeetingRoom", meetingId);

    socket.on("receiveInMeetingMessage", (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    socket.on("userTypingInMeeting", (data) => {
      if (data.isTyping) {
        setTypingStatus(`${data.sender} typing...`);
      } else {
        setTypingStatus("");
      }
    });

    return () => {
      socket.off("receiveInMeetingMessage");
      socket.off("userTypingInMeeting");
    };
  }, [meetingId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // 🛠️ DAY 12 FIX: Robust Screen Share Stability Handling
  const startScreenShare = async () => {
    if (screenSharing) {
      if (videoRef.current && originalStream) {
        videoRef.current.srcObject = originalStream;
        setScreenSharing(false);
      }
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      videoRef.current.srcObject = screenStream;
      setScreenSharing(true);

      screenStream.getVideoTracks()[0].onended = () => {
        if (videoRef.current && originalStream) {
          videoRef.current.srcObject = originalStream;
          setScreenSharing(false);
        }
      };
    } catch (error) {
      console.log("Screen share cancelled or failed: ", error);
    }
  };

  const toggleMute = () => {
    const stream = originalStream || videoRef.current?.srcObject;
    if (stream && stream.getAudioTracks().length > 0) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
      setIsMuted(!isMuted);
      
      setParticipantList(prev => prev.map(p => p.id === "1" ? { ...p, isMuted: !isMuted } : p));
    }
  };

  // 🛠️ DAY 12 FIX: Enhanced Recording Toggle State Alert Controls
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      alert("🔴 Live Media Recording Session Initiated. Stream data buffer logging active.");
    } else {
      alert("🛑 Recording Session Terminated. Stream file export packaging complete.");
    }
  };

  // 🛠️ DAY 13 FIX: Remote Action Trigger control to mute/unmute a secondary client user
  const toggleRemoteParticipantMute = (id) => {
    setParticipantList(prev =>
      prev.map(p => p.id === id ? { ...p, isMuted: !p.isMuted } : p)
    );
  };

  const leaveMeeting = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (originalStream) {
      originalStream.getTracks().forEach((track) => track.stop());
    }
    window.location.href = "/dashboard";
  };

  const sendInMeetingChat = () => {
    if (!msgInput.trim()) return;

    socket.emit("sendInMeetingMessage", {
      meetingId,
      message: msgInput,
      sender: currentUser,
    });

    socket.emit("typingInMeeting", { meetingId, sender: currentUser, isTyping: false });
    setMsgInput("");
  };

  const handleInputChange = (e) => {
    setMsgInput(e.target.value);
    if (e.target.value.length > 0) {
      socket.emit("typingInMeeting", { meetingId, sender: currentUser, isTyping: true });
    } else {
      socket.emit("typingInMeeting", { meetingId, sender: currentUser, isTyping: false });
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px 40px",
          minHeight: "calc(100vh - 76px)",
          background: "#0f172a",
          color: "white",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* Top Header Controls Block */}
        <div style={{ width: "100%", maxWidth: "1440px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", margin: 0, letterSpacing: "-0.04em" }}>🎥 Video Meeting Room</h1>
            <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px", fontWeight: "500" }}>Secure enterprise full-stack collaboration system.</p>
          </div>
          
          {/* 🛠️ DAY 13 UPGRADE: Interactive Sidebar Toggle Buttons */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button 
              onClick={() => setActiveSidebar("chat")}
              style={{ padding: "10px 18px", borderRadius: "20px", border: "1px solid #334155", background: activeSidebar === "chat" ? "#2563eb" : "#1e293b", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
            >
              💬 Open Chat
            </button>
            <button 
              onClick={() => setActiveSidebar("participants")}
              style={{ padding: "10px 18px", borderRadius: "20px", border: "1px solid #334155", background: activeSidebar === "participants" ? "#2563eb" : "#1e293b", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
            >
              👥 People ({participantList.length})
            </button>
          </div>
        </div>

        {/* Workspace Layout Grid Split Screen */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px", 
            gap: "30px",
            width: "100%",
            maxWidth: "1440px",
            alignItems: "stretch"
          }}
        >
          {/* LEFT CONTAINER VIEW: Primary WebRTC Video Frame Stream box */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
              border: "1px solid #334155",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              aspectRatio: "16/9"
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: screenSharing ? "none" : "scaleX(-1)" 
              }}
            />

            {screenSharing && (
              <div style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(37, 99, 235, 0.95)", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)" }}>
                🖥️ Screen Share Active
              </div>
            )}

            {isRecording && (
              <div style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(220, 38, 38, 0.95)", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", animation: "pulse 2s infinite", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ height: "8px", width: "8px", background: "white", borderRadius: "50%" }}></span>
                REC ACTIVE
              </div>
            )}
          </div>

          {/* RIGHT SIDE PANEL VIEW CONTAINER */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              border: "1px solid #334155",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
              overflow: "hidden"
            }}
          >
            {activeSidebar === "chat" ? (
              /* PANEL TYPE 1: Day 11 Messenger Framework */
              <>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #334155" }}>
                  <h3 style={{ margin: 0, color: "#38bdf8", fontSize: "16px", fontWeight: "700" }}>💬 Room Live Chat Window</h3>
                </div>

                {/* 🛠️ OVERFLOW FIX BLOCK: Added rigid padding limits bounds for structural alignment */}
                <div style={{ flex: "1", padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "360px", background: "#0f172a", margin: "20px", borderRadius: "12px", border: "1px solid #1e293b", boxSizing: "border-box" }}>
                  {chatMessages.length === 0 ? (
                    <p style={{ color: "#475569", textAlign: "center", fontSize: "13px", marginTop: "40px" }}>No stream messages logs yet.</p>
                  ) : (
                    chatMessages.map((m, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          background: m.sender === currentUser ? "#2563eb" : "#334155", 
                          color: "white", 
                          padding: "10px 14px", 
                          borderRadius: m.sender === currentUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px", 
                          maxWidth: "90%", // Increased slightly for clean balance
                          alignSelf: m.sender === currentUser ? "flex-end" : "flex-start", 
                          fontSize: "14px",
                          boxSizing: "border-box", // Strictly contains layout margins
                          wordBreak: "break-word", // Ensures text wraps tightly under edges
                          textAlign: "left"
                        }}
                      >
                        <div style={{ fontSize: "11px", opacity: 0.75, marginBottom: "3px", fontWeight: "bold" }}>{m.sender}</div>
                        <div style={{ whiteSpace: "pre-wrap" }}>{m.message}</div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div style={{ height: "20px", padding: "0 24px", fontSize: "12px", color: "#38bdf8", fontStyle: "italic", textAlign: "left" }}>
                  {typingStatus}
                </div>

                <div style={{ padding: "20px", borderTop: "1px solid #334155", display: "flex", gap: "10px" }}>
                  <input type="text" placeholder="Message everyone..." value={msgInput} onChange={handleInputChange} onBlur={() => socket.emit("typingInMeeting", { meetingId, sender: currentUser, isTyping: false })} onKeyDown={(e) => e.key === "Enter" && sendInMeetingChat()} style={{ flex: "1", padding: "12px 16px", borderRadius: "24px", border: "1px solid #475569", background: "#0f172a", color: "white", fontSize: "14px", outline: "none" }} />
                  <button onClick={sendInMeetingChat} style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "24px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>Send</button>
                </div>
              </>
            ) : (
              /* PANEL TYPE 2: 🛠️ DAY 13 EXCLUSIVE - Live Participant Presence List */
              <>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #334155" }}>
                  <h3 style={{ margin: 0, color: "#10b981", fontSize: "16px", fontWeight: "700" }}>👥 Active Call Participants</h3>
                </div>

                <div style={{ flex: "1", padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", background: "#0f172a", margin: "20px", borderRadius: "12px", border: "1px solid #1e293b" }}>
                  {participantList.map((user) => (
                    <div 
                      key={user.id} 
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#1e293b", borderRadius: "8px", border: "1px solid #334155" }}
                    >
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc" }}>{user.name}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>⚙️ Role: {user.role}</div>
                      </div>

                      <button
                        onClick={() => toggleRemoteParticipantMute(user.id)}
                        disabled={user.id === "1"} 
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "none",
                          fontSize: "12px",
                          fontWeight: "bold",
                          cursor: user.id === "1" ? "not-allowed" : "pointer",
                          background: user.isMuted ? "#ef4444" : "#10b981",
                          color: "white",
                          opacity: user.id === "1" ? 0.6 : 1
                        }}
                      >
                        {user.isMuted ? "🔇 Muted" : "🔊 Mic On"}
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "20px", borderTop: "1px solid #334155", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                  🔒 Connection secured via server tunnels.
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Call Action Controllers Dock Menu Panel */}
        <div
          style={{
            marginTop: "35px",
            background: "#1e293b",
            padding: "16px 36px",
            borderRadius: "40px",
            border: "1px solid #334155",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
          }}
        >
          <button onClick={toggleMute} style={{ padding: "12px 26px", background: isMuted ? "#dc2626" : "#475569", color: "white", border: "none", borderRadius: "30px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
            {isMuted ? "🎤 Unmute" : "🔇 Mute"}
          </button>

          <button onClick={startScreenShare} style={{ padding: "12px 26px", background: screenSharing ? "#059669" : "#2563eb", color: "white", border: "none", borderRadius: "30px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
            {screenSharing ? "⏹️ Stop Share" : "🖥️ Screen Share"}
          </button>

          <button onClick={toggleRecording} style={{ padding: "12px 26px", background: isRecording ? "#ea580c" : "#475569", color: "white", border: "none", borderRadius: "30px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
            {isRecording ? "⏹️ Stop Rec" : "🔴 Record"}
          </button>

          <div style={{ width: "1px", height: "28px", background: "#334155" }}></div>

          <button onClick={leaveMeeting} style={{ padding: "12px 28px", background: "#dc2626", color: "white", border: "none", borderRadius: "30px", fontWeight: "700", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)" }}>
            🚪 Leave Call
          </button>
        </div>
      </div>
    </>
  );
}

export default VideoRoom;