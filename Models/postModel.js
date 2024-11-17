const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title is required!"],
  },
  text: {
    type: String,
    required: [true, "Text is required!"],
  },
  hashtag: {
    type: String,
  },
  image: String,
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
