const express = require("express");
const { verify } = require("../auth");
const blogController = require("../controllers/blog");

const router = express.Router();

router.get("/", blogController.getAllBlogs);
router.get("/:blogId", blogController.getBlogById);
router.post("/", verify, blogController.createBlog);
router.put("/:blogId", verify, blogController.updateBlog);
router.delete("/:blogId", verify, blogController.deleteBlog);
router.get("/user/:userId", blogController.getBlogsByUser);

router.post("/comments/:blogId", verify, blogController.addComment);

router.get("/comments/:blogId", blogController.getComments);

router.put(
  "/comments/:blogId/:commentId",
  verify,
  blogController.updateComment
);

router.delete(
  "/comments/:blogId/:commentId",
  verify,
  blogController.deleteComment
);

module.exports = router;
