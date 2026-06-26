const { validationResult } = require("express-validator");
const Post = require("../models/feed");

exports.getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        title: "first post",
        content: "here we go with first one",
        _id: 1,
        creator: { name: "Ibrahim" },
        createdAt: new Date(),
        imageUrl: "images/image1.jpg",
      },
    ],
  });
};

exports.createPost = (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "error occurred! try again.",
      errors: errors.array(),
    });
  }

  const post = new Post({
    title: title,
    content: content,
    creator: { name: "Ibrahim" },
    imageUrl: "images/image1.jpg",
  });

  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post Created Successfully!",
        post: result,
      });
    })
    .catch((err) => console.log(err));
};
