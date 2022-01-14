package controller

import (
	"github.com/ZdravkoGyurov/grader/pkg/config"
	"github.com/ZdravkoGyurov/grader/pkg/storage"
)

type Controller struct {
	Config  config.Config
	storage *storage.Storage
}

func New(cfg config.Config, storage *storage.Storage) *Controller {
	return &Controller{
		Config:  cfg,
		storage: storage,
	}
}
