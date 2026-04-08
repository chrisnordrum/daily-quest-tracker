const express = require("express");
const router = express.Router();
// Controller: Register, Login, Refresh, Logout a user
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

// POST request to register a new user
router.post("/register", authController.register);
// POST request to login a user
router.post("/login", authController.login);

//PATCH request to modify a user
router.patch("/modify-profile", authMiddleware, authController.modifyProfile);

// GET request to refresh the access token
router.get("/refresh", authController.refresh);
// POST request to logout a user
router.post("/logout", authController.logout);

module.exports = router;
