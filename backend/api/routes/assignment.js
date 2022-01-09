const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { body, param, query } = require('express-validator');
const { apiError } = require('../../errors/ApiError');
const assignmentService = require('../../services/assignment');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const validation = require('../middlewares/validation');
const { role } = require('../../consts');
const paths = require('../paths');

const assignmentRouter = new Router();

assignmentRouter.post(
  '/',
  authentication,
  authorization(role.TEACHER),
  body('name', 'should be min 1 and max 36 characters').notEmpty().isLength({ max: 36 }),
  body('description', 'should be min 1 and max 256 characters').notEmpty().isLength({ max: 255 }),
  body('githubName', 'should not be empty').notEmpty(),
  body('courseId', 'should be non-empty UUID').notEmpty().isUUID(),
  validation,
  async (req, res) => {
    let assignment = {
      name: req.body.name,
      description: req.body.description,
      githubName: req.body.githubName,
      authorEmail: req.user.email,
      courseId: req.body.courseId
    };

    try {
      assignment = await assignmentService.createAssignment(assignment);
      return res.status(StatusCodes.CREATED).location(`${paths.assignment}/${assignment.id}`).json(assignment);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

assignmentRouter.get(
  '/',
  authentication,
  authorization(role.STUDENT),
  query('courseId', 'should be UUID').isUUID(),
  validation,
  async (req, res) => {
    try {
      const assignments = await assignmentService.getAssignments(req.user.email, req.query.courseId);
      return res.send(assignments);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

assignmentRouter.get(
  '/:id',
  authentication,
  authorization(role.STUDENT),
  param('id', 'should be UUID').isUUID(),
  validation,
  async (req, res) => {
    try {
      const assignment = await assignmentService.getAssignment(req.params.id, req.user.email);
      return res.send(assignment);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

assignmentRouter.patch(
  '/:id',
  authentication,
  authorization(role.TEACHER),
  param('id', 'should be UUID').isUUID(),
  body('name', 'should be max 36 characters').optional().isLength({ max: 36 }),
  body('description', 'should be max 25 characters').optional().isLength({ max: 255 }),
  validation,
  async (req, res) => {
    let assignment = {
      id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      authorEmail: req.user.email
    };

    try {
      assignment = await assignmentService.updateAssignment(assignment);
      return res.send(assignment);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

assignmentRouter.delete(
  '/:id',
  authentication,
  authorization(role.TEACHER),
  param('id', 'should be UUID').isUUID(),
  validation,
  async (req, res) => {
    try {
      await assignmentService.deleteAssignment(req.params.id, req.user.email);
      return res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

module.exports = assignmentRouter;
