package storage

import (
	"context"

	"github.com/ZdravkoGyurov/grader/pkg/types"
)

func (s *Storage) CreateUserCourse(ctx context.Context, userEmail string, userCourse *types.UserCourse) error {
	return nil
}

func (s *Storage) UpdateUserCourse(ctx context.Context, userCourse *types.UserCourse) (*types.UserCourse, error) {
	return nil, nil
}

func (s *Storage) DeleteUserCourse(ctx context.Context, userCourse *types.UserCourse) error {
	return nil
}

func readUserCourseRecord(row dbRecord) (*types.UserCourse, error) {
	var userCourse types.UserCourse

	err := row.Scan(
		&userCourse.UserEmail,
		&userCourse.CourseID,
		&userCourse.CourseRoleName,
	)
	if err != nil {
		return nil, err
	}

	return &userCourse, nil
}
