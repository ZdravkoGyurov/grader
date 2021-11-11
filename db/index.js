const { Pool } = require('pg');
const config = require('../config')

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  max: config.db.poolSize
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

module.exports = { query, transcation }