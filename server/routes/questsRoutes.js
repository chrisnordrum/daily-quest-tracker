"use strict";

const express = require("express");
const router = express.Router();

// Controller: Get all quests, save a quest
const { getQuests, saveQuest } = require("../controllers/questsController");

router.get("/", getQuests);
router.post("/", saveQuest);

module.exports = router;
