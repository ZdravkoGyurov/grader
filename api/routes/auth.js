const { Router } = require("express");
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { generateAccessToken, getGithubAccessToken, getGithubUserInfo, getGithubUserEmail } = require('../../services/auth')
const db = require('../../db/user');
const config = require('../../config');
const ApiError = require('../../errors/ApiError');

const redirectUri = `http://${config.app.host}:${config.app.port}/login/oauth/github/callback`;

const authRouter = Router();

authRouter.get("/token", async (req, res) => {
  const refreshToken = req.cookies[config.auth.refreshTokenCookieName];
  if (!refreshToken) {
    console.error('Failed to get refresh token');
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  try {
    const userAccessToken = generateAccessToken(refreshToken);
    res.cookie(config.auth.accessTokenCookieName, userAccessToken, {
      httpOnly: true,
      path: '/'
    });
  } catch (error) {
    return res.send(new ApiError(req.id, error.message, StatusCodes.UNAUTHORIZED)).status(StatusCodes.UNAUTHORIZED);
  }

  return res.sendStatus(StatusCodes.OK);
})

authRouter.get("/userInfo", async (req, res) => {
  const accessToken = req.cookies[config.auth.accessTokenCookieName];
  if (!accessToken) {
    console.error('Failed to get access token');
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
  const email = jwt.verify(accessToken, config.auth.accessTokenSecret).email;
  try {
    const user = await db.getUser(email);
    if (!user) {
      console.error('Failed to get user');
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    delete user.refreshToken;
    delete user.githubAccessToken;

    return res.send(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
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
      const githubAccessToken = await getGithubAccessToken(data);
      try {
          const email = await getGithubUserEmail(githubAccessToken);
          const {name, avatarUrl} = await getGithubUserInfo(githubAccessToken);

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