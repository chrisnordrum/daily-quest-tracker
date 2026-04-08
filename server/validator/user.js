const validate = require("../middleware/validate");
const { body } = require("express-validator");
const User = require("../models/User");

const register = validate([
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) {
        return Promise.reject("Username already exists");
      }
    })
    .trim()
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .escape(),
  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .bail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        return Promise.reject("Email already exists");
      }
    }),
  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .trim()
    .escape(),
]);

const login = validate([
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
]);

const modifyProfile = validate([
  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .escape(),
  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .bail()
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (user) {
        return Promise.reject("Email already exists");
      }
    }),
  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .trim()
    .escape(),
]);

module.exports = {
  register,
  login,
  modifyProfile,
};
