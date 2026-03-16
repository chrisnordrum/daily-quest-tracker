"use strict";

const express = require("express");
const argon2 = require("argon2");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");

//POST request to register a new user
router.post("/register", async (req, res) => {
  try {
    //destructure the request body
    const { username, password, first_name, last_name, email } = req.body;

    //check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    //hash the password
    const hashedPassword = await argon2.hash(password);
    //create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      first_name,
      last_name,
      email,
    });
    //save the user to the database
    await newUser.save();
    //return the user
    res.status(201).json({ message: `${username} created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//POST request to login a user
router.post("/login", async (req, res) => {
  try {
    //destructure the request body
    const { username, password } = req.body;
    //check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: `${username} not found` });
    }
    //check if the password is correct
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    //create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    //return the token
    res.status(200).json({ message: "login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
