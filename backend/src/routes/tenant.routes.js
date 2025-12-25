const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/rbac.middleware");
const {
  getAllTenants,
  getTenantById
} = require("../controllers/tenant.controller");

// SUPER ADMIN ONLY
router.get("/", authMiddleware, allowRoles("super_admin"), getAllTenants);
router.get("/:id", authMiddleware, allowRoles("super_admin"), getTenantById);

module.exports = router;
