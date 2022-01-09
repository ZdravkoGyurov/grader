package dexec

import (
	"context"
	"fmt"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
)

type TestsRunConfig struct {
	ImageName     string
	ContainerName string
}

func RunTests(ctx context.Context, testsConfig TestsRunConfig) (string, error) {
	output, err := buildSubmissionImage(testsConfig, "pkg/dexec/.")
	if err != nil {
		return output, fmt.Errorf("failed docker build: %w", err)
	}
	defer handleRemoveImage(ctx, testsConfig.ImageName)

	output, err = runImage(testsConfig.ImageName, testsConfig.ContainerName)
	if err != nil && false { // TODO: check additionally if error was from test fail
		return output, fmt.Errorf("failed docker run: %w", err)
	}
	defer handleRemoveContainer(ctx, testsConfig.ContainerName)

	return output, nil
}

func handleRemoveImage(ctx context.Context, imageName string) {
	if err := removeImage(imageName); err != nil {
		log.CtxLogger(ctx).Err(err).Msg("failed to remove docker image")
	}
}

func handleRemoveContainer(ctx context.Context, containerName string) {
	if err := removeContainer(containerName); err != nil {
		log.CtxLogger(ctx).Err(err).Msg("failed to remove docker container")
	}
}
