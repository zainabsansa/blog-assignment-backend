const express = require("express");
const cors = require("cors")
const { default: mongoose } = require("mongoose");
const userRouter = require('./Routers/userRouter');
const authRouter = require("./Routers/authRouter");
const postRouter = require("./Routers/postRouter");
const app = express();
require('dotenv').config();

// First Middleware
app.use(express.json());

app.use(cors());

app.use(function (req, res, next) {
  console.log("Fetching...");
  next();
});

app.use("/api/users", userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

const dbString = process.env.DB_CONNECTION_STRING;
// oSGRtnceQPck9Tof
async function connectDB() {
  try {
    await mongoose.connect(dbString);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Database Connection failed", err.message);
    process.exit(1);
  }
}
connectDB()

const PORT = process.env.PORT || 4010;
app.listen(PORT, "localhost", function () {
  console.log(`My app is listening on a port ${PORT}`);
});
