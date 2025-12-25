const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const superAdmin = require("../middlewares/superAdmin.middleware");
const controller = require("../controllers/superAdmin.controller");

router.use(auth);
router.use(superAdmin);

router.get("/tenants", controller.listTenants);
router.get("/tenants/:tenantId/users", controller.listUsersByTenant);
router.get("/tenants/:tenantId/projects", controller.listProjectsByTenant);

module.exports = router;
