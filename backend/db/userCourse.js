const db = require('.');
const dbCourse = require('./course');
const DbError = require('../errors/DbError');
const DbConflictError = require('../errors/DbConflictError');
const DbNotFoundError = require('../errors/DbNotFoundError');

const userCourseTable = 'user_course';

const mapDbUserCourseMapping = userCourseMapping => ({
  userEmail: userCourseMapping.user_email,
  courseId: userCourseMapping.course_id,
  courseRoleName: userCourseMapping.course_role_name
});

const createUserCourseMapping = async (email, userCourseMapping) => {
  const query = `INSERT INTO ${userCourseTable} (user_email, course_id, course_role_name)
  VALUES ($1, $2, $3)
  RETURNING *`;
  const values = [userCourseMapping.userEmail, userCourseMapping.courseId, userCourseMapping.courseRoleId];

  let course;
  try {
    course = await dbCourse.getCourse(userCourseMapping.courseId, email);
  } catch (error) {
    const errorMessage = `failed to create userCourse mapping: ${error.message}`;
    throw new DbError(errorMessage);
  }

  if (course.creatorEmail !== email) {
    throw new DbError(`failed to create userCourse mapping, only course creators can create mappings`);
  }

  try {
    const result = await db.query(query, values);
    return mapDbUserCourseMapping(result.rows[0]);
  } catch (error) {
    const errorMessage = `failed to create userCourse mapping for user '${userCourseMapping.userEmail}' and course '${userCourseMapping.courseId}' in the database: ${error.message}`;
    if (db.isConflictError(error)) {
      throw new DbConflictError(errorMessage);
    }
    throw new DbError(errorMessage);
  }
};

const updateUserCourseMapping = async userCourseMapping => {
  const query = `UPDATE ${userCourseTable}
  SET course_role_name=$1
  WHERE user_email=$2 AND course_id=$3
  RETURNING *`;
  const values = [userCourseMapping.courseRoleId, userCourseMapping.userEmail, userCourseMapping.courseId];

  let result;
  try {
    result = await db.query(query, values);
  } catch (error) {
    throw new DbError(
      `failed to update userCourse mapping for user '${userCourseMapping.userEmail}' and course '${userCourseMapping.courseId}' in the database: ${error.message}`
    );
  }

  if (result.rowCount === 0) {
    throw new DbNotFoundError(
      `failed to find userCourse mapping for user '${userCourseMapping.userEmail}' and course '${userCourseMapping.courseId}' in the database`
    );
  }

  return mapDbUserCourseMapping(result.rows[0]);
};

const deleteUserCourseMapping = async userCourseMapping => {
  const query = `DELETE FROM ${userCourseTable} WHERE user_email=$1 AND course_id=$2`;
  const values = [userCourseMapping.userEmail, userCourseMapping.courseId];

  try {
    await db.query(query, values);
    return;
  } catch (error) {
    const errorMessage = `failed to delete userCourse mapping for user '${userCourseMapping.userEmail}' and course '${userCourseMapping.courseId}' in the database: ${error.message}`;
    throw new DbError(errorMessage);
  }
};

module.exports = {
  createUserCourseMapping,
  updateUserCourseMapping,
  deleteUserCourseMapping
};
