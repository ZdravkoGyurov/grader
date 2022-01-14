package middlewares

import (
	"net/http"

	"github.com/ZdravkoGyurov/grader/pkg/api/req"
	"github.com/ZdravkoGyurov/grader/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/pkg/config"
	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"
	"github.com/golang-jwt/jwt"
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
		claims := &types.JWTClaims{}
		token, err := jwt.ParseWithClaims(accessToken, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(a.AuthConfig.AccessTokenString), nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				err = errors.Newf("invalid token signature %s: %w", err, errors.ErrInvalidAccessToken)
				response.SendError(writer, request, err)
				return
			}

			err = errors.Newf("failed to validate token signature %s: %w", err, errors.ErrInvalidAccessToken)
			response.SendError(writer, request, err)
			return
		}

		if !token.Valid {
			err = errors.Newf("invalid token %s: %w", err, errors.ErrInvalidAccessToken)
			response.SendError(writer, request, err)
			return
		}

		request = req.AddUserData(request, req.UserData{
			Email: claims.Email,
		})

		next.ServeHTTP(writer, request)
	})
}
