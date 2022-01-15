package storage

import (
	"context"
	"fmt"

	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"

	"github.com/jackc/pgx/v4"
)

var (
	readUserFromCourseQuery = fmt.Sprintf(`SELECT * FROM %s WHERE user_email=$1 AND 
	course_id=(SELECT course_id FROM %s WHERE id=$2)`, userCourseTable, assignmentTable)

	insertSubmissionQuery = fmt.Sprintf(`INSERT INTO %s 
	(id, result, submission_status_name, submitter_email, assignment_id)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING *`, submissionTable)

	readSubmissionsQuery = fmt.Sprintf(`SELECT * FROM %s WHERE assignment_id=$1 AND 
	(submitter_email=$2 OR assignment_id IN (SELECT id FROM %s WHERE course_id IN 
		(SELECT course_id FROM %s WHERE user_email=$2)))`,
		submissionTable, assignmentTable, userCourseTable)

	readSubmissionQuery = fmt.Sprintf(`SELECT * FROM %s WHERE id=$1 AND 
	(submitter_email=$2 OR assignment_id IN (SELECT id FROM %s WHERE course_id IN 
	(SELECT course_id FROM %s WHERE user_email=$2 AND course_role_name='%s')))`,
		submissionTable, assignmentTable, userCourseTable, types.CourseRoleAssistant)
)

func (s *Storage) CreateSubmission(ctx context.Context, submission *types.Submission) error {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	err := inTransaction(ctx, s.pool, func(tx pgx.Tx) error {
		row := tx.QueryRow(dbCtx, readUserFromCourseQuery, submission.SubmitterEmail, submission.AssignmentID)
		if _, err := readUserCourseRecord(row); err != nil {
			return dbError(errors.Newf("user is not in the course: %w", err))
		}
		if _, err := tx.Exec(dbCtx, insertSubmissionQuery, submission.Fields()...); err != nil {
			return dbError(errors.Newf("failed to create submission: %w", err))
		}
		return nil
	})

	return err
}

func (s *Storage) GetSubmissions(ctx context.Context, userEmail, assignmentID string) ([]*types.Submission, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	rows, err := s.pool.Query(dbCtx, readSubmissionsQuery, assignmentID, userEmail)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get submissions: %w", err))
	}

	submissions := make([]*types.Submission, 0)
	for rows.Next() {
		if err := rows.Err(); err != nil {
			return nil, dbError(errors.Newf("failed to read submission row: %w", err))
		}
		submission, err := readSubmissionRecord(rows)
		if err != nil {
			return nil, dbError(errors.Newf("failed to deserialize submission row: %w", err))
		}
		submissions = append(submissions, submission)
	}

	return submissions, nil
}

func (s *Storage) GetSubmission(ctx context.Context, id, userEmail string) (*types.Submission, error) {
	dbCtx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	row := s.pool.QueryRow(dbCtx, readSubmissionQuery, id, userEmail)
	submission, err := readSubmissionRecord(row)
	if err != nil {
		return nil, dbError(errors.Newf("failed to get submission with id %s: %w", id, err))
	}

	return submission, nil
}

func readSubmissionRecord(row dbRecord) (*types.Submission, error) {
	var submission types.Submission

	err := row.Scan(
		&submission.ID,
		&submission.Result,
		&submission.SubmissionStatusName,
		&submission.SubmitterEmail,
		&submission.AssignmentID,
	)
	if err != nil {
		return nil, err
	}

	return &submission, nil
}
