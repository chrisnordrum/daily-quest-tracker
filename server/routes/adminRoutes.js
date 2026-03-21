const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const auth = require("../middleware/authorize");

router.get("/", authMiddleware, auth("admin"), (req, res) => {
  res.status(200).json({
    message: "Welcome, admin user!",
    adminFeatures: [
      "Manage users",
      "View reports",
      "Add Quests",
      "Edit Quests",
      "Delete Quests",
    ]
  });
});

module.exports = router;