const { validationResult } = require("express-validator");
const Post = require("../models/feed");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res
        .status(200)
        .json({ message: "posts fetched successfully!", posts: posts });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500; //server side error
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("error occurred! try again.");
    error.status = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("no image provided.");
    error.status = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\", "/");
  const post = new Post({
    title: title,
    content: content,
    creator: { name: "Ibrahim" },
    imageUrl: imageUrl,
  });

  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post Created Successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500; //server side error
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Failed to get post data!");
        err.status = 404;
        throw err;
      }
      res
        .status(200)
        .json({ message: "post fetched successfully", post: post });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500; //server side error
      }
      next(err);
    });
};
