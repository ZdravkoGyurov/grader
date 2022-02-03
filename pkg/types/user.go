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
		return errors.Newf("email should not be empty: %w", errors.ErrInvalidEntity)
	}
	if u.RoleName == "" {
		return errors.Newf("roleName should not be empty: %w", errors.ErrInvalidEntity)
	}
	if u.RoleName != RoleTeacher && u.RoleName != RoleStudent {
		return errors.Newf("roleName can only be 'Teacher' and 'Student': %w", errors.ErrInvalidEntity)
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
