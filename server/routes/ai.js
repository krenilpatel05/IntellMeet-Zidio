const express = require("express");
const router = express.Router();
const Task = require("../models/Task"); // Tumhara Task model database schema

// 🤖 DAY 15 & 16: AI Engine Endpoint with Automatic Task Insertion Pipeline
router.post("/generate-summary", async (req, res) => {
  try {
    const { meetingTitle } = req.body;

    if (!meetingTitle) {
      return res.status(400).json({ success: false, message: "Meeting title is required" });
    }

    // 🌟 PDF Compliance: Real-time generation simulation
    const processedSummary = `The cross-functional scrum synchronization session concluded with clear alignment on the architecture configuration for ${meetingTitle}. The engineering group analyzed global styles performance bottlenecks and verified full layout responsive stretching.`;
    
    const extractedActionItems = [
      { title: "Optimize global structural layout breakpoints", description: `Auto-generated from ${meetingTitle}`, assignedTo: "Krenil Patel" },
      { title: "Audit application dashboard live data aggregations", description: `Auto-generated from ${meetingTitle}`, assignedTo: "Team Specialist" }
    ];

    // 🛠️ AUTOMATIC INSERTION: Extracted items ko seedhe MongoDB collection me inject karo
    const savedTasks = [];
    for (const item of extractedActionItems) {
      // Pehle check karein agar task already insert toh nahi ho gaya duplicate avoid karne ke liye
      const exists = await Task.findOne({ title: item.title });
      if (!exists) {
        const newTask = new Task({
          title: item.title,
          description: item.description,
          assignedTo: item.assignedTo,
          status: "Pending" // Default initialization tracking state
        });
        await newTask.save();
        savedTasks.push(newTask);
      }
    }

    res.status(200).json({
      success: true,
      title: meetingTitle,
      summary: processedSummary,
      actionItems: extractedActionItems,
      insertedTasksCount: savedTasks.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "AI Pipeline Compilation Fault", error: error.message });
  }
});

module.exports = router;