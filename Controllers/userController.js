const sharp = require("sharp");
const { hashPassword } = require("../Helpers/passwordHelper");
const User = require("../Models/userModel");

// CREATE USER
exports.createUser = async function (req, res) {
  try {
    const { fullName, email, password } = req.body;

    // Check if email already exists
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        message: "email already exists",
      });
    }

    // Hash password asynchronously
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: ["User not Created!", err.message],
    });
  }
};

// GET ONE USER
exports.getOneUser = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      user: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// UPDATE USER
exports.updateUser = async function (req, res) {
  try {
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        users: updateUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// DELETE USER
exports.deleteUser = async function (req, res) {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({
      status: "success",
      message: "User Deleted",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "User not deleted!",
    });
  }
};

//UPLOAD USER IMAGE
exports.uploadUserImage = async function (req, res) {
  try {
    // Log the uploaded file information (useful for debugging)
    console.log(req.file);

    // If no file is uploaded, return a response with a relevant message
    if (!req.file) {
      return res.status(400).json({ message: "No Image was Uploaded" });
    }

    // Fetch the user from the database using the authenticated user's ID
    const user = await User.findById(req.user._id);

    const imageFileName = `user-${user._id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(750, 750)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(`Public/Assets/Users/${imageFileName}`);

    // Update the user's image field with the new image file name
    user.image = imageFileName;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Image Successfully Uploaded",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message || "Something went wrong during the image upload",
    });
  }
};


