const { StatusCodes } = require('http-status-codes');
const request = require('request');

const githubTokenUrl = 'https://github.com/login/oauth/access_token';
const githubUserEndpoint = 'https://api.github.com/user';
const githubUserEmailsEndpoint = 'https://api.github.com/user/emails';

const reqOptions = accessToken => ({
  headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'node.js' }
});

const fetchAccessToken = data =>
  new Promise((resolve, reject) => {
    request.post(githubTokenUrl, { json: data }, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (response.statusCode !== StatusCodes.OK) {
        return reject(body);
      }

      return resolve(body.access_token);
    });
  });

const fetchUserInfo = accessToken =>
  new Promise((resolve, reject) => {
    request.get(
      githubUserEndpoint,
      reqOptions(accessToken),
      (error, response, body) => {
        if (error) {
          return reject(error);
        }
        if (response.statusCode !== StatusCodes.OK) {
          return reject(body);
        }

        const bodyJson = JSON.parse(body);
        return resolve({
          name: bodyJson.login,
          avatarUrl: bodyJson.avatar_url
        });
      }
    );
  });

const fetchUserEmail = accessToken =>
  new Promise((resolve, reject) => {
    request.get(
      githubUserEmailsEndpoint,
      reqOptions(accessToken),
      (error, response, body) => {
        if (error) {
          return reject(error);
        }
        if (response.statusCode !== StatusCodes.OK) {
          return reject(body);
        }

        const bodyJson = JSON.parse(body);
        const primaryEmail = bodyJson.filter(email => email.primary === true);
        const email = primaryEmail && primaryEmail[0].email;
        return resolve(email);
      }
    );
  });

module.exports = {
  fetchAccessToken,
  fetchUserInfo,
  fetchUserEmail
};
