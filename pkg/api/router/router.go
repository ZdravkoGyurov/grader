package router

import (
	"net/http"

	"github.com/ZdravkoGyurov/grader/pkg/api/handlers"
	"github.com/ZdravkoGyurov/grader/pkg/api/middlewares"
	"github.com/ZdravkoGyurov/grader/pkg/api/router/paths"
	"github.com/ZdravkoGyurov/grader/pkg/controller"
	"github.com/ZdravkoGyurov/grader/pkg/log"
	"github.com/ZdravkoGyurov/grader/pkg/types"

	"github.com/gorilla/mux"
)

type Router struct {
	*mux.Router
	controller controller.Controller
}

func New(ctrl controller.Controller) Router {
	r := mux.NewRouter()
	router := Router{
		Router:     r,
		controller: ctrl,
	}

	router.Use(middlewares.PanicRecovery)
	router.Use(middlewares.LoggerMiddleware)
	router.Use(middlewares.CorrelationIDMiddleware)
	router.mountAuthRoutes()
	router.mountCourseRoutes()
	router.mountAssignmentRoutes()
	router.mountSubmissionRoutes()
	router.mountUserCourseRoutes()

	logRoutes(r)
	return router
}

func logRoutes(router *mux.Router) {
	logger := log.DefaultLogger()
	err := router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		path, _ := route.GetPathTemplate()
		methods, _ := route.GetMethods()
		if path != "" || len(methods) > 0 {
			logger.Info().Msgf("%v %s", methods, path)
		}
		return nil
	})
	if err != nil {
		logger.Err(err).Msg("could not list routes")
	}
}

func (r *Router) Role(requiredRole types.Role) *Router {
	authRouter := r.NewRoute().Subrouter()
	authenticator := middlewares.Authenticator{
		AuthConfig: r.controller.Config.Auth,
	}
	authRouter.Use(authenticator.Authenticate)
	authorizer := middlewares.Authorizer{
		Controller: r.controller,
	}
	authRouter.Use(authorizer.Authorize(requiredRole))
	return &Router{
		Router:     authRouter,
		controller: r.controller,
	}
}

func (r Router) mountAuthRoutes() {
	authHandler := handlers.Auth{Controller: r.controller}
	r.Methods(http.MethodGet).Path(paths.GitlabLoginPath).HandlerFunc(authHandler.Login)
	r.Methods(http.MethodGet).Path(paths.GitlabLoginCallbackPath).HandlerFunc(authHandler.LoginCallback)
	r.Methods(http.MethodGet).Path(paths.UserInfoPath).HandlerFunc(authHandler.GetUserInfo)
	r.Role(types.RoleAdmin).Methods(http.MethodGet).Path(paths.UserPath).HandlerFunc(authHandler.GetUsers)
	r.Role(types.RoleAdmin).Methods(http.MethodPatch).Path(paths.UserInfoPath).HandlerFunc(authHandler.PatchUserRole)
	r.Methods(http.MethodPost).Path(paths.TokenPath).HandlerFunc(authHandler.RefreshToken)
	r.Methods(http.MethodDelete).Path(paths.LogoutPath).HandlerFunc(authHandler.Logout)
}

func (r Router) mountCourseRoutes() {
	courseHandler := handlers.Course{Controller: r.controller}
	r.Role(types.RoleTeacher).Methods(http.MethodPost).Path(paths.CoursePath).HandlerFunc(courseHandler.Post)
	r.Role(types.RoleStudent).Methods(http.MethodGet).Path(paths.CoursePath).HandlerFunc(courseHandler.GetAll)
	r.Role(types.RoleStudent).Methods(http.MethodGet).Path(paths.CourseWithIDPath).HandlerFunc(courseHandler.Get)
	r.Role(types.RoleTeacher).Methods(http.MethodPatch).Path(paths.CourseWithIDPath).HandlerFunc(courseHandler.Patch)
	r.Role(types.RoleTeacher).Methods(http.MethodDelete).Path(paths.CourseWithIDPath).HandlerFunc(courseHandler.Delete)
}

func (r Router) mountAssignmentRoutes() {
	assignmentHandler := handlers.Assignment{Controller: r.controller}
	r.Role(types.RoleTeacher).Methods(http.MethodPost).Path(paths.AssignmentPath).HandlerFunc(assignmentHandler.Post)
	r.Role(types.RoleStudent).Methods(http.MethodGet).Path(paths.AssignmentPath).HandlerFunc(assignmentHandler.GetAll)
	r.Role(types.RoleStudent).Methods(http.MethodGet).Path(paths.AssignmentWithIDPath).HandlerFunc(assignmentHandler.Get)
	r.Role(types.RoleTeacher).Methods(http.MethodPatch).Path(paths.AssignmentWithIDPath).HandlerFunc(assignmentHandler.Patch)
	r.Role(types.RoleTeacher).Methods(http.MethodDelete).Path(paths.AssignmentWithIDPath).HandlerFunc(assignmentHandler.Delete)
}

func (r Router) mountSubmissionRoutes() {
	submissionHandler := handlers.Submission{Controller: r.controller}
	r.Role(types.RoleStudent).Methods(http.MethodPost).Path(paths.SubmissionPath).HandlerFunc(submissionHandler.Post)
	r.Role(types.RoleStudent).Methods(http.MethodGet).Path(paths.SubmissionPath).HandlerFunc(submissionHandler.GetAll)
	r.Role(types.RoleStudent).Methods(http.MethodGet).Path(paths.SubmissionWithIDPath).HandlerFunc(submissionHandler.Get)
}

func (r Router) mountUserCourseRoutes() {
	userCourseHandler := handlers.UserCourse{Controller: r.controller}
	r.Role(types.RoleTeacher).Methods(http.MethodPost).Path(paths.UserCoursePath).HandlerFunc(userCourseHandler.Post)
	r.Role(types.RoleTeacher).Methods(http.MethodGet).Path(paths.UserCoursePath).HandlerFunc(userCourseHandler.Get)
	r.Role(types.RoleTeacher).Methods(http.MethodPut).Path(paths.UserCoursePath).HandlerFunc(userCourseHandler.Put)
	r.Role(types.RoleTeacher).Methods(http.MethodDelete).Path(paths.UserCoursePath).HandlerFunc(userCourseHandler.Delete)
}
