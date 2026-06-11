import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

function VideoRoom() {
  const videoRef = useRef();

  const [screenSharing, setScreenSharing] = useState(false);
  const [participants] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing media devices:", err));
  }, []);

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      videoRef.current.srcObject = screenStream;
      setScreenSharing(true);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMute = () => {
    const stream = videoRef.current?.srcObject;
    if (stream && stream.getAudioTracks().length > 0) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
      setIsMuted(!isMuted);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    alert(isRecording ? "🛑 Recording Stopped" : "🔴 Recording Started...");
  };

  const leaveMeeting = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Camera off karne ke liye
    }
    window.location.href = "/dashboard";
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          minHeight: "calc(100vh - 70px)",
          background: "#0f172a",
          color: "white",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative"
        }}
      >
        {/* Header Block with Live Stats Counter */}
        <div style={{ width: "100%", maxWidth: "1000px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>🎥 Video Meeting Room</h1>
            <p style={{ color: "#94a3b8", margin: "5px 0 0 0", fontSize: "14px" }}>Secure end-to-end encrypted team connection.</p>
          </div>
          
          <div style={{ background: "#1e293b", padding: "10px 18px", borderRadius: "20px", border: "1px solid #334155", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ height: "8px", width: "8px", background: "#10b981", borderRadius: "50%" }}></span>
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>👥 Participants: {participants}</span>
          </div>
        </div>

        {/* 🎬 Premium Studio Video Box Container */}
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            background: "#1e293b",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid #334155",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            aspectRatio: "16/9" // Perfect wide viewport scale
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
              transform: "scaleX(-1)" // Mirror effect for standard human focus look
            }}
          />

          {screenSharing && (
            <div style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(37, 99, 235, 0.9)", padding: "6px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "bold" }}>
              🖥️ You are sharing your screen
            </div>
          )}
        </div>

        {/* 🛠️ Floating Control Action Dock bottom panel */}
        <div
          style={{
            marginTop: "30px",
            background: "#1e293b",
            padding: "15px 30px",
            borderRadius: "30px",
            border: "1px solid #334155",
            display: "flex",
            gap: "15px",
            alignItems: "center",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
          }}
        >
          {/* Mute Button element toggler */}
          <button
            onClick={toggleMute}
            style={{
              padding: "12px 24px",
              background: isMuted ? "#ef4444" : "#475569",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {isMuted ? "🎤 Unmute" : "🔇 Mute"}
          </button>

          {/* Screen Share element toggler */}
          <button
            onClick={startScreenShare}
            style={{
              padding: "12px 24px",
              background: screenSharing ? "#10b981" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            🖥️ Screen Share
          </button>

          {/* Recording element toggler */}
          <button
            onClick={toggleRecording}
            style={{
              padding: "12px 24px",
              background: isRecording ? "#ea580c" : "#475569",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {isRecording ? "⏹️ Stop Rec" : "🔴 Record"}
          </button>

          <div style={{ width: "1px", height: "24px", background: "#334155" }}></div>

          {/* Call termination endpoint leave meeting layout action trigger button */}
          <button
            onClick={leaveMeeting}
            style={{
              padding: "12px 24px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            🚪 Leave Call
          </button>
        </div>
      </div>
    </>
  );
}

export default VideoRoom;