// Import the jsonwebtoken library for handling JWTs
const jwt = require("jsonwebtoken");

// Import the User model to interact with the user data in the database
const User = require("../Models/userModel");

// Middleware function to protect routes by checking for a valid JWT
exports.authProtected = async (req, res, next) => {
  try {
    // Check if the Authorization header exists and starts with "Bearer"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key and attach the decoded ID to req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "api__very__secret__string");

    // Find the user in the database by their ID
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the found user to the req object for further use in subsequent middleware or routes
    req.user = currentUser;
    next(); // Pass control to the next middleware or route handler

  } catch (err) {
    // Handle specific JWT errors for better clarity
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }

    // General error handling
    res.status(400).json({ status: "fail", message: err.message });
  }
};
