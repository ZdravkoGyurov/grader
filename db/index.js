const { Pool } = require('pg');
const config = require('../config')

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  max: config.db.poolSize,
  idleTimeoutMillis: config.db.idleTimeoutMillis,
  query_timeout: config.db.query_timeout,
  connectionTimeoutMillis: config.db.connectionTimeoutMillis,
  statement_timeout: config.db.statement_timeout,
  idle_in_transaction_session_timeout: config.db.idle_in_transaction_session_timeout,
});

const query = async (text, params) => {
  return await pool.query(text, params);
}

const transcation = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    callback(client)
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

const isConflictError = (error) => {
  if (error instanceof DatabaseError) {
    if (error.code == 23503 || error.code == 23505) {
      return true;
    }
  }
  return false;
}

module.exports = { query, transcation, isConflictError }