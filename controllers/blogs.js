const blogRouter = require('express').Router();
const Blog = require('../models/blogs');

blogRouter.get('/', (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
});

blogRouter.post('/', (req, res) => {
  const blog = new Blog(req.body);

  blog.save().then((result) => {
    res.status(201).json(result);
  });
});

blogRouter.put('/:id', (req, res, next) => {
  const body = req.body;
  const blog = {
    author: body.author,
  };
  console.log(body);

  Blog.findByIdAndUpdate(req.params.id, blog)
    .then((updatedBlog) => {
      res.json(updatedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
