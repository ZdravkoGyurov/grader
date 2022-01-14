package storage

import (
	"context"
	"fmt"

	"github.com/ZdravkoGyurov/grader/pkg/types"
)

func (s *Storage) CreateAssignment(ctx context.Context, assignment *types.Assignment) error {
	return nil
}

func (s *Storage) GetAssignments(ctx context.Context, userEmail, courseID string) ([]types.Assignment, error) {
	return nil, nil
}

func (s *Storage) GetAssignment(ctx context.Context, id, userEmail string) (*types.Assignment, error) {
	return nil, nil
}

func (s *Storage) UpdateAssignment(ctx context.Context, assignment *types.Assignment) (*types.Assignment, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()
	fmt.Println(dbCtx)
	return nil, nil
}

func (s *Storage) DeleteAssignment(ctx context.Context, id, userEmail string) error {
	return nil
}
