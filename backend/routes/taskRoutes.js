const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

router.post("/add", protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Task text is required" });
    }

    // Create a task for the logged-in user only.
    const newTask = new Task({ text: text.trim(), user: req.user._id });
    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Unable to add task", error: error.message });
  }
});

router.get("/tasks", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch tasks", error: error.message });
  }
});

router.put("/update/:id", protect, async (req, res) => {
  try {
    const updateData = {};

    if (typeof req.body.text === "string") {
      if (!req.body.text.trim()) {
        return res.status(400).json({ message: "Task text is required" });
      }

      updateData.text = req.body.text.trim();
    }

    if (typeof req.body.completed === "boolean") {
      updateData.completed = req.body.completed;
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Unable to update task", error: error.message });
  }
});

router.delete("/delete/:id", protect, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete task", error: error.message });
  }
});

router.patch("/tasks/:id", protect, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { completed: req.body.completed },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Unable to update task", error: error.message });
  }
});

router.delete("/tasks/:id", protect, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete task", error: error.message });
  }
});

module.exports = router;
