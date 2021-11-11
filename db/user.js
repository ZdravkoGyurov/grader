const db = require('.');

const userInfoTable = 'user_info'

module.exports = {
    async getUser(email) {
        try {
          const query = `SELECT * FROM ${userInfoTable} WHERE email = $1`;
          const values = [email];
          const result = await db.query(query, values);
          return result.rowCount !== 0 ? mapDbUser(result.rows[0]) : null;
        } catch (error) {
          throw new Error(`Failed to get user with email '${email}' from the database: ${error}`);
        }
    },

    async createUser(user) {
        try {
            const query = `INSERT INTO ${userInfoTable} (email, name, avatar_url, refresh_token, github_access_token, role_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`;
            const values = [user.email, user.name, user.avatarUrl, user.refreshToken, user.githubAccessToken, 1];
            const result = await db.query(query, values);
            return result.rowCount !== 0 ? mapDbUser(result.rows[0]) : null;
        } catch (error) {
            throw new Error(`Failed to create user with email '${user.email}' in the database: ${error}`);
        }
    },

    async setUserRefreshToken(email, refreshToken) {
        try {
            const query = `UPDATE ${userInfoTable} SET refresh_token = $1 WHERE email = $2;`;
            const values = [refreshToken, email];
            const result = await db.query(query, values);
        } catch (error) {
            throw new Error(`Failed to set user refresh_token with email '${email}' in the database: ${error}`);
        }
    }
}

const mapDbUser = (user) => {
    return {
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        refreshToken: user.refresh_token,
        githubAccessToken: user.github_access_token,
        roleId: user.role_id
    }
}