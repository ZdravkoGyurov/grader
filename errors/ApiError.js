const { StatusCodes } = require("http-status-codes");
const logger = require("../logger");
const DbConflictError = require("./DbConflictError");
const DbError = require("./DbError");
const DbNotFoundError = require("./DbNotFoundError");
const JwtVerifyError = require("./JwtVerifyError");

class ApiError extends Error {
  constructor(req, message, code = StatusCodes.INTERNAL_SERVER_ERROR, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    logger(req).error(message);

    this.requestId = req.id;
    this.message = message;
    this.code = code;
    this.date = new Date();
  }
}

const apiError = (req, error) => {
  if (error instanceof JwtVerifyError) {
    return new ApiError(req, error.message, StatusCodes.UNAUTHORIZED);
  }
  if (error instanceof DbNotFoundError) {
    return new ApiError(req, error.message, StatusCodes.NOT_FOUND);
  }
  if (error instanceof DbConflictError) {
    return new ApiError(req, error.message, StatusCodes.CONFLICT);
  }
  if (error instanceof DbError) {
    return new ApiError(req, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  return new ApiError(req, error.message);
}

module.exports = { ApiError, apiError };