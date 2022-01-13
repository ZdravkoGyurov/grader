const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { body, query, param } = require('express-validator');
const { apiError } = require('../../errors/ApiError');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const validation = require('../middlewares/validation');
const { role } = require('../../consts');
const submissionService = require('../../services/submission');
const paths = require('../paths');

const submissionRouter = Router();

submissionRouter.post(
  '/',
  authentication,
  authorization(role.STUDENT),
  body('assignmentId', 'should be non-empty UUID').notEmpty().isUUID(),
  validation,
  async (req, res) => {
    let submission = {
      assignmentId: req.body.assignmentId,
      submitterEmail: req.user.email
    };

    try {
      submission = await submissionService.createSubmission(submission);
      await submissionService.createSubmissionJob(submission.id);
      return res.status(StatusCodes.ACCEPTED).location(`${paths.submission}/${submission.id}`).json();
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

submissionRouter.get(
  '/',
  authentication,
  authorization(role.STUDENT),
  query('assignmentId', 'should be non-empty UUID').notEmpty().isUUID(),
  validation,
  async (req, res) => {
    try {
      const submission = await submissionService.getSubmissions(req.user.email, req.query.assignmentId);
      return res.send(submission);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

submissionRouter.get(
  '/:id',
  authentication,
  authorization(role.STUDENT),
  param('id', 'should be UUID').isUUID(),
  validation,
  async (req, res) => {
    try {
      const submission = await submissionService.getSubmission(req.params.id, req.user.email);
      return res.send(submission);
    } catch (error) {
      const err = apiError(req, error);
      return res.status(err.code).send(err);
    }
  }
);

module.exports = submissionRouter;
