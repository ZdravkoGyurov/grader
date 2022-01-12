package storage

import (
	"context"
	"fmt"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/types"
)

const (
	courseTable     = "course"
	assignmentTable = "assignment"
	submissionTable = "submission"
	usersTable      = "users"
)

func (s *Storage) UpdateSubmission(submission types.Submission) error {
	ctx, cancel := context.WithTimeout(context.Background(), s.cfg.RequestTimeout)
	defer cancel()

	updateQuery := fmt.Sprintf(`UPDATE %s SET result=$1, submission_status_name=$2 WHERE id=$3`, submissionTable)
	result, err := s.pool.Exec(ctx, updateQuery, submission.Result, submission.Status, submission.ID)
	if err != nil {
		return mapDBError(errors.Newf("failed to update submission: %w", err))
	}
	if result.RowsAffected() != 1 {
		return errors.Newf("failed to update submission: %w", errNoRowsAffected)
	}

	return nil
}

func (s *Storage) GetSubmissionInfo(ctx context.Context, submissionID string) (*types.SubmissionInfo, error) {
	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	query := fmt.Sprintf(`SELECT c.github_name as course_github_name, 
	a.github_name as assignment_github_name, 
	c.creator_email, 
	s.submitter_email 
	from %s as s inner join %s as a on s.assignment_id = a.id 
	inner join %s as c on a.course_id = c.id where s.id=$1`, submissionTable, assignmentTable, courseTable)
	var (
		courseGithubName     string
		assignmentGithubName string
		creatorEmail         string
		submitterEmail       string
	)
	row := s.pool.QueryRow(ctx, query, submissionID)
	err := row.Scan(&courseGithubName, &assignmentGithubName, &creatorEmail, &submitterEmail)
	if err != nil {
		return nil, mapDBError(errors.Newf("failed to get submission info: %w", err))
	}

	submitterGithubName, submitterGithubToken, err := s.getSubmissionUserInfo(ctx, submitterEmail)
	if err != nil {
		return nil, err
	}

	testerGithubName, testerGithubToken, err := s.getSubmissionUserInfo(ctx, creatorEmail)
	if err != nil {
		return nil, err
	}

	return &types.SubmissionInfo{
		CourseGithubName:     courseGithubName,
		AssignmentGithubName: assignmentGithubName,
		SubmitterGithubName:  submitterGithubName,
		SubmitterGithubToken: submitterGithubToken,
		TesterGithubName:     testerGithubName,
		TesterGithubToken:    testerGithubToken,
	}, nil
}

func (s *Storage) getSubmissionUserInfo(ctx context.Context, email string) (string, string, error) {
	query := fmt.Sprintf(`SELECT name, github_access_token from %s where email=$1`, usersTable)
	var (
		name        string
		accessToken string
	)
	err := s.pool.QueryRow(ctx, query, email).Scan(&name, &accessToken)
	if err != nil {
		return "", "", mapDBError(errors.Newf("failed to get submission user '%s' info: %w", email, err))
	}

	return name, accessToken, nil
}
