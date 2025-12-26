const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const {
  createTask,
  listTasksByProject,
  updateTaskStatus
} = require("../controllers/task.controller");

router.use(auth);

// Create task
router.post("/", createTask);

// List tasks for a project
router.get("/project/:projectId", listTasksByProject);

// Update task status
router.patch("/:id", updateTaskStatus);

module.exports = router;
