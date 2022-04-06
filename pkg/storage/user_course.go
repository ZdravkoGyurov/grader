package storage

import (
	"context"
	"fmt"

	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"
)

var (
	insertUserCourseQuery = fmt.Sprintf(`INSERT INTO %s 
	(user_email, course_id, course_role)
	VALUES ($1, $2, $3)`, userCourseTable)

	readUserCoursesQuery = fmt.Sprintf(`SELECT * FROM %s WHERE course_id=$1`, userCourseTable)

	readCourseUserNamesQuery = fmt.Sprintf(`SELECT %[2]s.name 
	FROM %[1]s join %[2]s on %[1]s.user_email = %[2]s.email 
	WHERE %[1]s.course_id=$1`, userCourseTable, userTable)

	updateUserCourseQuery = fmt.Sprintf(`UPDATE %s SET
	course_role=$1
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

func (s *Storage) GetUserCourses(ctx context.Context, courseID string) ([]types.UserCourse, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	rows, err := s.pool.Query(dbCtx, readUserCoursesQuery, courseID)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get user courses: %w", err))
	}

	userCourses := make([]types.UserCourse, 0)
	for rows.Next() {
		if err := rows.Err(); err != nil {
			return nil, dbError(errors.Newf("failed to read user course row: %w", err))
		}
		userCourse, err := readUserCourseRecord(rows)
		if err != nil {
			return nil, dbError(errors.Newf("failed to deserialize user course row: %w", err))
		}
		userCourses = append(userCourses, *userCourse)
	}

	return userCourses, nil
}

func (s *Storage) GetCoruseUserNames(ctx context.Context, courseID string) ([]string, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	rows, err := s.pool.Query(dbCtx, readCourseUserNamesQuery, courseID)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get course usernames: %w", err))
	}

	usernames := make([]string, 0)
	for rows.Next() {
		if err := rows.Err(); err != nil {
			return nil, dbError(errors.Newf("failed to read username row: %w", err))
		}
		username, err := readUserNameRecord(rows)
		if err != nil {
			return nil, dbError(errors.Newf("failed to deserialize username row: %w", err))
		}
		usernames = append(usernames, username)
	}

	return usernames, nil
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

func readUserNameRecord(row dbRecord) (string, error) {
	var username string

	if err := row.Scan(&username); err != nil {
		return "", err
	}

	return username, nil
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
