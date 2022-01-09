const { StatusCodes } = require('http-status-codes');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  const error = err;
  error.code = err.code || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(error.code).send(error);
};

module.exports = errorMiddleware;
