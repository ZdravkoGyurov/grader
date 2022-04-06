package storage

import (
	"context"
	"fmt"

	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"
)

var (
	insertUserQuery = fmt.Sprintf(`INSERT INTO %s 
	(email, name, avatar_url, gitlab_id, refresh_token, role)
	VALUES ($1, $2, $3, $4, $5, $6)`, userTable)

	readUserQuery = fmt.Sprintf(`SELECT * FROM %s WHERE email=$1`, userTable)

	readUsersQuery = fmt.Sprintf(`SELECT * FROM %s`, userTable)

	updateUserRoleQuery = fmt.Sprintf(`UPDATE %s SET role=$1 WHERE email=$2 RETURNING *`, userTable)

	updateUserRefreshTokenQuery = fmt.Sprintf(`UPDATE %s SET refresh_token=$1 WHERE email=$2 RETURNING *`, userTable)
)

func (s *Storage) CreateUser(ctx context.Context, user *types.User) error {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	if _, err := s.pool.Exec(dbCtx, insertUserQuery, user.Fields()...); err != nil {
		return dbError(errors.Newf("failed to create user: %w", err))
	}

	return nil
}

func (s *Storage) GetUser(ctx context.Context, email string) (*types.User, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	row := s.pool.QueryRow(dbCtx, readUserQuery, email)
	user, err := readUserRecord(row)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get user with email %s: %w", email, err))
	}

	return user, nil
}

func (s *Storage) GetUsers(ctx context.Context) ([]types.User, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	rows, err := s.pool.Query(dbCtx, readUsersQuery)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get users: %w", err))
	}

	users := make([]types.User, 0)
	for rows.Next() {
		if err := rows.Err(); err != nil {
			return nil, dbError(errors.Newf("failed to read user row: %w", err))
		}
		user, err := readUserRecord(rows)
		user.RefreshToken = ""
		if err != nil {
			return nil, dbError(errors.Newf("failed to deserialize user row: %w", err))
		}
		users = append(users, *user)
	}

	return users, nil
}

func (s *Storage) UpdateUserRole(ctx context.Context, user *types.User) (*types.User, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	row := s.pool.QueryRow(dbCtx, updateUserRoleQuery, user.RoleName, user.Email)
	updatedUser, err := readUserRecord(row)
	if err != nil {
		return nil, dbError(errors.Newf("failed to update user with email %s: %w", user.Email, err))
	}

	return updatedUser, nil
}

func (s *Storage) UpdateUserRefreshToken(ctx context.Context, user *types.User) (*types.User, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	row := s.pool.QueryRow(dbCtx, updateUserRefreshTokenQuery, user.RefreshToken, user.Email)
	updatedUser, err := readUserRecord(row)
	if err != nil {
		return nil, dbError(errors.Newf("failed to update user with email %s: %w", user.Email, err))
	}

	return updatedUser, nil
}

func readUserRecord(row dbRecord) (*types.User, error) {
	var user types.User

	err := row.Scan(
		&user.Email,
		&user.Name,
		&user.AvatarURL,
		&user.GitlabID,
		&user.RefreshToken,
		&user.RoleName,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
