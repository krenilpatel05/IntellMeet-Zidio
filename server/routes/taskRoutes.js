const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Create Task
router.post("/create", async (req, res) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      task,
      message: "Task Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All Tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Edit Task
router.put("/edit/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      task,
      message: "Task Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Mark Task Complete
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: "Completed",
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      task,
      message: "Task Completed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete Task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;