const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { body, param, validationResult } = require('express-validator');
const { ApiError, apiError } = require('../../errors/ApiError');
const courseService = require('../../services/course');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const role = require('../../auth');

const courseRouter = new Router();

const validationErrorMessage = validationErrors =>
  validationErrors
    .array()
    .map(e => `${e.msg} [${e.param}]`)
    .join(', ');

courseRouter.post(
  '/',
  authentication,
  authorization(role.TEACHER),
  body('name').notEmpty(),
  body('description').notEmpty(),
  body('githubName').notEmpty(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errorMessage = validationErrorMessage(validationErrors);
      const err = new ApiError(req, errorMessage, StatusCodes.BAD_REQUEST);
      return res.status(err.code).send(err);
    }

    let course = {
      name: req.body.name,
      description: req.body.description,
      githubName: req.body.githubName,
      creatorEmail: req.user.email
    };

    try {
      course = await courseService.createCourse(course);
      return res.send(course);
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

courseRouter.get('/:id', authentication, authorization(role.STUDENT), param('id').isUUID(), async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errorMessage = validationErrorMessage(validationErrors);
    const err = new ApiError(req, errorMessage, StatusCodes.BAD_REQUEST);
    return res.status(err.code).send(err);
  }

  try {
    const course = await courseService.getCourse(req.params.id, req.user.email);
    return res.send(course);
  } catch (error) {
    const err = apiError(req, error);
    return res.status(err.code).send(err);
  }
});

// courseRouter.patch('/:id', async (req, res) => {
//   const courseId = req.params.id;
// });

// courseRouter.delete('/:id', async (req, res) => {
//   const courseId = req.params.id;
// });

module.exports = courseRouter;
