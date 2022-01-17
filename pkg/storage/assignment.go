package storage

import (
	"context"
	"fmt"

	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"
)

var (
	insertAssignmentQuery = fmt.Sprintf(`INSERT INTO %s 
	(id, name, description, author_email, course_id, github_name, created_on, last_edited_on)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, assignmentTable)

	readAssignmentsByCourseIDQuery = fmt.Sprintf(`SELECT * FROM %s 
    WHERE course_id=$2 AND course_id IN 
	(SELECT course_id FROM %s WHERE user_email=$1)`, assignmentTable, userCourseTable)

	readAssignmentsQuery = fmt.Sprintf(`SELECT * FROM %s WHERE course_id IN 
	(SELECT course_id FROM %s WHERE user_email=$1)`, assignmentTable, userCourseTable)

	readAssignmentQuery = fmt.Sprintf(`SELECT * FROM %s
	WHERE id=$1 AND course_id IN 
	(SELECT course_id FROM %s WHERE user_email=$2)`, assignmentTable, userCourseTable)

	updateAssignmentQuery = fmt.Sprintf(`UPDATE %s SET
	name=COALESCE(NULLIF($1, ''), name), 
	description=COALESCE(NULLIF($2, ''), description), 
	last_edited_on=$3
	WHERE id=$4 AND author_email=$5
	RETURNING *`, assignmentTable)

	deleteAssignmentQuery = fmt.Sprintf(`DELETE FROM %s WHERE id=$1 AND author_email=$2`, assignmentTable)
)

func (s *Storage) CreateAssignment(ctx context.Context, assignment *types.Assignment) error {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	if _, err := s.pool.Exec(dbCtx, insertAssignmentQuery, assignment.Fields()...); err != nil {
		return dbError(errors.Newf("failed to create assignment: %w", err))
	}

	return nil
}

func (s *Storage) GetAssignmentsByCourseID(ctx context.Context, userEmail, courseID string) ([]*types.Assignment, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	rows, err := s.pool.Query(dbCtx, readAssignmentsByCourseIDQuery, userEmail, courseID)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get assignments for course with id %s: %w", courseID, err))
	}

	assignments := make([]*types.Assignment, 0)
	for rows.Next() {
		if err := rows.Err(); err != nil {
			return nil, dbError(errors.Newf("failed to read assignment row: %w", err))
		}
		assignment, err := readAssignmentRecord(rows)
		if err != nil {
			return nil, dbError(errors.Newf("failed to deserialize assignment row: %w", err))
		}
		assignments = append(assignments, assignment)
	}

	return assignments, nil
}

func (s *Storage) GetAssignments(ctx context.Context, userEmail string) ([]*types.Assignment, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	rows, err := s.pool.Query(dbCtx, readAssignmentsQuery, userEmail)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get assignments: %w", err))
	}

	assignments := make([]*types.Assignment, 0)
	for rows.Next() {
		if err := rows.Err(); err != nil {
			return nil, dbError(errors.Newf("failed to read assignment row: %w", err))
		}
		assignment, err := readAssignmentRecord(rows)
		if err != nil {
			return nil, dbError(errors.Newf("failed to deserialize assignment row: %w", err))
		}
		assignments = append(assignments, assignment)
	}

	return assignments, nil
}

func (s *Storage) GetAssignment(ctx context.Context, id, userEmail string) (*types.Assignment, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	row := s.pool.QueryRow(dbCtx, readAssignmentQuery, id, userEmail)
	assignment, err := readAssignmentRecord(row)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get assignment with id %s: %w", id, err))
	}

	return assignment, nil
}

func (s *Storage) UpdateAssignment(ctx context.Context, assignment *types.Assignment) (*types.Assignment, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	args := []interface{}{
		assignment.Name,
		assignment.Description,
		assignment.LastEditedOn,
		assignment.ID,
		assignment.AuthorEmail,
	}
	row := s.pool.QueryRow(dbCtx, updateAssignmentQuery, args...)
	updatedAssignment, err := readAssignmentRecord(row)
	if err != nil {
		return nil, dbError(errors.Newf("failed to update assignment with id %s: %w", assignment.ID, err))
	}

	return updatedAssignment, nil
}

func (s *Storage) DeleteAssignment(ctx context.Context, id, userEmail string) error {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	if _, err := s.pool.Exec(dbCtx, deleteAssignmentQuery, id, userEmail); err != nil {
		return dbError(errors.Newf("failed to delete assignment with id %s: %w", id, err))
	}

	return nil
}

func readAssignmentRecord(row dbRecord) (*types.Assignment, error) {
	var assignment types.Assignment

	err := row.Scan(
		&assignment.ID,
		&assignment.Name,
		&assignment.Description,
		&assignment.GithubName,
		&assignment.AuthorEmail,
		&assignment.CourseID,
		&assignment.CreatedOn,
		&assignment.LastEditedOn,
	)
	if err != nil {
		return nil, err
	}

	return &assignment, nil
}
