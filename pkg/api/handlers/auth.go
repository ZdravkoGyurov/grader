package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/ZdravkoGyurov/grader/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/pkg/api/router/paths"
	"github.com/ZdravkoGyurov/grader/pkg/controller"
	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"
	"github.com/google/uuid"
)

const requiredScope = "read_user"

type Auth struct {
	Controller controller.Controller
}

func (a Auth) Login(writer http.ResponseWriter, request *http.Request) {
	gitlabOauthURL := fmt.Sprintf("https://%s/oauth/authorize", a.Controller.Config.Gitlab.Host)
	redirectURI := fmt.Sprintf(`http://%s%s`, a.Controller.Config.IngressHost, paths.GitlabLoginCallbackPath)
	url := fmt.Sprintf(
		"%s?client_id=%s&scope=%s&redirect_uri=%s&response_type=code&state=%s",
		gitlabOauthURL,
		a.Controller.Config.Gitlab.ClientID,
		requiredScope,
		redirectURI,
		uuid.NewString(),
	)

	http.Redirect(writer, request, url, http.StatusFound)
}

func (a Auth) LoginCallback(writer http.ResponseWriter, request *http.Request) {
	code := request.URL.Query().Get("code")
	if code == "" {
		err := errors.Newf("code query parameter should not be empty: %w", errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	accessToken, refreshToken, err := a.Controller.Login(request.Context(), code)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	fmt.Printf("\n\n >>> a.Controller.Config.UIIngressHost %s\n", a.Controller.Config.UIIngressHost)

	http.SetCookie(writer, &http.Cookie{
		Name:     "jid1",
		Value:    accessToken,
		HttpOnly: true,
		Domain:   a.Controller.Config.UIIngressHost,
		Path:     "/",
	})
	http.SetCookie(writer, &http.Cookie{
		Name:     "jid2",
		Value:    refreshToken,
		HttpOnly: true,
		Domain:   a.Controller.Config.UIIngressHost,
		Path:     "/",
	})

	uiURL := fmt.Sprintf("http://%s", a.Controller.Config.UIIngressHost)
	http.Redirect(writer, request, uiURL, http.StatusFound)
}

func (a Auth) GetUserInfo(writer http.ResponseWriter, request *http.Request) {
	accessTokenCookie, err := request.Cookie("jid1")
	if err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrNoAccessToken)
		response.SendError(writer, request, err)
		return
	}

	user, err := a.Controller.GetUserInfo(request.Context(), accessTokenCookie.Value)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}
	user.RefreshToken = ""

	response.SendData(writer, request, http.StatusOK, user)
}

func (a Auth) GetUsers(writer http.ResponseWriter, request *http.Request) {
	users, err := a.Controller.GetUsers(request.Context())
	if err != nil {
		response.SendError(writer, request, err)
		return
	}
	response.SendData(writer, request, http.StatusOK, users)
}

func (a Auth) PatchUserRole(writer http.ResponseWriter, request *http.Request) {
	user := types.User{}
	if err := json.NewDecoder(request.Body).Decode(&user); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	updatedUser, err := a.Controller.UpdateUserRole(request.Context(), &user)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}
	user.RefreshToken = ""

	response.SendData(writer, request, http.StatusOK, updatedUser)
}

func (a Auth) RefreshToken(writer http.ResponseWriter, request *http.Request) {
	refreshTokenCookie, err := request.Cookie("jid1")
	if err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrNoRefreshToken)
		response.SendError(writer, request, err)
		return
	}

	accessToken, err := a.Controller.GenerateAccessToken(request.Context(), refreshTokenCookie.Value)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	http.SetCookie(writer, &http.Cookie{
		Name:     "jid1",
		Value:    accessToken,
		HttpOnly: true,
		Domain:   a.Controller.Config.UIIngressHost,
		Path:     "/",
	})

	response.SendData(writer, request, http.StatusOK, struct{}{})
}

func (a Auth) Logout(writer http.ResponseWriter, request *http.Request) {
	accessTokenCookie, err := request.Cookie("jid1")
	if err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrNoAccessToken)
		response.SendError(writer, request, err)
		return
	}

	if err := a.Controller.DeleteUserRefreshToken(request.Context(), accessTokenCookie.Value); err != nil {
		response.SendError(writer, request, err)
		return
	}

	http.SetCookie(writer, &http.Cookie{
		Name:     "jid1",
		Value:    "",
		HttpOnly: true,
		Domain:   a.Controller.Config.UIIngressHost,
		Path:     "/",
		Expires:  time.Unix(0, 0),
	})
	http.SetCookie(writer, &http.Cookie{
		Name:     "jid2",
		Value:    "",
		HttpOnly: true,
		Domain:   a.Controller.Config.UIIngressHost,
		Path:     "/",
		Expires:  time.Unix(0, 0),
	})
}
