const db = require('.');
const DbError = require('../errors/DbError');
const DbConflictError = require('../errors/DbConflictError');
const DbNotFoundError = require('../errors/DbNotFoundError');

const assignmentTable = 'assignment';
const userCourseTable = 'user_course';

const mapDbAssignment = assignment => ({
  id: assignment.id,
  name: assignment.name,
  description: assignment.description,
  authorEmail: assignment.author_email,
  githubName: assignment.github_name,
  courseId: assignment.course_id,
  createdOn: assignment.created_on,
  lastEditedOn: assignment.last_edited_on
});

const createAssignment = async assignment => {
  const query = `INSERT INTO ${assignmentTable} (id, name, description, author_email, course_id, github_name, created_on, last_edited_on)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *`;
  const values = [
    assignment.id,
    assignment.name,
    assignment.description,
    assignment.authorEmail,
    assignment.courseId,
    assignment.githubName,
    assignment.createdOn,
    assignment.lastEditedOn
  ];

  try {
    const result = await db.query(query, values);
    return mapDbAssignment(result.rows[0]);
  } catch (error) {
    const errorMessage = `failed to create assignment with id '${assignment.id}' in the database: ${error.message}`;
    if (db.isConflictError(error)) {
      throw new DbConflictError(errorMessage);
    }
    throw new DbError(errorMessage);
  }
};

const getAssignments = async (email, courseId) => {
  let query;
  let values;
  if (courseId) {
    query = `SELECT * FROM ${assignmentTable} 
    WHERE course_id=$2 AND course_id IN (SELECT course_id FROM ${userCourseTable} WHERE user_email=$1)`;
    values = [email, courseId];
  } else {
    query = `SELECT * FROM ${assignmentTable} 
    WHERE course_id IN (SELECT course_id FROM ${userCourseTable} WHERE user_email=$1)`;
    values = [email];
  }

  try {
    const result = await db.query(query, values);
    return result.rows.map(row => mapDbAssignment(row));
  } catch (error) {
    const errorMessage = `failed to find assignments with author '${email}' ${
      courseId ? `and courseId ${courseId}` : ''
    } in the database: ${error.message}`;
    throw new DbError(errorMessage);
  }
};

const getAssignment = async (id, email) => {
  const query = `SELECT * FROM ${assignmentTable}
  WHERE id=$1 AND course_id IN (SELECT course_id FROM ${userCourseTable} WHERE user_email=$2)`;
  const values = [id, email];

  let result;
  try {
    result = await db.query(query, values);
  } catch (error) {
    const errorMessage = `failed to find assignment with id '${id}' in the database: ${error.message}`;
    throw new DbError(errorMessage);
  }

  if (result.rowCount === 0) {
    throw new DbNotFoundError(`failed to find assignment with id '${id}' in the database`);
  }

  return mapDbAssignment(result.rows[0]);
};

const updateAssignment = async assignment => {
  const query = `UPDATE ${assignmentTable}
  SET name=COALESCE($1, name), description=COALESCE($2, description), last_edited_on=$3
  WHERE id=$4 AND author_email=$5
  RETURNING *`;
  const values = [
    assignment.name,
    assignment.description,
    assignment.lastEditedOn,
    assignment.id,
    assignment.authorEmail
  ];

  let result;
  try {
    result = await db.query(query, values);
  } catch (error) {
    const errorMessage = `failed to update assignment with id '${assignment.id}' and author '${assignment.authorEmail}' in the database: ${error.message}`;
    if (db.isConflictError(error)) {
      throw new DbConflictError(errorMessage);
    }
    throw new DbError(errorMessage);
  }

  if (result.rowCount === 0) {
    throw new DbNotFoundError(
      `failed to find assignment with id '${assignment.id}' and author '${assignment.authorEmail}' in the database`
    );
  }

  return mapDbAssignment(result.rows[0]);
};

const deleteAssignment = async (id, authorEmail) => {
  const query = `DELETE FROM ${assignmentTable} WHERE id=$1 AND author_email=$2`;
  const values = [id, authorEmail];

  try {
    await db.query(query, values);
    return;
  } catch (error) {
    const errorMessage = `failed to delete assignment with id '${id}' and authorEmail '${authorEmail}' from the database: ${error.message}`;
    throw new DbError(errorMessage);
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment
};
