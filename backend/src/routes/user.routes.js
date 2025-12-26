const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");

router.use(auth);

router.post("/", userController.createUser);
router.get("/", userController.listUsers);
router.delete("/:id", userController.deleteUser);

module.exports = router;
