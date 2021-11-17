const db = require('.');
const DbError = require('../errors/DbError');
const DbConflictError = require('../errors/DbConflictError');
const DbNotFoundError = require('../errors/DbNotFoundError');

const courseTable = 'course';

const mapDbCourse = course => ({
  id: course.id,
  name: course.name,
  description: course.description,
  githubName: course.github_name,
  creatorEmail: course.creator_email,
  createdOn: course.created_on,
  lastEditedOn: course.last_edited_on
});

const createCourse = async course => {
  const query = `INSERT INTO ${courseTable} (id, name, description, github_name, creator_email, created_on, last_edited_on)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *`;
  const values = [
    course.id,
    course.name,
    course.description,
    course.githubName,
    course.creatorEmail,
    course.createdOn,
    course.lastEditedOn
  ];

  try {
    const result = await db.query(query, values);
    return mapDbCourse(result.rows[0]);
  } catch (error) {
    const errorMessage = `failed to create course with id '${course.id}' in the database: ${error.message}`;
    if (db.isConflictError(error)) {
      throw new DbConflictError(errorMessage);
    }
    throw new DbError(errorMessage);
  }
};

const getCourses = async email => {
  const query = `SELECT * FROM ${courseTable} WHERE creator_email=$1`;
  const values = [email];

  try {
    const result = await db.query(query, values);
    return result.rows.map(row => mapDbCourse(row));
  } catch (error) {
    const errorMessage = `failed to find courses with creator '${email}' in the database: ${error.message}`;
    throw new DbError(errorMessage);
  }
};

const getCourse = async (id, email) => {
  const query = `SELECT * FROM ${courseTable} WHERE id=$1 AND creator_email=$2`;
  const values = [id, email];

  let result;
  try {
    result = await db.query(query, values);
  } catch (error) {
    const errorMessage = `failed to find course with id '${id}' and creator '${email}' in the database: ${error.message}`;
    throw new DbError(errorMessage);
  }

  if (result.rowCount === 0) {
    throw new DbNotFoundError(`failed to find course with id '${id}' and creator '${email}' in the database`);
  }

  return mapDbCourse(result.rows[0]);
};

module.exports = {
  createCourse,
  getCourses,
  getCourse
};
