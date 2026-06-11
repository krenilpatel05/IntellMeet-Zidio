import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function PostMeetingAI() {
  const [meetingTitle, setMeetingTitle] = useState("IntellMeet Sprint Sync");
  const [aiSummary, setAiSummary] = useState("");
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const triggerAIProcessing = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/generate-summary", {
        meetingTitle,
        transcripts: "Active tracking payload buffers capture logic executed dynamically."
      });

      if (res.data.success) {
        setAiSummary(res.data.summary);
        setActionItems(res.data.actionItems);
      }
    } catch (error) {
      alert("AI Processing Connection Fault. Verify backend initialization on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "40px 30px", minHeight: "calc(100vh - 76px)", background: "#0f172a", color: "white", width: "100%", boxSizing: "border-box", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ marginBottom: "35px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 10px 0", letterSpacing: "-0.04em" }}>🤖 AI Meeting Intelligence</h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "15px" }}>Extract auto-summaries, transcription narratives, and smart actionable items dynamically.</p>
        </div>

        <div style={{ background: "#1e293b", padding: "25px", borderRadius: "14px", border: "1px solid #334155", maxWidth: "650px", marginBottom: "40px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)" }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#38bdf8", fontSize: "16px", fontWeight: "700" }}>Select Processing Log Target</h3>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <input type="text" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} style={{ flex: "1", minWidth: "250px", padding: "12px 16px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "white", fontSize: "15px", outline: "none" }} />
            <button onClick={triggerAIProcessing} disabled={loading} style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }}>
              {loading ? "Processing Pipelines..." : "✨ Generate AI Insights"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "30px", width: "100%", alignItems: "start" }}>
          <div style={{ background: "#1e293b", padding: "28px", borderRadius: "14px", border: "1px solid #334155" }}>
            <h2 style={{ color: "#38bdf8", fontSize: "18px", fontWeight: "700", marginTop: 0, marginBottom: "20px" }}>📝 Narrative Summary Analysis</h2>
            {aiSummary ? <p style={{ color: "#cbd5e1", lineHeight: "1.6", fontSize: "15px", margin: 0 }}>{aiSummary}</p> : <p style={{ color: "#475569", fontSize: "14px", fontStyle: "italic", margin: 0 }}>Trigger execution to resolve conversational log blocks.</p>}
          </div>

          <div style={{ background: "#1e293b", padding: "28px", borderRadius: "14px", border: "1px solid #334155" }}>
            <h2 style={{ color: "#10b981", fontSize: "18px", fontWeight: "700", marginTop: 0, marginBottom: "20px" }}>🎯 Smart Action Matrix</h2>
            {actionItems.length === 0 ? <p style={{ color: "#475569", fontSize: "14px", fontStyle: "italic", margin: 0 }}>No actions currently extracted from historical logs.</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {actionItems.map((item, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "#0f172a", borderRadius: "8px", border: "1px solid #334155" }}>
                    <span style={{ fontSize: "14px", color: "#f8fafc", fontWeight: "600" }}>📌 {item.task}</span>
                    <span style={{ background: "#1e293b", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.4)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>{item.assignee}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PostMeetingAI;