const db = require('../db/userCourse');

const createUserCourseMapping = (email, userCourseMapping) => db.createUserCourseMapping(email, userCourseMapping);

const updateUserCourseMapping = userCourseMapping => db.updateUserCourseMapping(userCourseMapping);

const deleteUserCourseMapping = userCourseMapping => db.deleteUserCourseMapping(userCourseMapping);

module.exports = {
  createUserCourseMapping,
  updateUserCourseMapping,
  deleteUserCourseMapping
};
