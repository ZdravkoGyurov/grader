const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { body } = require('express-validator');
const authService = require('../../services/auth');
const config = require('../../config');
const { ApiError, apiError } = require('../../errors/ApiError');
const logger = require('../../logger');
const paths = require('../paths');
const validation = require('../middlewares/validation');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const { role } = require('../../consts');

const authRouter = Router();

authRouter.get(paths.auth.githubLogin, async (req, res) => {
  const githubOauthUrl = 'https://github.com/login/oauth/authorize';
  const redirectUri = `http://${config.app.host}:${config.app.port}/login/oauth/github/callback`;
  const oauthUrlParams = `?client_id=${config.github.clientId}&scope=${config.github.requiredScope}&redirect_uri=${redirectUri}`;
  res.redirect(githubOauthUrl + oauthUrlParams);
});

authRouter.get(paths.auth.githubLoginCallback, async (req, res) => {
  const { code } = req.query;
  if (!code) {
    const err = new ApiError(req, 'missing code', StatusCodes.BAD_REQUEST);
    return res.status(err.code).send(err);
  }

  const { user, tokens } = await authService.login(code);

  // used for debugging with Postman
  console.log('accessToken => ', tokens.userAccessToken);
  res.cookie(config.auth.accessTokenCookieName, tokens.userAccessToken, {
    httpOnly: true,
    path: '/'
  });
  res.cookie(config.auth.refreshTokenCookieName, tokens.userRefreshToken, {
    httpOnly: true,
    path: '/'
  });

  const uiUrl = 'http://localhost:3000';
  // return res.send(user);
  res.redirect(uiUrl);
});

authRouter.get(paths.auth.userInfo, async (req, res) => {
  const accessToken = req.cookies[config.auth.accessTokenCookieName];
  if (!accessToken) {
    const err = new ApiError(req, 'missing access token', StatusCodes.UNAUTHORIZED);
    return res.status(err.code).send(err);
  }

  try {
    const user = await authService.getUserInfo(accessToken);
    return res.send(user);
  } catch (error) {
    const err = apiError(req, error);
    return res.status(err.code).send(err);
  }
});

authRouter.patch(
  paths.auth.userInfo,
  authentication,
  authorization(role.ADMIN),
  body('email', 'should be an email').notEmpty().isEmail(),
  body('roleName', 'should not be empty').notEmpty(),
  validation,
  async (req, res) => {
    const user = {
      email: req.body.email,
      roleName: req.body.roleName
    };

    try {
      await authService.updateAssignment(user);
      return res.sendStatus(StatusCodes.OK);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

authRouter.post(paths.auth.token, async (req, res) => {
  const refreshToken = req.cookies[config.auth.refreshTokenCookieName];
  if (!refreshToken) {
    const err = new ApiError(req, 'missing refresh token', StatusCodes.UNAUTHORIZED);
    return res.status(err.code).send(err);
  }

  try {
    const { email, accessToken } = await authService.generateAccessToken(refreshToken);
    res.cookie(config.auth.accessTokenCookieName, accessToken, {
      httpOnly: true,
      path: '/'
    });

    logger(req).info(`generated new access token for user with email '${email}'`);
    return res.sendStatus(StatusCodes.OK);
  } catch (error) {
    const err = apiError(req, error);
    return res.status(err.code).send(err);
  }
});

authRouter.delete(paths.auth.logout, async (req, res) => {
  const accessToken = req.cookies[config.auth.accessTokenCookieName];
  if (!accessToken) {
    const err = new ApiError(req, 'missing access token', StatusCodes.UNAUTHORIZED);
    return res.status(err.code).send(err);
  }

  try {
    await authService.deleteUserRefreshToken(accessToken);
  } catch (error) {
    const err = apiError(req, error);
    return res.status(err.code).send(err);
  }

  res.clearCookie(config.auth.accessTokenCookieName);
  res.clearCookie(config.auth.refreshTokenCookieName);
  return res.sendStatus(StatusCodes.OK);
});

module.exports = authRouter;
