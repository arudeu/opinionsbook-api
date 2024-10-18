const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Username is Required"],
  },
  content: {
    type: String,
    required: [true, "Email is Required"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is Required"],
  },
  comments: [
    {
      comment: {
        type: String,
        required: [true, "Comment is Required"],
      },
      commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      dateCommented: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
