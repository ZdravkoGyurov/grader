const { Router } = require('express');
const paths = require('../paths');
const assignmentRouter = require('./assignment');

const authRouter = require('./auth');
const courseRouter = require('./course');

const router = new Router();
router.use(paths.api, authRouter);
router.use(paths.course, courseRouter);
router.use(paths.assignment, assignmentRouter);

module.exports = router;
