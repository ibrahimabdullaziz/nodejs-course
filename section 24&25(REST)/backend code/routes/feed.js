const express = require("express");
const { getPosts, createPost, getPost } = require("../controllers/feed");
const { body } = require("express-validator");

const router = express.Router();

router.get("/posts", getPosts);
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost,
);

router.get("/post/:postId", getPost);
module.exports = router;
