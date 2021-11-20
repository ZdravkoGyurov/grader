const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');

const { ApiError } = require('../../errors/ApiError');

const validationErrorMessage = validationErrors =>
  validationErrors
    .array()
    .map(e => `${e.param} ${e.msg}`)
    .join(', ');

const validation = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errorMessage = validationErrorMessage(validationErrors);
    const err = new ApiError(req, errorMessage, StatusCodes.BAD_REQUEST);
    return next(err);
  }
  return next();
};

module.exports = validation;
