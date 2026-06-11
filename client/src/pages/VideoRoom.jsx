import { useEffect, useRef, useState } from "react";

function VideoRoom() {
  const videoRef = useRef();

  const [screenSharing, setScreenSharing] = useState(false);
  const [participants] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  const startScreenShare = async () => {
    try {
      const screenStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

      videoRef.current.srcObject = screenStream;
      setScreenSharing(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        color: "white",
        background: "#0f172a",
        minHeight: "100vh",
      }}
    >
      <h1>🎥 Video Meeting Room</h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        style={{
          width: "500px",
          borderRadius: "10px",
        }}
      />

      <h3 style={{ marginTop: "15px" }}>
        👥 Participants: {participants}
      </h3>

      <button
        onClick={startScreenShare}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        🖥️ Share Screen
      </button>

      <button
  onClick={() => {
    const stream = videoRef.current.srcObject;

    stream.getAudioTracks()[0].enabled =
      !stream.getAudioTracks()[0].enabled;

    setIsMuted(!isMuted);
  }}
  style={{
    padding: "10px 20px",
    marginLeft: "10px",
    background: isMuted ? "green" : "orange",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
  {isMuted ? "🎤 Unmute" : "🔇 Mute"}
</button>

      <button
        style={{
          padding: "10px 20px",
          marginLeft: "10px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        🔴 Record
      </button>
    </div>
  );
}

export default VideoRoom;