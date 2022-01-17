package middlewares

import (
	"net/http"

	"github.com/ZdravkoGyurov/grader/pkg/api/req"
	"github.com/ZdravkoGyurov/grader/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/pkg/config"
	"github.com/ZdravkoGyurov/grader/pkg/controller"
	"github.com/ZdravkoGyurov/grader/pkg/errors"
)

const accessTokenCookieName = "jid1"

type Authenticator struct {
	AuthConfig config.Auth
}

func (a *Authenticator) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		accessTokenCookie, err := request.Cookie(accessTokenCookieName)
		if err != nil {
			response.SendError(writer, request, errors.ErrNoAccessToken)
			return
		}

		accessToken := accessTokenCookie.Value
		claims, err := controller.VerifyJWT(accessToken, a.AuthConfig.AccessTokenSecret)
		if err != nil {
			response.SendError(writer, request, err)
			return
		}

		req.AddUserData(request, req.UserData{
			Email: claims.Email,
		})

		next.ServeHTTP(writer, request)
	})
}
