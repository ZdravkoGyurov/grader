package storage

import (
	"context"

	"github.com/ZdravkoGyurov/grader/pkg/types"
)

func (s *Storage) CreateUser(ctx context.Context, user *types.User) error {
	return nil
}

func (s *Storage) GetUser(ctx context.Context, email string) (*types.User, error) {
	return nil, nil
}

func (s *Storage) UpdateUserRole(ctx context.Context, user *types.User) (*types.User, error) {
	return nil, nil
}

func (s *Storage) UpdateUserRefreshToken(ctx context.Context, user *types.User) (*types.User, error) {
	return nil, nil
}
