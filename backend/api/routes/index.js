const { Router } = require('express');
const paths = require('../paths');
const authRouter = require('./auth');
const courseRouter = require('./course');
const assignmentRouter = require('./assignment');
const submissionRouter = require('./submission');
const { userCourseRouter } = require('./userCourse');

const router = new Router();
router.use(paths.api, authRouter);
router.use(paths.course, courseRouter);
router.use(paths.assignment, assignmentRouter);
router.use(paths.submission, submissionRouter);
router.use(paths.userCourse, userCourseRouter);

module.exports = router;
