package controller

import (
	"context"
	"math"
	"strconv"
	"strings"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/kexec"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/types"
)

func (c *Controller) RunTests(ctx context.Context, submissionID string) error {
	logger := log.CtxLogger(ctx)

	if submissionID == "" {
		return errors.Newf("invalid submissionId: %w", errors.ErrInvalidEntity)
	}

	config, err := c.generateTestsRunnerConfig(ctx, submissionID)
	if err != nil {
		return err
	}

	err = c.executor.QueueJob(ctx, func() {
		submission := types.Submission{ID: submissionID}

		logger.Info().Msgf("executing tests for submission '%s'", submissionID)
		result, err := kexec.RunTests(c.k8sClient, config)
		logger.Info().Msgf("finished executing tests for submission '%s'", submissionID)
		if err != nil {
			logger.Err(err).Msgf("result: %s", result)
			submission.Result = "An error occurred. Contact administrator for more information."
			submission.Status = types.SubmissionStatusFail
		} else {
			submission.Result = result
			points, err := parsePoints(result)
			if err != nil {
				logger.Err(err).Msg("setting points to 0")
			}
			submission.Points = points
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

func (c *Controller) generateTestsRunnerConfig(ctx context.Context, submissionID string) (kexec.TestsRunnerConfig, error) {
	config := kexec.TestsRunnerConfig{}

	submissionInfo, err := c.storage.GetSubmissionInfo(ctx, submissionID)
	if err != nil {
		return config, err
	}

	config.TestsRunnerImage = "grader-java-tests-runner:latest" // only works for java tests currently
	config.GraderGitlabPAT = c.Config.Gitlab.PAT
	config.GraderGitlabHost = c.Config.Gitlab.Host
	config.GraderGitlabName = c.Config.Gitlab.GroupParentName
	config.CourseGitlabName = submissionInfo.CourseGitlabName
	config.AssignmentGitlabName = submissionInfo.AssignmentGitlabName
	config.SubmitterGitlabName = submissionInfo.SubmitterGitlabName
	config.TesterGitlabName = submissionInfo.TesterGitlabName

	return config, nil
}

func parsePoints(result string) (int, error) {
	resultTokens := strings.Split(result, "\n")

	successful, err := strconv.ParseFloat(strings.Split(resultTokens[0], " ")[0], 32)
	if err != nil {
		return 0, errors.Newf("failed to parse successful number of tests: %w", err)
	}
	failed, err := strconv.ParseFloat(strings.Split(resultTokens[1], " ")[0], 32)
	if err != nil {
		return 0, errors.Newf("failed to parse failed number of tests: %w", err)
	}

	points := (successful / (successful + failed)) * 100
	return int(math.Ceil(points)), nil
}

func parseResultStatus(result string) types.SubmissionStatus {
	if strings.Contains(result, "\n0 tests failed") {
		return types.SubmissionStatusSuccess
	}
	return types.SubmissionStatusFail
}
