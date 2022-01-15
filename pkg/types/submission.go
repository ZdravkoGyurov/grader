package types

import (
	"github.com/ZdravkoGyurov/grader/pkg/errors"

	"github.com/google/uuid"
)

type Submission struct {
	ID                   string           `json:"id"`
	Result               string           `json:"result"`
	SubmissionStatusName SubmissionStatus `json:"submissionStatusName"`
	SubmitterEmail       string           `json:"submitterEmail"`
	AssignmentID         string           `json:"assignmentId"`
}

func (s Submission) ValidateCreate() error {
	if _, err := uuid.Parse(s.ID); err != nil {
		return errors.Newf("submission id should be UUID: %w", errors.ErrInvalidEntity)
	}
	if s.SubmitterEmail == "" {
		return errors.Newf("submission submitter email should not be empty: %w", errors.ErrInvalidEntity)
	}
	if _, err := uuid.Parse(s.AssignmentID); err != nil {
		return errors.Newf("submission assignment id should be UUID: %w", errors.ErrInvalidEntity)
	}
	return nil
}

func (s Submission) Fields() []interface{} {
	return []interface{}{
		s.ID,
		s.Result,
		s.SubmissionStatusName,
		s.SubmitterEmail,
		s.AssignmentID,
	}
}
