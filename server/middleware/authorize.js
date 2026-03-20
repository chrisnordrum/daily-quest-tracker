"use strict";

// Middleware to authorize users based on their role
const authorize = (role) => {
  return (req, res, next) => {
    // Check if the user is authenticated and has the required role
    if (req.user && req.user.role === role) {
      // Call the next middleware function
      next();
    } else {
      // If the user is not authenticated or does not have the required role, return a 403 error
      return res
        .status(403)
        .json({ message: "You are not authorized to access this resource" });
    }
  };
};

module.exports = authorize;
