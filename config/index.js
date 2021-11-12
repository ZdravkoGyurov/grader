require('dotenv').config();

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
    logLevel: process.env.LOG_LEVEL
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    poolSize: process.env.DB_POOL_SIZE,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MS,
    query_timeout: process.env.DB_QUERY_TIMEOUT_MS,
    connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT_MS,
    statement_timeout: process.env.DB_STATEMENT_TIMEOUT_MS,
    idle_in_transaction_session_timeout:
      process.env.DB_IDLE_IN_TRANSACTION_SESSION_TIMEOUT_MS
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    requiredScope: process.env.GITHUB_REQUIRED_SCOPE
  },
  auth: {
    accessTokenCookieName: process.env.ACCESS_TOKEN_COOKIE_NAME,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpirationTime: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpirationTime: process.env.REFRESH_TOKEN_EXPIRATION_TIME
  }
};

module.exports = config;
