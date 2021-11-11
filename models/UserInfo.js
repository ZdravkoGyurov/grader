class UserInfo {

  constructor(email, name, avatar_url, refresh_token, github_access_token, role_id) {
    this.email = email;
    this.name = name;
    this.avatar_url = avatar_url;
    this.refresh_token = refresh_token;
    this.github_access_token = github_access_token;
    this.role_id = role_id;
  }

  static tableName() {
    return "user_info"
  }
}

module.exports = UserInfo;