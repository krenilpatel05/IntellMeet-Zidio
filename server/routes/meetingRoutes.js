const express = require("express");
const Meeting = require("../models/Meeting");

const router = express.Router();

// Create Meeting
router.post("/create", async (req, res) => {
  try {
    console.log("Meeting Data:", req.body);

    const meeting = await Meeting.create(req.body);

    res.status(201).json({
      success: true,
      meeting,
      message: "Meeting Created Successfully",
    });
  } catch (error) {
    console.log("Meeting Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All Meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({
      createdAt: -1,
    });

    console.log("Meetings From DB =>", meetings);

    res.json({
      success: true,
      meetings,
    });
  } catch (error) {
    console.log("FULL ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update Meeting
router.put("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      meeting,
      message: "Meeting Updated Successfully",
    });
  } catch (error) {
    console.log("UPDATE ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete Meeting
router.delete("/:id", async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Meeting Deleted Successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;