const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/rbac.middleware");
const {
  createProject,
  listProjects,
  getProjectById,
  deleteProject
} = require("../controllers/project.controller");

router.post("/", authMiddleware, allowRoles("tenant_admin"), createProject);
router.get("/", authMiddleware, allowRoles("tenant_admin", "user"), listProjects);
router.get("/:id", authMiddleware, allowRoles("tenant_admin", "user"), getProjectById);
router.delete("/:id", authMiddleware, allowRoles("tenant_admin"), deleteProject);

module.exports = router;
