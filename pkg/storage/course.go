package storage

import (
	"context"

	"github.com/ZdravkoGyurov/grader/pkg/types"
)

func (s *Storage) CreateCourse(ctx context.Context, course *types.Course) error {
	return nil
}

func (s *Storage) GetCourses(ctx context.Context, userEmail string) ([]types.Course, error) {
	return nil, nil
}

func (s *Storage) GetCourse(ctx context.Context, id, userEmail string) (*types.Course, error) {
	return nil, nil
}

func (s *Storage) UpdateCourse(ctx context.Context, course *types.Course) (*types.Course, error) {
	return nil, nil
}

func (s *Storage) DeleteCourse(ctx context.Context, id, userEmail string) error {
	return nil
}
