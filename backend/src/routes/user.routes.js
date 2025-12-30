const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/rbac.middleware");

// All routes require auth
router.use(auth);

/**
 * ADD USER TO TENANT
 * POST /api/tenants/:tenantId/users
 * tenant_admin only
 */
router.post(
  "/:tenantId/users",
  allowRoles("tenant_admin"),
  userController.createUser
);

/**
 * LIST TENANT USERS
 * GET /api/tenants/:tenantId/users
 * tenant scoped
 */
router.get(
  "/:tenantId/users",
  allowRoles("tenant_admin", "user"),
  userController.listUsers
);

/**
 * DELETE USER
 * DELETE /api/users/:userId
 * tenant_admin only
 */
router.delete(
  "/users/:userId",
  allowRoles("tenant_admin"),
  userController.deleteUser
);

module.exports = router;
