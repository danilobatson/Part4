const blogRouter = require('express').Router();
const Blog = require('../models/blogs');
const { info, error } = require('../utils/logger');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogRouter.post('/', async (req, res, next) => {
  const body = req.body;
  const { title, author, url, likes } = body;
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

blogRouter.put('/:id', async (req, res, next) => {
  const body = req.body;
  const blog = {
    author: body.author,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog);
  res.json(updatedBlog);
});

blogRouter.get('/:id', async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  res.json(blog);
});

blogRouter.delete('/:id', async (req, res, next) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = blogRouter;
