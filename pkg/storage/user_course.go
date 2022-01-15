package storage

import (
	"context"
	"fmt"

	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"
)

var (
	insertUserCourseQuery = fmt.Sprintf(`INSERT INTO %s 
	(user_email, course_id, course_role_name)
	VALUES ($1, $2, $3)`, userCourseTable)

	updateUserCourseQuery = fmt.Sprintf(`UPDATE %s SET
	course_role_name=$1
	WHERE user_email=$2 AND course_id=$3
	RETURNING *`, userCourseTable)

	deleteUserCourseQuery = fmt.Sprintf(`DELETE FROM %s 
	WHERE user_email=$1 AND course_id=$2`, userCourseTable)
)

func (s *Storage) CreateUserCourse(ctx context.Context, userEmail string, userCourse *types.UserCourse) error {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	course, err := s.GetCourse(ctx, userCourse.CourseID, userEmail)
	if err != nil {
		return dbError(errors.Newf("failed to create user course mapping: %w", err))
	}

	if course.CreatorEmail != userEmail {
		return dbError(errors.Newf("failed to create user course mapping, only course creators can create mappings: %w", err))
	}

	if _, err := s.pool.Exec(dbCtx, insertUserCourseQuery, userCourse.Fields()...); err != nil {
		return dbError(errors.Newf("failed to create user course mapping: %w", err))
	}

	return nil
}

func (s *Storage) UpdateUserCourse(ctx context.Context, userCourse *types.UserCourse) (*types.UserCourse, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	args := []interface{}{
		userCourse.CourseRoleName,
		userCourse.UserEmail,
		userCourse.CourseID,
	}
	row := s.pool.QueryRow(dbCtx, updateUserCourseQuery, args...)
	updatedUserCourse, err := readUserCourseRecord(row)
	if err != nil {
		return nil, dbError(errors.Newf("failed to update course: %w", err))
	}

	return updatedUserCourse, nil
}

func (s *Storage) DeleteUserCourse(ctx context.Context, userCourse *types.UserCourse) error {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	if _, err := s.pool.Exec(dbCtx, deleteUserCourseQuery, userCourse.UserEmail, userCourse.CourseID); err != nil {
		return dbError(errors.Newf("failed to delete user course mapping: %w", err))
	}

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
