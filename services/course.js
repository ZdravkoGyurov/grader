const uuid = require('uuid');
const db = require('../db/course');

const createCourse = course => {
  const c = course;
  c.id = uuid.v4();
  c.createdOn = new Date();
  c.lastEditedOn = new Date();
  return db.createCourse(c);
};

const getCourses = email => db.getCourses(email);

const getCourse = (id, email) => db.getCourse(id, email);

module.exports = {
  createCourse,
  getCourses,
  getCourse
};
