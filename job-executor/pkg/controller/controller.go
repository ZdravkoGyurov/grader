package controller

import (
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/config"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/executor"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/storage"
)

type Controller struct {
	Config   config.Config
	storage  *storage.Storage
	executor *executor.Executor
}

func New(cfg config.Config, storage *storage.Storage, executor *executor.Executor) *Controller {
	return &Controller{
		Config:   cfg,
		storage:  storage,
		executor: executor,
	}
}
