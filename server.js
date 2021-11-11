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
  morgan.token('id', req => { return req.id })
  app.use(morgan(':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
  app.use(cookieParser());
  
  app.use('/', router);

  app.listen(config.app.port, config.app.host, () => {
    console.log(`listening on ${config.app.host}:${config.app.port}`);
  });
};

startApplication();