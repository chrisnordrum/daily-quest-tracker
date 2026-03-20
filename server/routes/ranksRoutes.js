"use strict";

const express = require("express");
const router = express.Router();

// Controller: Get all ranks
const { getRanks } = require("../controllers/ranksController");

const authMiddleware = require("../middleware/auth");

// GET request to get all ranks
// Middleware to authenticate and authorize the user
router.get("/", authMiddleware, getRanks);

module.exports = router;
