const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blogs');
const User = require('../models/users');

const { info, error } = require('../utils/logger');
const config = require('../utils/config');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  res.json(blogs);
});

blogRouter.post('/', async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const user = req.user;
  const blog = new Blog({ ...req.body, user: user._id });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
});

blogRouter.put('/:id', async (req, res, next) => {
  const blog = req.body;
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true, runValidators: true, context: 'query',
  });
  res.json(updatedBlog);
});

blogRouter.get('/:id', async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  res.json(blog);
});

blogRouter.delete('/:id', async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).end();
  }
  if (blog.user && blog.user.toString() !== req.user.id) {
    return res
      .status(401)
      .json({ error: 'only the creator can delete a blog' });
  }

  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = blogRouter;
