const generateToken = require("../Helpers/authHelper");
const { hashPassword } = require("../Helpers/passwordHelper");
const User = require("../Models/userModel");
const bcrypt = require("bcrypt");

// Sign Up Function
exports.signUp = async function (req, res) {
  try {
    const { firstName, lastName, email, password, age } = req.body;

    // Check if email already exists
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password asynchronously
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: { user: newUser },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Log In Function
exports.logIn = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userAccount = await User.findOne({ email });
    if (!userAccount) {
      return res.status(400).json({ message: "User account does not exist" });
    }

    // Compare passwords asynchronously
    const passwordMatch = await bcrypt.compare(password, userAccount.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // Generate token
    const token = generateToken(userAccount._id);

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: { user: userAccount },
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
