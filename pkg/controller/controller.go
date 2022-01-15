package controller

import (
	"net/http"

	"github.com/ZdravkoGyurov/grader/pkg/config"
	"github.com/ZdravkoGyurov/grader/pkg/storage"
)

type Controller struct {
	Config  config.Config
	client  http.Client
	storage *storage.Storage
}

func New(cfg config.Config, client http.Client, storage *storage.Storage) Controller {
	return Controller{
		Config:  cfg,
		client:  client,
		storage: storage,
	}
}
