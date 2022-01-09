package storage

import (
	"context"
	"fmt"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/types"
)

const submissionTable = "submission"

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
