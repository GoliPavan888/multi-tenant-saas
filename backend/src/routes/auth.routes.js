const express = require("express");
const router = express.Router();

const {
  registerTenant,
  login,
  me
} = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register-tenant", registerTenant);
router.post("/login", login);
router.get("/me", authMiddleware, me);

module.exports = router;
