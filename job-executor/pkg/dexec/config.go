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

type CreateAssignmentConfig struct {
	ImageName       string
	ContainerName   string
	User            string
	UserEmail       string
	PAT             string
	GitlabHost      string
	RootGroup       string
	CourseGroup     string `json:"courseGroup"`
	AssignmentPaths string `json:"assignmentPaths"`
	GitlabUsernames string `json:"gitlabUsernames"`
}

func (c *CreateAssignmentConfig) Validate() error {
	if c.CourseGroup == "" {
		return errors.Newf("courseGroup cannot be empty: %w", errors.ErrInvalidEntity)
	}
	if c.AssignmentPaths == "" {
		return errors.Newf("assignmentPaths cannot be empty: %w", errors.ErrInvalidEntity)
	}
	if c.GitlabUsernames == "" {
		return errors.Newf("gitlabUsernames cannot be empty: %w", errors.ErrInvalidEntity)
	}

	return nil
}
