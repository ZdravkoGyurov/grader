const { createLogger, format, transports } = require('winston');

const config = require('../config');

const winstonLogger = createLogger({
  level: config.app.logLevel,
  format: format.json(),
  transports: [new transports.Console()]
});

const requestLogger = {
  requestId: '',

  log(level, message) {
    const logEntry = { level, message };
    if (this.requestId !== '') {
      logEntry.requestId = this.requestId;
    }
    winstonLogger.log(logEntry);
  },

  info(message) {
    this.log('info', message);
  },

  warn(message) {
    this.log('warn', message);
  },

  error(message) {
    this.log('error', message);
  }
};

const logger = req => {
  const requestId = req && req.id ? req.id : '';
  requestLogger.requestId = requestId;

  return requestLogger;
};

module.exports = logger;
