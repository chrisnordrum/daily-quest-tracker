const express = require("express");
const router = express.Router();
// Controller: Register, Login, Refresh, Logout a user
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const userValidator = require("../validator/user");

// POST request to register a new user
router.post("/register", userValidator.register, authController.register);
// POST request to login a user
router.post("/login", userValidator.login, authController.login);

//PATCH request to modify a user
router.patch(
  "/modify-profile",
  authMiddleware,
  userValidator.modifyProfile,
  authController.modifyProfile,
);

// GET request to refresh the access token
router.get("/refresh", authController.refresh);
// POST request to logout a user
router.post("/logout", authController.logout);

module.exports = router;
