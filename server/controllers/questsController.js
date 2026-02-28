"use strict";
const { getData, saveData } = require("../models/db");

/**
 * Controller: Get all quests
 *
 * Handles GET requests to fetch all quests from the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - Array of quests on success, or an error message on failure
 */
const getQuests = async (req, res) => {
  try {
    // Reasons for not caching this response:
    // The quests are dynamic and change based on the user's progress.
    res.set("Cache-Control", "no-store");
    const data = await getData();
    res.status(200).json(data.quests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get quests" });
  }
};

/**
 * Controller: Save a quest
 *
 * Handles POST requests to save a quest to the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - The saved quest on success, or an error message on failure
 */
const saveQuest = async (req, res) => {
  try {
    const quest = req.body;
    if (
      !quest.title ||
      !quest.description ||
      !quest.xpReward ||
      //completed is a boolean, if doesn't exist, it's undefined.
      quest.completed === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = await getData();
    //assign a new id to the quest
    quest.id = data.quests.length + 1;
    //add the quest to the quests array
    data.quests.push(quest);
    //save the data to the database
    await saveData(data);
    //return the quest
    res.status(201).json(quest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save quest" });
  }
};
module.exports = {
  getQuests,
  saveQuest,
};
