const { StatusCodes } = require('http-status-codes');
const { ApiError, apiError } = require('../../errors/ApiError');
const authService = require('../../services/auth');
const roles = require('../../consts');

const comparableRole = role => {
  switch (role) {
    case roles.role.ADMIN:
      return 1;
    case roles.role.TEACHER:
      return 2;
    case roles.role.STUDENT:
      return 3;
    default:
      throw new Error('invalid role');
  }
};

const authorization = requiredRoleName => async (req, res, next) => {
  const { email } = req.user;

  try {
    const user = await authService.getUser(email);

    if (comparableRole(user.roleName) > comparableRole(requiredRoleName)) {
      const err = new ApiError(req, 'unauthorized', StatusCodes.FORBIDDEN);
      return next(err);
    }

    req.user = {
      email: user.email,
      githubAccessToken: user.githubAccessToken,
      roleName: user.roleName
    };
    return next();
  } catch (error) {
    const err = apiError(req, error);
    return next(err);
  }
};

module.exports = authorization;
