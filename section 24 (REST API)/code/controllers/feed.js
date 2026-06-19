exports.getPosts = (req, res) => {
  res.status(200).json({
    title: "first post",
    content: "here we go with first one",
  });
};

exports.createPost = (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: "Post Created Successfully!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
