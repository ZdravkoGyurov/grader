const uuid = require('uuid');
const db = require('../db/submission');
const { submissionStatus } = require('../consts');
const { createJobRun } = require('./outbound/jobExecutor');

const createSubmission = submission => {
  const s = submission;
  s.id = uuid.v4();
  s.result = '{}';
  s.submissionStatusName = submissionStatus.PENDING;
  return db.createSubmission(submission);
};

const createSubmissionJob = submissionId => createJobRun(submissionId);

const getSubmissions = (email, assignmentId) => db.getSubmissions(email, assignmentId);

const getSubmission = (id, email) => db.getSubmission(id, email);

module.exports = {
  createSubmission,
  createSubmissionJob,
  getSubmissions,
  getSubmission
};
