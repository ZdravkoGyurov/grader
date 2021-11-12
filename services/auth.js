const jwt = require('jsonwebtoken');
const config = require('../config');
const JwtVerifyError = require('../errors/JwtVerifyError');
const db = require('../db/user');
const OutboundRequestFailedError = require('../errors/OutboundRequestFailedError');
const DbNotFoundError = require('../errors/DbNotFoundError');
const github = require('./outbound/github');

const redirectUri = `http://${config.app.host}:${config.app.port}/login/oauth/github/callback`;

const generateAccessToken = refreshToken => {
  try {
    const email = jwt.verify(
      refreshToken,
      config.auth.refreshTokenSecret
    ).email;
    // check in db if user with email ${email} has refresh_token ${refreshToken}
    const accessToken = createAccessToken(email);
    return { email, accessToken };
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

const deleteUserRefreshToken = async accessToken => {
  const email = extractEmail(accessToken);
  await db.setUserRefreshToken(email, null);
};

const extractEmail = accessToken => {
  try {
    return jwt.verify(accessToken, config.auth.accessTokenSecret).email;
  } catch (error) {
    throw new JwtVerifyError(`failed to verify access token: ${error.message}`);
  }
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
      email: email,
      name: name,
      avatarUrl: avatarUrl,
      refreshToken: userRefreshToken,
      githubAccessToken: githubAccessToken
    };
    user = await db.createUser(user);
  }

  if (!user.refreshToken) {
    user.refreshToken = createRefreshToken(email);
    await db.setUserRefreshToken(user.email, user.refreshToken);
  }

  return {
    user: {
      email: email,
      name: name,
      avatarUrl: avatarUrl,
      roleId: user.roleId
    },
    tokens: {
      userAccessToken: createAccessToken(email),
      userRefreshToken: user.refreshToken
    }
  };
};

const createAccessToken = email => {
  const payload = { email: email };
  const options = { expiresIn: config.auth.accessTokenExpirationTime };
  return jwt.sign(payload, config.auth.accessTokenSecret, options);
};

const createRefreshToken = email => {
  const payload = { email: email };
  const options = { expiresIn: config.auth.refreshTokenExpirationTime };
  return jwt.sign(payload, config.auth.refreshTokenSecret, options);
};

const fetchUserInfo = async githubAccessToken => {
  try {
    return await github.fetchUserInfo(githubAccessToken);
  } catch (error) {
    throw new OutboundRequestFailedError(
      `failed to get user name and avatarUrl from Github: ${error.message}`
    );
  }
};

const fetchGithubEmail = async githubAccessToken => {
  try {
    return await github.fetchUserEmail(githubAccessToken);
  } catch (error) {
    throw new OutboundRequestFailedError(
      `failed to get user email from Github: ${error.message}`
    );
  }
};

const fetchGithubAccessToken = async code => {
  const exchangeCodeData = {
    client_id: config.github.clientId,
    client_secret: config.github.clientSecret,
    code: code,
    redirect_uri: redirectUri
  };
  try {
    return await github.fetchAccessToken(exchangeCodeData);
  } catch (error) {
    throw new OutboundRequestFailedError(
      `failed to exchange code for access token: ${error.message}`
    );
  }
};

module.exports = {
  generateAccessToken,
  getUserInfo,
  deleteUserRefreshToken,
  login
};
