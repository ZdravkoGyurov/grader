const request = require('request');

const githubTokenUrl  = 'https://github.com/login/oauth/access_token'
const githubUserEndpoint = 'https://api.github.com/user'
const githubUserEmailsEndpoint = 'https://api.github.com/user/emails'

const fetchAccessToken = (data) => {
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

const fetchUserInfo = (accessToken) => {
  return new Promise((resolve, reject) => {
    request.get(githubUserEndpoint, reqOptions(accessToken), (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (response.statusCode != 200) {
        return reject(body);
      }

      const bodyJson = JSON.parse(body);
      return resolve({ name: bodyJson.login, avatarUrl: bodyJson.avatar_url })
    });
  });
}

const fetchUserEmail = (accessToken) => {
  return new Promise((resolve, reject) => {
    request.get(githubUserEmailsEndpoint, reqOptions(accessToken), (error, response, body) => {
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

const reqOptions = (accessToken) => {
  return { headers: { 'Authorization': `Bearer ${accessToken}`, "User-Agent": 'node.js' } };
}

module.exports = {
  fetchAccessToken,
  fetchUserInfo,
  fetchUserEmail
}
