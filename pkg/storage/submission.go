package storage

import (
	"context"

	"github.com/ZdravkoGyurov/grader/pkg/types"
)

func (s *Storage) CreateSubmission(ctx context.Context, submission *types.Submission) error {
	return nil
}

func (s *Storage) GetSubmissions(ctx context.Context, userEmail, assignmentID string) ([]types.Submission, error) {
	return nil, nil
}

func (s *Storage) GetSubmission(ctx context.Context, id, userEmail string) (*types.Submission, error) {
	return nil, nil
}
