const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('./config');
const router = require('./api/routes');
const requestId = require('./api/middlewares/requestId');

const startApplication = async () => {
  const app = express();

  app.use(express.json());
  app.use(requestId);
  morgan.token('requestId', req => { return req.id })
  app.use(morgan(requestLoggerFormat()));
  app.use(cookieParser());
  
  app.use('/', router);

  app.listen(config.app.port, config.app.host, () => {
    console.log(`listening on ${config.app.host}:${config.app.port}`);
  });
};

const requestLoggerFormat = () => {
  const morganFormat = {
    requestId: ':requestId',
    remoteAddress: ':remote-addr',
    remoteUser: ':remote-user',
    date: '[:date[clf]]',
    method: ':method',
    url: ':url',
    httpVersion: 'HTTP/:http-version',
    status: ':status',
    contentLength: ':res[content-length]',
    referrer: ':referrer',
    userAgent: ':user-agent'
  };
  return JSON.stringify(morganFormat);
}

startApplication();