package dexec

import (
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"

	"github.com/google/uuid"
)

type TestsRunConfig struct {
	SubmissionID         string `json:"submissionId"`
	ImageName            string
	ContainerName        string
	GraderGitlabPAT      string
	GraderGitlabHost     string
	GraderGitlabName     string
	CourseGitlabName     string
	AssignmentGitlabName string
	SubmitterGitlabName  string
	TesterGitlabName     string
}

func (c *TestsRunConfig) Validate() error {
	if _, err := uuid.Parse(c.SubmissionID); err != nil {
		return errors.Newf("invalid submissionID: %w", err)
	}

	return nil
}
