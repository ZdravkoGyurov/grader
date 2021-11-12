const db = require('.');
const DbConflictError = require('../errors/DbConflictError');
const DbError = require('../errors/DbError');
const DbNotFoundError = require('../errors/DbNotFoundError');

const userInfoTable = 'user_info';

const mapDbUser = user => ({
  email: user.email,
  name: user.name,
  avatarUrl: user.avatar_url,
  refreshToken: user.refresh_token,
  githubAccessToken: user.github_access_token,
  roleId: user.role_id
});

const getUser = async email => {
  const query = `SELECT * FROM ${userInfoTable} WHERE email = $1`;
  const values = [email];

  let result;
  try {
    result = await db.query(query, values);
  } catch (error) {
    throw new DbError(
      `failed to find user with email '${email}' find the database: ${error.message}`
    );
  }

  if (result.rowCount === 0) {
    throw new DbNotFoundError(
      `failed to find user with email '${email}' in the database`
    );
  }

  return mapDbUser(result.rows[0]);
};

const createUser = async user => {
  const query = `INSERT INTO ${userInfoTable} (email, name, avatar_url, refresh_token, github_access_token, role_id)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *`;
  const values = [
    user.email,
    user.name,
    user.avatarUrl,
    user.refreshToken,
    user.githubAccessToken,
    1
  ];

  let result;
  try {
    result = await db.query(query, values);
  } catch (error) {
    const errorMessage = `failed to create user with email '${user.email}' in the database: ${error.message}`;
    if (db.isConflictError(error)) {
      throw new DbConflictError(errorMessage);
    }
    throw new DbError(errorMessage);
  }

  return mapDbUser(result.rows[0]);
};

const setUserRefreshToken = async (email, refreshToken) => {
  const query = `UPDATE ${userInfoTable} SET refresh_token = $1 WHERE email = $2;`;
  const values = [refreshToken, email];

  let result;
  try {
    result = await db.query(query, values);
  } catch (error) {
    throw new DbError(
      `failed to set refresh_token for user with email '${email}' in the database: ${error.message}`
    );
  }

  if (result.rowCount === 0) {
    throw new DbNotFoundError(`failed to find user with email '${email}'`);
  }
};

module.exports = {
  getUser,
  createUser,
  setUserRefreshToken
};
