const { validationResult } = require("express-validator");
const Post = require("../models/feed");

const fs = require("fs");
const path = require("path");

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
  const imageUrl = req.file.path.replace(/\\/g, "/");
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  let oldImageUrl = imageUrl;

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }

  if (!imageUrl) {
    const error = new Error("no image provided.");
    error.status = 422;
    throw error;
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("error occurred! try again.");
    error.status = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Failed to get post data!");
        err.status = 404;
        throw err;
      }

      let oldImageUrl = post.imageUrl;
      if (req.file) {
        clearImage(oldImageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "post updated successfully!", post: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Failed to get post data!");
        err.status = 404;
        throw err;
      }

      //check if user logged in

      if (post.imageUrl) {
        clearImage(post.imageUrl);
      }

      Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ massage: "post deleted successfully!" });
    })
    .catch((err) => next(err));
};

const clearImage = (imagePath) => {
  const filePath = path.join(__dirname, "..", imagePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    }
  });
};
