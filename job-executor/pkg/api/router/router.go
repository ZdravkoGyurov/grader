package router

import (
	"net/http"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/api/handlers"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/api/middlewares"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/controller"
	"github.com/gorilla/mux"
)

func New(ctrl *controller.Controller) *mux.Router {
	router := mux.NewRouter()
	router.Use(middlewares.PanicRecovery)
	router.Use(middlewares.LoggerMiddleware)
	router.Use(middlewares.CorrelationIDMiddleware)
	setupJobRoutes(router, ctrl)
	return router
}

func setupJobRoutes(router *mux.Router, ctrl *controller.Controller) {
	jobHandler := &handlers.Job{Controller: ctrl}
	router.HandleFunc(JobPath, jobHandler.Post).Methods(http.MethodPost)
}
