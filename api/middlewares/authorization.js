const { StatusCodes } = require('http-status-codes');
const { ApiError, apiError } = require('../../errors/ApiError');
const authService = require('../../services/auth');

const authorization = requiredRoleId => async (req, res, next) => {
  const { email } = req.user;

  try {
    const user = await authService.getUser(email);

    if (user.roleId < requiredRoleId) {
      const err = new ApiError(req, 'unauthorized', StatusCodes.FORBIDDEN);
      return next(err);
    }

    req.user = {
      email: user.email,
      githubAccessToken: user.githubAccessToken,
      roleId: user.roleId
    };
    return next();
  } catch (error) {
    const err = apiError(req, error);
    return next(err);
  }
};

module.exports = authorization;
