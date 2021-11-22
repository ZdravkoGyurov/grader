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
  submissionStatusId: submission.submission_status_id,
  submitterEmail: submission.submitter_email,
  assignmentId: submission.assignment_id
});

const createSubmission = async submission => {
  const query = `INSERT INTO ${submissionTable} (id, result, submission_status_id, submitter_email, assignment_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *`;
  const values = [
    submission.id,
    '{}',
    submission.submissionStatusId,
    submission.submitterEmail,
    submission.assignmentId
  ];

  try {
    const result = await db.query(query, values);
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
                       WHERE course_id IN (SELECT course_id FROM ${userCourseTable} WHERE user_email=$2 AND course_role_id=${courseRole.ASSISTANT})))`;
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

// teacher can see all submissions for given assignment
// SELECT *
// FROM submission
// WHERE assignment_id=$1 AND assignment_id IN (SELECT id FROM assignment
//                        WHERE course_id IN (SELECT course_id FROM assistant_course
//                                            WHERE assistant_email=$2))

// teacher can see any submission by id
// SELECT *
// FROM submission
// WHERE id=$1 AND assignment_id IN (SELECT id FROM assignment
//                        WHERE course_id IN (SELECT course_id FROM assistant_course
//                                            WHERE assistant_email=$2))

// student can only see his submission by id
// SELECT *
// FROM submission
// WHERE id=$1 AND assignment_id IN (SELECT id FROM assignment
//                        WHERE course_id IN (SELECT course_id FROM user_course
//                                                         WHERE user_email=$2))

// student can only see his submissions for given assignment
// SELECT *
// FROM submission
// WHERE assignment_id=$1 AND assignment_id IN (SELECT id FROM assignment
//                        WHERE course_id IN (SELECT course_id FROM user_course
//                                                         WHERE user_email=$2))
