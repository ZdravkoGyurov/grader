const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { body, param } = require('express-validator');
const { apiError } = require('../../errors/ApiError');
const courseService = require('../../services/course');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const { role } = require('../../consts');
const paths = require('../paths');
const validation = require('../middlewares/validation');

const courseRouter = Router();

courseRouter.post(
  '/',
  authentication,
  authorization(role.TEACHER),
  body('name', 'should be min 1 and max 36 characters').notEmpty().isLength({ max: 36 }),
  body('description', 'should be min 1 and max 256 characters').notEmpty().isLength({ max: 255 }),
  body('githubName', 'should not be empty').notEmpty(),
  validation,
  async (req, res) => {
    let course = {
      name: req.body.name,
      description: req.body.description,
      githubName: req.body.githubName,
      creatorEmail: req.user.email
    };

    try {
      course = await courseService.createCourse(course);
      return res.status(StatusCodes.CREATED).location(`${paths.course}/${course.id}`).json(course);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

courseRouter.get('/', authentication, authorization(role.STUDENT), async (req, res) => {
  try {
    const courses = await courseService.getCourses(req.user.email);
    return res.send(courses);
  } catch (error) {
    const err = apiError(req, error);
    return res.status(err.code).send(err);
  }
});

courseRouter.get(
  '/:id',
  authentication,
  authorization(role.STUDENT),
  param('id', 'should be UUID').isUUID(),
  validation,
  async (req, res) => {
    try {
      const course = await courseService.getCourse(req.params.id, req.user.email);
      return res.send(course);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

courseRouter.patch(
  '/:id',
  authentication,
  authorization(role.TEACHER),
  param('id', 'should be UUID').isUUID(),
  body('name', 'should be max 36 characters').optional().isLength({ max: 36 }),
  body('description', 'should be max 25 characters').optional().isLength({ max: 255 }),
  validation,
  async (req, res) => {
    let course = {
      id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      creatorEmail: req.user.email
    };

    try {
      course = await courseService.updateCourse(course);
      return res.send(course);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

courseRouter.delete(
  '/:id',
  authentication,
  authorization(role.TEACHER),
  param('id', 'should be UUID').isUUID(),
  validation,
  async (req, res) => {
    try {
      await courseService.deleteCourse(req.params.id, req.user.email);
      return res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

module.exports = courseRouter;
