package controller

import (
	"context"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/kexec"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/types"
)

func (c *Controller) CreateAssignment(ctx context.Context, assignment types.AssignmentBody) error {
	logger := log.CtxLogger(ctx)

	if assignment.CourseGroup == "" {
		return errors.Newf("courseGroup cannot be empty: %w", errors.ErrInvalidEntity)
	}
	if assignment.AssignmentPaths == "" {
		return errors.Newf("assignmentPaths cannot be empty: %w", errors.ErrInvalidEntity)
	}
	if assignment.GitlabUsernames == "" {
		return errors.Newf("gitlabUsernames cannot be empty: %w", errors.ErrInvalidEntity)
	}

	cfg := c.generateCreateAssignmentConfig(assignment)

	err := c.executor.QueueJob(ctx, func() {
		logger.Info().Msgf("creating gitlab assignment(s) '%s'", cfg.AssignmentPaths)
		result, err := kexec.CreateAssignment(c.k8sClient, cfg)
		logger.Info().Msgf("finished creating gitlab assignment(s) '%s'", cfg.AssignmentPaths)
		if err != nil {
			logger.Err(err).Msgf("result: %s", result)
		}
	})
	if err != nil {
		return errors.Newf("failed to enqueue create assignment job: %w", err)
	}

	return nil
}

func (c *Controller) generateCreateAssignmentConfig(assignment types.AssignmentBody) kexec.CreateAssignmentConfig {
	cfg := kexec.CreateAssignmentConfig{}
	cfg.TestsRunnerImage = "grader-assignments-creator:latest"
	cfg.User = c.Config.Gitlab.User
	cfg.UserEmail = c.Config.Gitlab.UserEmail
	cfg.PAT = c.Config.Gitlab.PAT
	cfg.GitlabHost = c.Config.Gitlab.Host
	cfg.RootGroup = c.Config.Gitlab.GroupParentName
	cfg.CourseGroup = assignment.CourseGroup
	cfg.AssignmentPaths = assignment.AssignmentPaths
	cfg.GitlabUsernames = assignment.GitlabUsernames
	return cfg
}
