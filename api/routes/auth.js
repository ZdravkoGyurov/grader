const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const authService = require('../../services/auth');
const config = require('../../config');
const { ApiError, apiError } = require('../../errors/ApiError');
const logger = require('../../logger');

const authRouter = new Router();

authRouter.get('/login/oauth/github', async (req, res) => {
  const githubOauthUrl = 'https://github.com/login/oauth/authorize';
  const redirectUri = `http://${config.app.host}:${config.app.port}/login/oauth/github/callback`;
  const oauthUrlParams = `?client_id=${config.github.clientId}&scope=${config.github.requiredScope}&redirect_uri=${redirectUri}`;
  res.redirect(githubOauthUrl + oauthUrlParams);
});

authRouter.get('/login/oauth/github/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    const err = new ApiError(req, 'missing code', StatusCodes.BAD_REQUEST);
    return res.send(err).status(StatusCodes.BAD_REQUEST);
  }

  const { user, tokens } = await authService.login(code);

  res.cookie(config.auth.accessTokenCookieName, tokens.userAccessToken, {
    httpOnly: true,
    path: '/'
  });
  res.cookie(config.auth.refreshTokenCookieName, tokens.userRefreshToken, {
    httpOnly: true,
    path: '/'
  });

  return res.send(user);
});

authRouter.get('/userInfo', async (req, res) => {
  const accessToken = req.cookies[config.auth.accessTokenCookieName];
  if (!accessToken) {
    const err = new ApiError(
      req,
      'missing access token',
      StatusCodes.UNAUTHORIZED
    );
    return res.send(err).status(StatusCodes.UNAUTHORIZED);
  }

  try {
    const user = await authService.getUserInfo(accessToken);
    return res.send(user);
  } catch (error) {
    const err = apiError(req, error);
    return res.send(err).status(err.code);
  }
});

authRouter.post('/token', async (req, res) => {
  const refreshToken = req.cookies[config.auth.refreshTokenCookieName];
  if (!refreshToken) {
    const err = new ApiError(
      req,
      'missing refresh token',
      StatusCodes.UNAUTHORIZED
    );
    return res.send(err).status(StatusCodes.UNAUTHORIZED);
  }

  try {
    const { email, userAccessToken } =
      authService.generateAccessToken(refreshToken);
    res.cookie(config.auth.accessTokenCookieName, userAccessToken, {
      httpOnly: true,
      path: '/'
    });

    logger(req).info(
      `generated new access token for user with email '${email}'`
    );
    return res.sendStatus(StatusCodes.OK);
  } catch (error) {
    const err = apiError(req, error);
    return res.send(err).status(err.code);
  }
});

authRouter.delete('/logout', async (req, res) => {
  const accessToken = req.cookies[config.auth.accessTokenCookieName];
  if (!accessToken) {
    const err = new ApiError(
      req,
      'missing access token',
      StatusCodes.UNAUTHORIZED
    );
    return res.send(err).status(StatusCodes.UNAUTHORIZED);
  }

  try {
    await authService.deleteUserRefreshToken(accessToken);
  } catch (error) {
    const err = apiError(req, error);
    return res.send(err).status(err.code);
  }

  res.clearCookie(config.auth.accessTokenCookieName);
  res.clearCookie(config.auth.refreshTokenCookieName);
  return res.sendStatus(StatusCodes.OK);
});

module.exports = authRouter;
