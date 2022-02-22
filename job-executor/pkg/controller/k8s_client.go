package controller

import (
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

func createK8sClient() (*kubernetes.Clientset, error) {
	config, err := rest.InClusterConfig()
	if err != nil {
		return nil, errors.Newf("failed to create k8s client config: %w", err)
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, errors.Newf("failed to create k8s client: %w", err)
	}

	return clientset, nil
}
