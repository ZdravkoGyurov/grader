const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { body, param, query } = require('express-validator');
const { apiError } = require('../../errors/ApiError');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const validation = require('../middlewares/validation');
const { submissionStatus } = require('../../consts');

const submissionRouter = new Router();

submissionRouter.post('/');

submissionRouter.get('/');

submissionRouter.get('/:id');

module.exports = submissionRouter;
