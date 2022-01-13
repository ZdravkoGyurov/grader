const db = require('.');
const DbError = require('../errors/DbError');
const DbConflictError = require('../errors/DbConflictError');
const DbNotFoundError = require('../errors/DbNotFoundError');
const { courseRole } = require('../consts');

const assignmentTable = 'assignment';
const submissionTable = 'submission';
const userCourseTable = 'user_course';

const mapDbSubmission = submission => ({
  id: submission.id,
  result: submission.result,
  submissionStatusName: submission.submission_status_name,
  submitterEmail: submission.submitter_email,
  assignmentId: submission.assignment_id
});

const createSubmission = async submission => {
  const userCourseQuery = `SELECT * FROM ${userCourseTable} WHERE user_email=$1 AND course_id=(SELECT course_id FROM ${assignmentTable} WHERE id=$2)`;
  const userCourseValues = [submission.submitterEmail, submission.assignmentId];

  const createSubmissionQuery = `INSERT INTO ${submissionTable} (id, result, submission_status_name, submitter_email, assignment_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *`;
  const createSubmissionValues = [
    submission.id,
    '{}',
    submission.submissionStatusName,
    submission.submitterEmail,
    submission.assignmentId
  ];

  try {
    let result;
    await db.transcation(async client => {
      result = await client.query(userCourseQuery, userCourseValues);
      if (result.rowCount === 0) {
        throw new Error('user is not in the course');
      }
      result = await db.query(createSubmissionQuery, createSubmissionValues);
    });
    return mapDbSubmission(result.rows[0]);
  } catch (error) {
    const errorMessage = `failed to create submission for assignment with id '${submission.assignmentId}' in the database: ${error.message}`;
    if (db.isConflictError(error)) {
      throw new DbConflictError(errorMessage);
    }
    throw new DbError(errorMessage);
  }
};

const getSubmissions = async (email, assignmentId) => {
  const query = `SELECT * FROM ${submissionTable}
  WHERE assignment_id=$1 AND (submitter_email=$2 OR assignment_id IN (SELECT id FROM ${assignmentTable}
                         WHERE course_id IN (SELECT course_id FROM ${userCourseTable} WHERE user_email=$2)))`;
  const values = [assignmentId, email];

  try {
    const result = await db.query(query, values);
    return result.rows.map(row => mapDbSubmission(row));
  } catch (error) {
    const errorMessage = `failed to find submission for assignment '${assignmentId}' with submitter '${email}' in the database: ${error.message}`;
    throw new DbError(errorMessage);
  }
};

const getSubmission = async (id, email) => {
  const query = `SELECT * FROM ${submissionTable}
  WHERE id=$1 AND (submitter_email=$2 OR assignment_id IN (SELECT id FROM ${assignmentTable}
                       WHERE course_id IN (SELECT course_id FROM ${userCourseTable} WHERE user_email=$2 AND course_role_name='${courseRole.ASSISTANT}')))`;
  const values = [id, email];

  let result;
  try {
    result = await db.query(query, values);
  } catch (error) {
    const errorMessage = `failed to find submission with id '${id}' in the database: ${error.message}`;
    throw new DbError(errorMessage);
  }

  if (result.rowCount === 0) {
    throw new DbNotFoundError(`failed to find submission with id '${id}' in the database`);
  }

  return mapDbSubmission(result.rows[0]);
};

const updateSubmission = () => {};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission
};
