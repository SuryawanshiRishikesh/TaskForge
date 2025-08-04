import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const router = express.Router();

// Create project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const project = new Project({
      name: req.body.name,
      user: req.user.id,
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Error creating project" });
  }
});

// Get user's projects with tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).lean();
    const projectsWithTasks = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id });
        return { ...project, tasks };
      })
    );
    res.json(projectsWithTasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

export default router;
