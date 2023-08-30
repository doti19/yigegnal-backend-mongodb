const httpStatus = require('http-status');
const mongoose = require('mongoose');
const expressValidation = require('express-validation');
const APIError = require('../errors/api-error');
const { env } = require('../../config/config');
const logger = require('../../config/logger');

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
  // console.log('llllll');
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    
    errors: err.errors,
    stack: err.stack,
  };

  if (env !== 'development' && !err.isOperational) {
    delete response.stack;
    delete response.message;
  }
if(env === 'development'){
  logger.error(err);
}
  res.status(err.status);
  res.json(response);
};
exports.handler = handler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let convertedError = err;

  if (err instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: 'Validation Error',
      errors: err.errors,
      status: err.status,
      stack: err.stack,
    });
  } else if (!(err instanceof APIError)) {
    const statusCode  = err.statusCode || err instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || httpStatus[statusCode];
    convertedError = new APIError({
      message: message,
      status: statusCode,
      isPublic: true,
      stack: err.stack,
    });
  } 

  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};
