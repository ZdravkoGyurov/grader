require('dotenv').config()

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    poolSize: process.env.DB_POOL_SIZE
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    requiredScope: process.env.GITHUB_REQUIRED_SCOPE,
  },
  auth: {
    accessTokenCookieName: process.env.ACCESS_TOKEN_COOKIE_NAME,
    refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
  }
}

module.exports = config;
