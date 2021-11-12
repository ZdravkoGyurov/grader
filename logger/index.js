const { createLogger, format, transports } = require('winston');

const config = require('../config');

const winstonLogger = createLogger({
  level: config.app.logLevel,
  format: format.json(),
  transports: [new transports.Console()]
});

const requestLogger = {
  _requestId: '',

  _log: function (level, message) {
    winstonLogger.log({
      level: level,
      message: message,
      requestId: this._requestId
    });
  },

  info: function (message) {
    this._log('info', message);
  },

  warn: function (message) {
    this._log('warn', message);
  },

  error: function (message) {
    this._log('error', message);
  }
};

const logger = req => {
  const requestId = req && req.id ? req.id : '';
  requestLogger._requestId = requestId;

  return requestLogger;
};

module.exports = logger;
