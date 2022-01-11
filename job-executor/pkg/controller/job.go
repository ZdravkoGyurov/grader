package controller

import (
	"context"
	"strings"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/dexec"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/random"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/types"
)

func (c *Controller) ExecJob(ctx context.Context, config dexec.TestsRunConfig) error {
	logger := log.CtxLogger(ctx)
	logger.Info().Msg("executing job")

	config.ImageName = random.LowercaseString(10)
	config.ContainerName = random.LowercaseString(10)

	err := c.executor.QueueJob(ctx, func() {
		result, err := dexec.RunTests(ctx, config)
		if err != nil {
			logger.Err(err).Send()
		}

		submission := types.Submission{
			ID:     config.SubmissionID,
			Result: result,
			Status: parseResultStatus(result),
		}
		if err := c.storage.UpdateSubmission(submission); err != nil {
			logger.Err(err).Send()
		}
	})
	if err != nil {
		return errors.Newf("failed to enqueue job: %w", err)
	}

	return nil
}

func parseResultStatus(result string) types.SubmissionStatus {
	if strings.Contains(result, "\n0 tests failed") {
		return types.SubmissionStatusSuccess
	}
	return types.SubmissionStatusFail
}
