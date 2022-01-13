const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { body, query } = require('express-validator');
const { apiError } = require('../../errors/ApiError');
const { role, courseRole } = require('../../consts');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const validation = require('../middlewares/validation');
const userCourseService = require('../../services/userCourse');

const userCourseRouter = Router();

userCourseRouter.post(
  '/',
  authentication,
  authorization(role.TEACHER),
  body('userEmail', 'should be non-empty email').notEmpty().isEmail(),
  body('courseId', 'should be non-empty UUID').notEmpty().isUUID(),
  body('courseRoleName', 'should be Assistant or Student').notEmpty().isIn(courseRole.ASSISTANT, courseRole.STUDENT),
  validation,
  async (req, res) => {
    let userCourseMapping = {
      userEmail: req.body.userEmail,
      courseId: req.body.courseId,
      courseRoleName: req.body.courseRoleName
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
  body('courseRoleName', 'should be Assistant or Student').notEmpty().isIn(courseRole.ASSISTANT, courseRole.STUDENT),
  validation,
  async (req, res) => {
    let userCourseMapping = {
      userEmail: req.body.userEmail,
      courseId: req.body.courseId,
      courseRoleName: req.body.courseRoleName
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
