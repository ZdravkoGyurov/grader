const db = require('.');
const DbError = require('../errors/DbError');
const DbConflictError = require('../errors/DbConflictError');
const DbNotFoundError = require('../errors/DbNotFoundError');
const { courseRole } = require('../consts');

const courseTable = 'course';
const userCourseTable = 'user_course';

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
  const createCourseQuery = `INSERT INTO ${courseTable} (id, name, description, github_name, creator_email, created_on, last_edited_on)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *`;
  const createCourseValues = [
    course.id,
    course.name,
    course.description,
    course.githubName,
    course.creatorEmail,
    course.createdOn,
    course.lastEditedOn
  ];

  const createUserCourseQuery = `INSERT INTO ${userCourseTable} (user_email, course_id, course_role_id)
  VALUES ($1, $2, ${courseRole.ASSISTANT})`;
  const createUserCourseValues = [course.creatorEmail, course.id];

  try {
    let result;
    await db.transcation(async client => {
      result = await client.query(createCourseQuery, createCourseValues);
      await client.query(createUserCourseQuery, createUserCourseValues);
    });
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
  const query = `SELECT * FROM ${courseTable} 
  WHERE id IN (SELECT course_id FROM ${userCourseTable} WHERE user_email=$1)`;
  const values = [email];

  try {
    const result = await db.query(query, values);
    return result.rows.map(row => mapDbCourse(row));
  } catch (error) {
    const errorMessage = `failed to find courses in the database: ${error.message}`;
    throw new DbError(errorMessage);
  }
};

const getCourse = async (id, email) => {
  const query = `SELECT * FROM ${courseTable} 
  WHERE id=$1 AND id IN (SELECT course_id FROM ${userCourseTable} WHERE user_email=$2)`;
  const values = [id, email];

  let result;
  try {
    result = await db.query(query, values);
  } catch (error) {
    const errorMessage = `failed to find course with id '${id}' in the database: ${error.message}`;
    throw new DbError(errorMessage);
  }

  if (result.rowCount === 0) {
    throw new DbNotFoundError(`failed to find course with id '${id}' in the database`);
  }

  return mapDbCourse(result.rows[0]);
};

const updateCourse = async course => {
  const query = `UPDATE ${courseTable}
  SET name=COALESCE($1, name), description=COALESCE($2, description), last_edited_on=$3
  WHERE id=$4 AND creator_email=$5
  RETURNING *`;
  const values = [course.name, course.description, course.lastEditedOn, course.id, course.creatorEmail];

  let result;
  try {
    result = await db.query(query, values);
  } catch (error) {
    const errorMessage = `failed to update course with id '${course.id}' and creator '${course.creatorEmail}' in the database: ${error.message}`;
    if (db.isConflictError(error)) {
      throw new DbConflictError(errorMessage);
    }
    throw new DbError(errorMessage);
  }

  if (result.rowCount === 0) {
    throw new DbNotFoundError(
      `failed to find course with id '${course.id}' and creator '${course.creatorEmail}' in the database`
    );
  }

  return mapDbCourse(result.rows[0]);
};

const deleteCourse = async (id, email) => {
  const query = `DELETE FROM ${courseTable} WHERE id=$1 AND creator_email=$2`;
  const values = [id, email];

  try {
    await db.query(query, values);
    return;
  } catch (error) {
    const errorMessage = `failed to delete course with id '${id}' and creator '${email}' from the database: ${error.message}`;
    throw new DbError(errorMessage);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse
};
