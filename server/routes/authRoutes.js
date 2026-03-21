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

    //create tokens
    const accessToken = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "24h" },
    );
    //create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // Prevents JavaScript access
      secure: true, // Require https
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });
    //return the user
    res.status(201).json({
      message: `${username} created successfully`,
      accessToken,
      user: {
        id: newUser._id,
        role: newUser.role,
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      },
    });
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
      return res.status(400).json({ message: "Invalid username or password" });
    }
    //check if the password is correct
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    // create tokens
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "24h" },
    );
    //create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // Prevents JavaScript access
      secure: true, // Require https
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });
    //return the access token
    res.status(200).json({
      message: "login successful",
      accessToken,
      user: {
        id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET request to refresh the access token
router.get("/refresh", async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    //create an access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );
    //return the access token
    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
      user: {
        id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
});

//POST request to logout a user
router.post("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
