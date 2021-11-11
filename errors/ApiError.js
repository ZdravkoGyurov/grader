const { StatusCodes } = require("http-status-codes");

class ApiError extends Error {
  constructor(requestId, message, code = StatusCodes.INTERNAL_SERVER_ERROR, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.requestId = requestId;
    this.message = message;
    this.code = code;
    this.date = new Date();
  }
}

module.exports = ApiError;