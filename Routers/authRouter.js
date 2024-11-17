const express = require("express");
const authController = require("../Controllers/authController");
const authRouter = express.Router();

authRouter.post("/signUp", authController.signUp);
authRouter.post("/logIn", authController.logIn);

module.exports = authRouter;