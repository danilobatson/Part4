const blogRouter = require('express').Router();
const Blog = require('../models/blogs');
const User = require('../models/users');

const { info, error } = require('../utils/logger');
const config = require('../utils/config');

const jwt = require('jsonwebtoken');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  });
  res.json(blogs);
});

blogRouter.post('/', async (req, res, next) => {
  const { title, author, url, likes, id } = req.body;

  
   const token = getTokenFrom(req);
  //  const decodedToken = jwt.verify(token, config.SECRET);
  // if (!token || !decodedToken.id) {
  //   return res.status(401).json({ error: 'token missing or invalid' });
  // }
  const user = await User.find({});

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
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
