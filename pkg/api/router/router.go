package router

import (
	"github.com/ZdravkoGyurov/grader/pkg/api/middlewares"
	"github.com/ZdravkoGyurov/grader/pkg/controller"
	"github.com/gorilla/mux"
)

func New(ctrl *controller.Controller) *mux.Router {
	router := mux.NewRouter()
	router.Use(middlewares.PanicRecovery)
	router.Use(middlewares.LoggerMiddleware)
	router.Use(middlewares.CorrelationIDMiddleware)
	return router
}
