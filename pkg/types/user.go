package types

type User struct {
	Email             string `json:"email"`
	Name              string `json:"name"`
	AvatarURL         string `json:"avatarUrl"`
	RefreshToken      string `json:"refreshToken"`
	GithubAccessToken string `json:"githubAccessToken"`
	RoleName          Role   `json:"roleName"`
}

func (u User) Fields() []interface{} {
	return []interface{}{
		u.Email,
		u.Name,
		u.AvatarURL,
		u.RefreshToken,
		u.GithubAccessToken,
		u.RoleName,
	}
}
