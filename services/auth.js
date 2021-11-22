const jwt = require('jsonwebtoken');
const config = require('../config');
const JwtVerifyError = require('../errors/JwtVerifyError');
const db = require('../db/user');
const OutboundRequestFailedError = require('../errors/OutboundRequestFailedError');
const DbNotFoundError = require('../errors/DbNotFoundError');
const github = require('./outbound/github');
const InvalidRefreshTokenError = require('../errors/InvalidRefreshTokenError');

const redirectUri = `http://${config.app.host}:${config.app.port}/login/oauth/github/callback`;

const createAccessToken = email => {
  const payload = { email };
  const options = { expiresIn: config.auth.accessTokenExpirationTime };
  return jwt.sign(payload, config.auth.accessTokenSecret, options);
};

const createRefreshToken = email => {
  const payload = { email };
  const options = { expiresIn: config.auth.refreshTokenExpirationTime };
  return jwt.sign(payload, config.auth.refreshTokenSecret, options);
};

const fetchUserInfo = async githubAccessToken => {
  try {
    return await github.fetchUserInfo(githubAccessToken);
  } catch (error) {
    throw new OutboundRequestFailedError(`failed to get user name and avatarUrl from Github: ${error.message}`);
  }
};

const fetchGithubEmail = async githubAccessToken => {
  try {
    return await github.fetchUserEmail(githubAccessToken);
  } catch (error) {
    throw new OutboundRequestFailedError(`failed to get user email from Github: ${error.message}`);
  }
};

const fetchGithubAccessToken = async code => {
  const exchangeCodeData = {
    client_id: config.github.clientId,
    client_secret: config.github.clientSecret,
    code,
    redirect_uri: redirectUri
  };
  try {
    return await github.fetchAccessToken(exchangeCodeData);
  } catch (error) {
    throw new OutboundRequestFailedError(`failed to exchange code for access token: ${error.message}`);
  }
};

const generateAccessToken = async refreshToken => {
  let email;
  try {
    email = jwt.verify(refreshToken, config.auth.refreshTokenSecret).email;
  } catch (error) {
    throw new JwtVerifyError(`failed to verify refresh token: ${error.message}`);
  }

  let user;
  try {
    user = await db.getUser(email);
  } catch (error) {
    throw new Error(`failed to generate access token: ${error.message}`);
  }

  if (user.refreshToken !== refreshToken) {
    throw new InvalidRefreshTokenError(`refresh token is invalid`);
  }

  const accessToken = createAccessToken(email);
  return { email, accessToken };
};

const extractEmail = accessToken => {
  try {
    return jwt.verify(accessToken, config.auth.accessTokenSecret).email;
  } catch (error) {
    throw new JwtVerifyError(`failed to verify access token: ${error.message}`);
  }
};

const getUserInfo = async accessToken => {
  const email = extractEmail(accessToken);

  const user = await db.getUser(email);
  delete user.refreshToken;
  delete user.githubAccessToken;

  return user;
};

const updateAssignment = user => db.updateUserRole(user);

const getUser = email => db.getUser(email);

const deleteUserRefreshToken = async accessToken => {
  const email = extractEmail(accessToken);
  await db.setUserRefreshToken(email, null);
};

const login = async code => {
  const githubAccessToken = await fetchGithubAccessToken(code);

  const email = await fetchGithubEmail(githubAccessToken);
  const { name, avatarUrl } = await fetchUserInfo(githubAccessToken);

  let user;
  try {
    user = await db.getUser(email);
  } catch (error) {
    if (!(error instanceof DbNotFoundError)) {
      throw error;
    }

    const userRefreshToken = createRefreshToken(email);
    user = {
      email,
      name,
      avatarUrl,
      refreshToken: userRefreshToken,
      githubAccessToken
    };
    user = await db.createUser(user);
  }

  if (!user.refreshToken) {
    user.refreshToken = createRefreshToken(email);
    await db.setUserRefreshToken(user.email, user.refreshToken);
  }

  return {
    user: {
      email,
      name,
      avatarUrl,
      roleId: user.roleId
    },
    tokens: {
      userAccessToken: createAccessToken(email),
      userRefreshToken: user.refreshToken
    }
  };
};

module.exports = {
  generateAccessToken,
  getUserInfo,
  updateAssignment,
  getUser,
  deleteUserRefreshToken,
  login
};
