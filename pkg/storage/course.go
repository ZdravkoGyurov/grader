package storage

import (
	"context"
	"fmt"

	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"

	"github.com/jackc/pgx/v4"
)

var (
	insertCourseQuery = fmt.Sprintf(`INSERT INTO %s 
	(id, name, description, gitlab_id, gitlab_name, creator_email, created_on, last_edited_on)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	RETURNING *`, courseTable)

	insertCourseAssistantQuery = fmt.Sprintf(`INSERT INTO %s 
	(user_email, course_id, course_role)
	VALUES ($1, $2, $3)`, userCourseTable)

	readCoursesQuery = fmt.Sprintf(`SELECT * FROM %s WHERE id IN 
	(SELECT course_id FROM %s WHERE user_email=$1)`, courseTable, userCourseTable)

	readCourseQuery = fmt.Sprintf(`SELECT * FROM %s 
	WHERE id=$1 AND id IN 
	(SELECT course_id FROM %s WHERE user_email=$2)`, courseTable, userCourseTable)

	updateCourseQuery = fmt.Sprintf(`UPDATE %s SET
	name=COALESCE(NULLIF($1, ''), name), 
	description=COALESCE(NULLIF($2, ''), description), 
	last_edited_on=$3
	WHERE id=$4 AND creator_email=$5
	RETURNING *`, courseTable)

	deleteCourseQuery = fmt.Sprintf(`DELETE FROM %s WHERE id=$1 AND creator_email=$2`, courseTable)
)

func (s *Storage) CreateCourse(ctx context.Context, course *types.Course) error {
	userCourse := &types.UserCourse{
		UserEmail:      course.CreatorEmail,
		CourseID:       course.ID,
		CourseRoleName: types.CourseRoleAssistant,
	}

	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	err := inTransaction(ctx, s.pool, func(tx pgx.Tx) error {
		if _, err := tx.Exec(dbCtx, insertCourseQuery, course.Fields()...); err != nil {
			return dbError(errors.Newf("failed to create course: %w", err))
		}
		if _, err := tx.Exec(dbCtx, insertCourseAssistantQuery, userCourse.Fields()...); err != nil {
			return dbError(errors.Newf("failed to create user course: %w", err))
		}
		return nil
	})

	return err
}

func (s *Storage) GetCourses(ctx context.Context, userEmail string) ([]*types.Course, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	rows, err := s.pool.Query(dbCtx, readCoursesQuery, userEmail)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get courses: %w", err))
	}

	courses := make([]*types.Course, 0)
	for rows.Next() {
		if err := rows.Err(); err != nil {
			return nil, dbError(errors.Newf("failed to read course row: %w", err))
		}
		course, err := readCourseRecord(rows)
		if err != nil {
			return nil, dbError(errors.Newf("failed to deserialize course row: %w", err))
		}
		courses = append(courses, course)
	}

	return courses, nil
}

func (s *Storage) GetCourse(ctx context.Context, id, userEmail string) (*types.Course, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	row := s.pool.QueryRow(dbCtx, readCourseQuery, id, userEmail)
	course, err := readCourseRecord(row)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get course with id %s: %w", id, err))
	}

	return course, nil
}

func (s *Storage) UpdateCourse(ctx context.Context, course *types.Course) (*types.Course, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	args := []interface{}{
		course.Name,
		course.Description,
		course.LastEditedOn,
		course.ID,
		course.CreatorEmail,
	}
	row := s.pool.QueryRow(dbCtx, updateCourseQuery, args...)
	updatedCourse, err := readCourseRecord(row)
	if err != nil {
		return nil, dbError(errors.Newf("failed to update course with id %s: %w", course.ID, err))
	}

	return updatedCourse, nil
}

func (s *Storage) DeleteCourse(ctx context.Context, id, userEmail string) error {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	if _, err := s.pool.Exec(dbCtx, deleteCourseQuery, id, userEmail); err != nil {
		return dbError(errors.Newf("failed to delete course with id %s: %w", id, err))
	}

	return nil
}

func readCourseRecord(row dbRecord) (*types.Course, error) {
	var course types.Course

	err := row.Scan(
		&course.ID,
		&course.Name,
		&course.Description,
		&course.GitlabID,
		&course.GitlabName,
		&course.CreatorEmail,
		&course.CreatedOn,
		&course.LastEditedOn,
	)
	if err != nil {
		return nil, err
	}

	return &course, nil
}
