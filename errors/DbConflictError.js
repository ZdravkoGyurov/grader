class DbConflictError extends Error {
  constructor(message, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.message = message;
  }
}

module.exports = DbConflictError;