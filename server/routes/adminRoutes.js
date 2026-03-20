const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const auth = require("../middleware/authorize");

router.get("/protected", authMiddleware, auth("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome, admin user!" });
});

module.exports = router;
