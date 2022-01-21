package middlewares

import (
	"net/http"

	"github.com/ZdravkoGyurov/grader/pkg/api/req"
	"github.com/ZdravkoGyurov/grader/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/pkg/controller"
	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"
)

type Authorizer struct {
	Controller controller.Controller
}

func (a *Authorizer) Authorize(requiredRoleName types.Role) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
			userData, ok := req.GetUserData(request)
			if !ok {
				response.SendError(writer, request, errors.New("failed to extract user data"))
				return
			}

			user, err := a.Controller.GetUser(request.Context(), userData.Email)
			if err != nil {
				response.SendError(writer, request, err)
				return
			}

			if comparableRole(user.RoleName) < comparableRole(requiredRoleName) {
				response.SendError(writer, request, errors.ErrUnauthorized)
				return
			}

			req.AddUserData(request, req.UserData{
				Email:    user.Email,
				Name:     user.Name,
				GitlabID: user.GitlabID,
				RoleName: user.RoleName,
			})

			next.ServeHTTP(writer, request)
		})
	}
}

func comparableRole(role types.Role) int {
	switch role {
	case types.RoleStudent:
		return 1
	case types.RoleTeacher:
		return 2
	case types.RoleAdmin:
		return 3
	default:
		panic("invalid role")
	}
}
