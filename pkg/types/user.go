package types

import "github.com/ZdravkoGyurov/grader/pkg/errors"

type User struct {
	Email        string `json:"email"`
	Name         string `json:"name"`
	AvatarURL    string `json:"avatarUrl"`
	GitlabID     string `json:"gitlabId"`
	RefreshToken string `json:"refreshToken"`
	RoleName     Role   `json:"roleName"`
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
		u.GitlabID,
		u.RefreshToken,
		u.RoleName,
	}
}
