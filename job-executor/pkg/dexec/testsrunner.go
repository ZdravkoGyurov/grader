package dexec

import (
	"context"
	"strings"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
)

func CreateAssignment(ctx context.Context, cfg CreateAssignmentConfig) (string, error) {
	output, err := buildCreateAssignmentsImage(cfg, "pkg/dexec/create_assignments/.")
	if err != nil {
		return output, errors.Newf("failed docker build: %w", err)
	}
	defer handleRemoveImage(ctx, cfg.ImageName)

	output, err = runImage(cfg.ImageName, cfg.ContainerName)
	if err != nil && !strings.Contains(output, "created assignment successfully") {
		return output, errors.Newf("failed docker run: %w", err)
	}

	return output, nil
}

func RunTests(ctx context.Context, testsConfig TestsRunConfig) (string, error) {
	output, err := buildSubmissionImage(testsConfig, "pkg/dexec/run_tests/.")
	if err != nil {
		return output, errors.Newf("failed docker build: %w", err)
	}
	defer handleRemoveImage(ctx, testsConfig.ImageName)

	output, err = runImage(testsConfig.ImageName, testsConfig.ContainerName)
	if err != nil && hasDockerErrors(output) {
		return output, errors.Newf("failed docker run: %w", err)
	}

	return output, nil
}

func hasDockerErrors(output string) bool {
	return !strings.Contains(output, "tests successful") || !strings.Contains(output, "tests failed")
}

func handleRemoveImage(ctx context.Context, imageName string) {
	if err := removeImage(imageName); err != nil {
		log.CtxLogger(ctx).Err(err).Msg("failed to remove docker image")
	}
}
