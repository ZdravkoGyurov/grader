package kexec

import (
	"context"

	"k8s.io/client-go/kubernetes"
)

func RunTests(k8sClient *kubernetes.Clientset, cfg TestsRunnerConfig) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), runTestsMaxDuration)
	defer cancel()

	pod, err := createTestsRunnerPod(cfg)
	if err != nil {
		return "", err
	}

	return runPod(ctx, k8sClient, pod)
}
