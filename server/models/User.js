"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  googleId: { type: String, default: null },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  bio: { type: String, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
