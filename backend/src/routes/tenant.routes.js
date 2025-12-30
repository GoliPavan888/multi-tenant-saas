const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/rbac.middleware");
const { createTenantByAdmin } = require("../controllers/tenant.controller");


const {
  getAllTenants,
  getTenantById,
  updateTenant // 🔥 ADD THIS
} = require("../controllers/tenant.controller");

// SUPER ADMIN ONLY
router.get("/", authMiddleware, allowRoles("super_admin"), getAllTenants);
router.get("/:id", authMiddleware, allowRoles("super_admin"), getTenantById);

// 🔥 THIS IS THE MISSING ROUTE (FIXES YOUR ERROR)
router.put(
  "/:id",
  authMiddleware,
  allowRoles("super_admin"),
  updateTenant
);
router.post(
  "/",
  authMiddleware,
  allowRoles("super_admin"),
  createTenantByAdmin
);


module.exports = router;
