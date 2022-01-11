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

	config.ImageName = random.LowercaseString(10)
	config.ContainerName = random.LowercaseString(10)

	err := c.executor.QueueJob(ctx, func() {
		submission := types.Submission{ID: config.SubmissionID}

		logger.Info().Msgf("executing tests for submission '%s'", config.SubmissionID)
		result, err := dexec.RunTests(ctx, config)
		logger.Info().Msgf("finished executing tests for submission '%s'", config.SubmissionID)
		if err != nil {
			logger.Err(err).Msgf("result: %s", result)
			submission.Result = "An error occurred. Contact administrator for more information."
			submission.Status = types.SubmissionStatusFail
		} else {
			submission.Result = result
			submission.Status = parseResultStatus(result)
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
