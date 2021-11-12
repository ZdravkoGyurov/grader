const request = require('request');
const jwt = require('jsonwebtoken');
const config = require('../config');
const JwtVerifyError = require('../errors/JwtVerifyError');

const db = require('../db/user')

const githubTokenUrl  = 'https://github.com/login/oauth/access_token'
const githubUserEndpoint = 'https://api.github.com/user'
const githubUserEmailsEndpoint = 'https://api.github.com/user/emails'

const generateAccessToken = (refreshToken) => {
  try {
    // check if token exists in db
    const email = jwt.verify(refreshToken, config.auth.refreshTokenSecret).email;
    const accessToken = jwt.sign({ email: email }, config.auth.accessTokenSecret);
    return { email, accessToken };
  } catch (error) {
    throw new JwtVerifyError(`failed to verify access token: ${error.message}`);
  }
}

const getUserInfo = async (accessToken) => {
  let email;
  try {
    email = jwt.verify(accessToken, config.auth.accessTokenSecret).email;
  } catch (error) {
    throw new JwtVerifyError(`failed to verify access token: ${error.message}`);
  }

  const user = await db.getUser(email);

  delete user.refreshToken;
  delete user.githubAccessToken;

  return user;
}

const getGithubAccessToken = (data) => {
  return new Promise((resolve, reject) => {
    request.post(githubTokenUrl, { json: data }, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (response.statusCode != 200) {
        return reject(body);
      }

      return resolve(body.access_token);
    });
  });
}

const getGithubUserInfo = (accessToken) => {
  return new Promise((resolve, reject) => {
    request.get(githubUserEndpoint, githubReqOptions(accessToken), (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (response.statusCode != 200) {
        return reject(body);
      }

      const bodyJson = JSON.parse(body);
      return resolve({name: bodyJson.login, avatarUrl: bodyJson.avatar_url})
    });
  });
}

const getGithubUserEmail = (accessToken) => {
  return new Promise((resolve, reject) => {
    request.get(githubUserEmailsEndpoint, githubReqOptions(accessToken), (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (response.statusCode != 200) {
        return reject(body);
      }

      const bodyJson = JSON.parse(body);
      const primaryEmail = bodyJson.filter( email => email.primary === true);
      const email = primaryEmail && primaryEmail[0].email;
      return resolve(email);
    });
  });
}

const githubReqOptions = (accessToken) => {
  return { headers: { 'Authorization': `Bearer ${accessToken}`, "User-Agent": 'node.js' } };
}

module.exports = { generateAccessToken, getUserInfo, getGithubAccessToken, getGithubUserInfo, getGithubUserEmail }