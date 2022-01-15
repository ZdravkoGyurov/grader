package types

import "github.com/ZdravkoGyurov/grader/pkg/errors"

type User struct {
	Email             string `json:"email"`
	Name              string `json:"name"`
	AvatarURL         string `json:"avatarUrl"`
	RefreshToken      string `json:"refreshToken"`
	GithubAccessToken string `json:"githubAccessToken"`
	RoleName          Role   `json:"roleName"`
}

func (u User) ValidateUpdateRole() error {
	if u.Email == "" {
		return errors.Newf("user email should not be empty: %w", errors.ErrInvalidEntity)
	}
	if u.RoleName == "" {
		return errors.Newf("user role name should not be empty: %w", errors.ErrInvalidEntity)
	}
	return nil
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
