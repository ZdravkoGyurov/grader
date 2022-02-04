package controller

import (
	"context"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/dexec"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/random"
)

func (c *Controller) CreateAssignment(ctx context.Context, cfg dexec.CreateAssignmentConfig) error {
	logger := log.CtxLogger(ctx)

	if err := cfg.Validate(); err != nil {
		return errors.Newf("invalid create gitlab assignment config: %w", err)
	}

	c.fillCreateAssignmentConfig(&cfg)

	err := c.executor.QueueJob(ctx, func() {
		logger.Info().Msgf("creating gitlab assignment '%s'", cfg.AssignmentPath)
		result, err := dexec.CreateAssignment(ctx, cfg)
		logger.Info().Msgf("finished creating gitlab assignment '%s'", cfg.AssignmentPath)
		if err != nil {
			logger.Err(err).Msgf("result: %s", result)
		}
	})
	if err != nil {
		return errors.Newf("failed to enqueue create assignment job: %w", err)
	}

	return nil
}

func (c *Controller) fillCreateAssignmentConfig(config *dexec.CreateAssignmentConfig) {
	config.ImageName = random.LowercaseString(10)
	config.ContainerName = random.LowercaseString(10)
	config.User = c.Config.Gitlab.User
	config.UserEmail = c.Config.Gitlab.UserEmail
	config.PAT = c.Config.Gitlab.PAT
	config.GitlabHost = c.Config.Gitlab.Host
	config.RootGroup = c.Config.Gitlab.GroupParentName
}
