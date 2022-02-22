package kexec

import (
	"context"

	"k8s.io/client-go/kubernetes"
)

func CreateAssignment(k8sClient *kubernetes.Clientset, cfg CreateAssignmentConfig) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), createAssignmentMaxDuration)
	defer cancel()

	pod, err := createAssignmentCreatorPod(cfg)
	if err != nil {
		return "", err
	}

	return runPod(ctx, k8sClient, pod)
}
