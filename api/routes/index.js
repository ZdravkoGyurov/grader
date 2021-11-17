const { Router } = require('express');
const paths = require('../paths');

const authRouter = require('./auth');
const courseRouter = require('./course');

const router = new Router();
router.use(paths.api, authRouter);
router.use(paths.course, courseRouter);

module.exports = router;
