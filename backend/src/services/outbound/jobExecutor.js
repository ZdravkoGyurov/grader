const { StatusCodes } = require('http-status-codes');
const request = require('request');
const config = require('../../config');

const createJobRun = submissionId =>
  new Promise((resolve, reject) => {
    request.post(config.jobExecutor.url, { json: { submissionId } }, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (response.statusCode !== StatusCodes.ACCEPTED) {
        return reject(body);
      }

      return resolve();
    });
  });

module.exports = {
  createJobRun
};
