const { info, error } = require('./logger');
const config = require('./config');

const requestLogger = (request, response, next) => {
  info('Method:', request.method);
  info('Path:  ', request.path);
  info('Body:  ', request.body);
  info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  info(error.name);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }
  error(error.message);
  next(error);
};

const getTokenFrom = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  next();
};





module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  getTokenFrom,
};
