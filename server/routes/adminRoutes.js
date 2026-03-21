const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const auth = require("../middleware/authorize");
const User = require("../models/User");

router.get("/", authMiddleware, auth("admin"), (req, res) => {
  res.status(200).json({
    message: "Welcome to the admin dashboard!",
  });
});

router.get("/users", authMiddleware, auth("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;