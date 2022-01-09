package controller

import (
	"context"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/dexec"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/types"
)

func (c *Controller) ExecJob(ctx context.Context, submissionID string) error {
	logger := log.CtxLogger(ctx)
	logger.Info().Msg("executing job")

	jobName := "" // TODO
	err := c.executor.QueueJob(ctx, jobName, func() {
		// TODO run tests
		output, err := dexec.RunTests(ctx, dexec.TestsRunConfig{
			ImageName:     "job-exec-test-image1",
			ContainerName: "job-exec-test-container1",
		})
		if err != nil {
			logger.Err(err).Send()
		}
		logger.Info().Msgf("output: %s", output)

		result := "{}"                          // TODO
		status := types.SubmissionStatusSuccess // TODO

		submission := types.Submission{
			ID:     submissionID,
			Result: result,
			Status: status,
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
