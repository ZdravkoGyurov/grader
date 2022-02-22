package controller

import (
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/config"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/executor"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/storage"

	"k8s.io/client-go/kubernetes"
)

type Controller struct {
	Config    config.Config
	storage   *storage.Storage
	executor  *executor.Executor
	k8sClient *kubernetes.Clientset
}

func New(cfg config.Config, storage *storage.Storage, executor *executor.Executor) (*Controller, error) {
	k8sClient, err := createK8sClient()
	if err != nil {
		return nil, err
	}

	return &Controller{
		Config:    cfg,
		storage:   storage,
		executor:  executor,
		k8sClient: k8sClient,
	}, nil
}
