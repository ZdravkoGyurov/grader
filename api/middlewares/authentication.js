const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const config = require('../../config');
const { ApiError } = require('../../errors/ApiError');

const authentication = async (req, res, next) => {
  const accessToken = req.cookies[config.auth.accessTokenCookieName];
  if (!accessToken) {
    const err = new ApiError(req, 'missing access token', StatusCodes.UNAUTHORIZED);
    return next(err);
  }

  try {
    const { email } = jwt.verify(accessToken, config.auth.accessTokenSecret);
    req.user = { email };
    return next();
  } catch (error) {
    const err = new ApiError(req, `invalid access token`, StatusCodes.UNAUTHORIZED);
    return next(err);
  }
};

module.exports = authentication;
