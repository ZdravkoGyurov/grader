const uuid = require('uuid');
const db = require('../db/submission');
const { submissionStatus } = require('../consts');

const createSubmission = submission => {
  const s = submission;
  s.id = uuid.v4();
  s.result = '{}';
  s.submissionStatusId = submissionStatus.PENDING;
  return db.createSubmission(submission);
};

const getSubmissions = (email, assignmentId) => db.getSubmissions(email, assignmentId);

const getSubmission = (id, email) => db.getSubmission(id, email);

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission
};
