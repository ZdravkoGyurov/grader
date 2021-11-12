const { Router } = require("express");
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const authService = require('../../services/auth')
const db = require('../../db/user');
const config = require('../../config');
const { ApiError, apiError } = require('../../errors/ApiError');
const logger = require("../../logger");

const redirectUri = `http://${config.app.host}:${config.app.port}/login/oauth/github/callback`;

const authRouter = Router();

authRouter.post("/token", async (req, res) => {
  const refreshToken = req.cookies[config.auth.refreshTokenCookieName];
  if (!refreshToken) {
    const err = new ApiError(req, 'missing refresh token', StatusCodes.UNAUTHORIZED);
    return res.send(err).status(StatusCodes.UNAUTHORIZED);
  }

  try {
    const { email, userAccessToken } = authService.generateAccessToken(refreshToken);
    res.cookie(config.auth.accessTokenCookieName, userAccessToken, {
      httpOnly: true,
      path: '/'
    });

    logger(req).info(`generated new access token for user with email '${email}'`);
    return res.sendStatus(StatusCodes.OK);
  } catch (error) {
    const err = apiError(req, error);
    return res.send(err).status(err.code);
  }
})

authRouter.get("/userInfo", async (req, res) => {
  const accessToken = req.cookies[config.auth.accessTokenCookieName];
  if (!accessToken) {
    const err = new ApiError(req, 'missing access token', StatusCodes.UNAUTHORIZED);
    return res.send(err).status(StatusCodes.UNAUTHORIZED);
  }

  try {
    const user = await authService.getUserInfo(accessToken);
    return res.send(user);
  } catch (error) {
    const err = apiError(req, error)
    return res.send(err).status(err.code);
  }
})

authRouter.get("/logout", async (req, res) => {
  const accessToken = req.cookies[config.auth.accessTokenCookieName];
  if (!accessToken) {
    console.error('Failed to get access token');
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
  const email = jwt.verify(accessToken, config.auth.accessTokenSecret).email;

  try {
    await db.setUserRefreshToken(email, null);
    res.clearCookie(config.auth.accessTokenCookieName);
    res.clearCookie(config.auth.refreshTokenCookieName);
    return res.sendStatus(StatusCodes.OK);
  } catch (error) {
    console.error(error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
})

authRouter.get('/login/oauth/github', async (req, res) => {
  const githubOauthUrl = 'https://github.com/login/oauth/authorize';
  const oauthUrlParams = `?client_id=${config.github.clientId}&scope=${config.github.requiredScope}&redirect_uri=${redirectUri}`;
  res.redirect(githubOauthUrl + oauthUrlParams);
})

authRouter.get('/login/oauth/github/callback', async (req, res) => {
  const data = {
    client_id: config.github.clientId,
    client_secret: config.github.clientSecret,
    code: req.query.code,
    redirect_uri: redirectUri
  };

  try {
      const githubAccessToken = await authService.getGithubAccessToken(data);
      try {
          const email = await authService.getGithubUserEmail(githubAccessToken);
          const { name, avatarUrl } = await authService.getGithubUserInfo(githubAccessToken);

          const userAccessToken = jwt.sign({ email: email }, config.auth.accessTokenSecret);
          
          let user = await db.getUser(email);
          if (!user) {
              const userRefreshToken = jwt.sign({ email: email }, config.auth.refreshTokenSecret);
              user = {
                  email: email,
                  name: name,
                  avatarUrl: avatarUrl,
                  refreshToken: userRefreshToken,
                  githubAccessToken: githubAccessToken
              }
              try {
                  user = await db.createUser(user);
              } catch (error) {
                  console.error(error);
                  return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
              }
          }

          if (!user.refreshToken) {
              user.refreshToken = jwt.sign({ email: email }, config.auth.refreshTokenSecret);
              await db.setUserRefreshToken(user.email, user.refreshToken);
          }

          res.cookie(config.auth.accessTokenCookieName, userAccessToken, {
              httpOnly: true,
              path: '/'
          });
          res.cookie(config.auth.refreshTokenCookieName, user.refreshToken, {
              httpOnly: true,
              path: '/'
          });

          delete user.refreshToken;
          delete user.githubAccessToken;

          return res.send(user);
      } catch (error) {
          console.error(error);
          return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
  } catch (error) {
    console.error(error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
})

module.exports = authRouter;