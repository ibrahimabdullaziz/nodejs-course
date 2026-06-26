const express = require("express");
const { getPosts, createPost } = require("../controllers/feed");
const { body } = require("express-validator");

const router = express.Router();

router.get("/posts", getPosts);
router.post(
  "/post",
  [
    body("title").trim().length({ min: 5 }),
    body("content").trim().length({ min: 5 }),
  ],
  createPost,
);

module.exports = router;
