const config = require('./utils/config');
const express = require('express');
const app = express();

const cors = require('cors');
const blogRouter = require('./controllers/blogs');

const { info, error } = require('./utils/logger');
const mongoose = require('mongoose');
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middleware');

const url = config.MONGODB_URI;
const mongoUrl = 'mongodb://localhost/bloglist';

info('connecting to', mongoUrl);

mongoose
  .connect(url)
  .then(() => {
    info('connected to MongoDB');
  })
  .catch((error) => {
    error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/blogs', blogRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
