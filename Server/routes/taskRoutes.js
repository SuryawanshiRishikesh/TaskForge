import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Task from "../models/Task.js";

const router = express.Router();

// Create task under a project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, projectId } = req.body;
    const task = new Task({ title, project: projectId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// Update task status
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

export default router;
