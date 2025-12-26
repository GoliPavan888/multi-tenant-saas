const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/rbac.middleware");
const { listAuditLogs } = require("../controllers/audit.controller");

router.get(
  "/audit-logs",
  authMiddleware,
  allowRoles("tenant_admin", "super_admin"),
  listAuditLogs
);

module.exports = router;
