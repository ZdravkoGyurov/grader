package controller

import (
	"context"

	"github.com/ZdravkoGyurov/grader/pkg/types"
	"github.com/google/uuid"
)

func (c *Controller) CreateSubmission(ctx context.Context, submission *types.Submission) (*types.Submission, error) {
	submission.ID = uuid.NewString()
	submission.Result = ""
	submission.SubmissionStatusName = types.SubmissionStatusPending

	if err := submission.ValidateCreate(); err != nil {
		return nil, err
	}

	if err := c.storage.CreateSubmission(ctx, submission); err != nil {
		return nil, err
	}

	return submission, nil
}

func (c *Controller) CreateSubmissionJob(ctx context.Context, submissionID string) error {
	return c.createJobRun(ctx, submissionID)
}

func (c *Controller) GetSubmissions(ctx context.Context, userEmail, assignmentID string) ([]*types.Submission, error) {
	return c.storage.GetSubmissions(ctx, userEmail, assignmentID)
}

func (c *Controller) GetSubmission(ctx context.Context, id, userEmail string) (*types.Submission, error) {
	return c.storage.GetSubmission(ctx, id, userEmail)
}
