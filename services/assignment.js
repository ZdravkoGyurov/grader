const uuid = require('uuid');
const db = require('../db/assignment');

const createAssignment = assignment => {
  const a = assignment;
  a.id = uuid.v4();
  a.createdOn = new Date();
  a.lastEditedOn = new Date();
  return db.createAssignment(a);
};

const getAssignments = (email, courseId) => db.getAssignments(email, courseId);

const getAssignment = (id, email) => db.getAssignment(id, email);

const deleteAssignment = (id, authorEmail) => db.deleteAssignment(id, authorEmail);

module.exports = {
  createAssignment,
  getAssignments,
  getAssignment,
  deleteAssignment
};
