const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "FullName is required!"],
    minlength: 3,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required!"],
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
