const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const auth = require("../middleware/authorize");
// Controller: Get the admin dashboard and all users for the admin
const adminController = require("../controllers/adminController");
// GET request to get the admin dashboard
router.get("/", authMiddleware, auth("admin"), adminController.getDashboard);
// GET request to get all users for the admin
router.get("/users", authMiddleware, auth("admin"), adminController.getUsers);

module.exports = router;
