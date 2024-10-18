const { errorHandler } = require("../auth");
const Blog = require("../models/blog");

module.exports.getAllBlogs = (req, res) => {
  return Blog.find()
    .then((blog) => {
      return res.status(200).send(blog);
    })
    .catch((error) => res.status(500).send(errorHandler(error, req, res)));
};

module.exports.getBlogById = (req, res) => {
  return Blog.findById(req.params.blogId)
    .then((blog) => {
      if (!blog) {
        return res.status(404).send({ message: "Blog not found" });
      } else {
        return res.status(200).send(blog);
      }
    })
    .catch((error) => res.status(500).send(errorHandler(error, req, res)));
};

module.exports.createBlog = (req, res) => {
  let blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id,
  });
  return blog
    .save()
    .then((blg) => {
      return res.status(201).send({
        message: "Blog added successfully",
        blog: blg,
      });
    })
    .catch((error) => res.status(500).send(errorHandler(error, req, res)));
};

module.exports.updateBlog = async (req, res) => {
  const { title, content } = req.body;
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }
    if (blog.author.toString() !== req.user.id) {
      return res
        .status(401)
        .send({ message: "Not authorized to update this blog" });
    }
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    const updatedBlog = await blog.save();
    res.send(updatedBlog);
  } catch (error) {
    res.status(500).send(errorHandler(error, req, res));
  }
};

module.exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.blogId });
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }
    if (blog.author.toString() !== req.user.id) {
      return res
        .status(401)
        .send({ message: "Not authorized to delete this blog" });
    }
    await blog.deleteOne();
    res.send({ message: "Blog removed" });
  } catch (error) {
    res.status(500).send(errorHandler(error, req, res));
  }
};

module.exports.getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId });
    if (blogs.length <= 0) {
      return res.status(404).send({ message: "No blogs found for this user" });
    }
    res.send(blogs);
  } catch (error) {
    res.status(500).send(errorHandler(error, req, res));
  }
};

module.exports.addComment = async (req, res) => {
  const { comment } = req.body;
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    const newComment = {
      comment,
      commenter: req.user.id,
    };

    blog.comments.push(newComment);
    await blog.save();
    res.status(201).send(blog.comments);
  } catch (error) {
    res.status(500).send(errorHandler(error, req, res));
  }
};

module.exports.getComments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }
    res.status(200).send(blog.comments);
  } catch (error) {
    res.status(500).send(errorHandler(error, req, res));
  }
};

module.exports.updateComment = async (req, res) => {
  const { comment } = req.body;
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    const existingComment = blog.comments.id(req.params.commentId);
    if (!existingComment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    if (existingComment.commenter.toString() !== req.user.id) {
      return res
        .status(401)
        .send({ message: "Not authorized to update this comment" });
    }

    existingComment.comment = comment || existingComment.comment;
    await blog.save();
    res.send(blog.comments);
  } catch (error) {
    res.status(500).send(errorHandler(error, req, res));
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    const existingComment = blog.comments.id(req.params.commentId);
    if (!existingComment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    if (existingComment.commenter.toString() !== req.user.id) {
      return res
        .status(401)
        .send({ message: "Not authorized to delete this comment" });
    }

    existingComment.deleteOne();
    await blog.save();
    res.send({ message: "Comment removed", comments: blog.comments });
  } catch (error) {
    res.status(500).send(errorHandler(error, req, res));
  }
};
