const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { body, query } = require('express-validator');
const { apiError } = require('../../errors/ApiError');
const { role } = require('../../consts');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const validation = require('../middlewares/validation');
const userCourseService = require('../../services/userCourse');

const userCourseRouter = new Router();

userCourseRouter.post(
  '/',
  authentication,
  authorization(role.TEACHER),
  body('userEmail', 'should be non-empty email').notEmpty().isEmail(),
  body('courseId', 'should be non-empty UUID').notEmpty().isUUID(),
  body('courseRoleId', 'should be integer min 1 max 2').notEmpty().isInt({ min: 1, max: 2 }),
  validation,
  async (req, res) => {
    let userCourseMapping = {
      userEmail: req.body.userEmail,
      courseId: req.body.courseId,
      courseRoleId: req.body.courseRoleId
    };

    try {
      userCourseMapping = await userCourseService.createUserCourseMapping(req.user.email, userCourseMapping);
      return res.status(StatusCodes.CREATED).json(userCourseMapping);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

userCourseRouter.put(
  '/',
  authentication,
  authorization(role.TEACHER),
  body('userEmail', 'should be non-empty email').notEmpty().isEmail(),
  body('courseId', 'should be non-empty UUID').notEmpty().isUUID(),
  body('courseRoleId', 'should be integer min 1 ma]x 2').notEmpty().isInt({ min: 1, max: 2 }),
  validation,
  async (req, res) => {
    let userCourseMapping = {
      userEmail: req.body.userEmail,
      courseId: req.body.courseId,
      courseRoleId: req.body.courseRoleId
    };

    try {
      userCourseMapping = await userCourseService.updateUserCourseMapping(userCourseMapping);
      return res.send(userCourseMapping);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

userCourseRouter.delete(
  '/',
  authentication,
  authorization(role.TEACHER),
  query('userEmail', 'should be non-empty email').notEmpty().isEmail(),
  query('courseId', 'should be non-empty UUID').notEmpty().isUUID(),
  validation,
  async (req, res) => {
    const userCourseMapping = {
      userEmail: req.query.userEmail,
      courseId: req.query.courseId
    };

    try {
      await userCourseService.deleteUserCourseMapping(userCourseMapping);
      return res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

module.exports = {
  userCourseRouter
};
