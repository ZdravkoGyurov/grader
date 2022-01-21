package controller

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ZdravkoGyurov/grader/pkg/errors"
)

const (
	gitlabTokenPath = "/oauth/token"
	gitlabUserPath  = "/api/v4/user"
)

type submissionReqBody struct {
	ID string `json:"submissionId"`
}

type accessTokenReqBody struct {
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	Code         string `json:"code"`
	RedirectURI  string `json:"redirect_uri"`
}

type gitlabUser struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	AvatarURL string `json:"avatar_url"`
}

type gitlabAccessToken struct {
	AccessToken string `json:"access_token"`
}

func (c *Controller) createJobRun(ctx context.Context, submissionID string) error {
	submissionReqBody := submissionReqBody{
		ID: submissionID,
	}
	submissionReqJSON, err := json.Marshal(submissionReqBody)
	if err != nil {
		return errors.Newf("failed to marshal submission request body:%w", err)
	}

	body := bytes.NewBuffer(submissionReqJSON)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.Config.JobExecutor.URL, body)
	if err != nil {
		return errors.Newf("failed to create job executor request :%w", err)
	}

	response, err := c.client.Do(req)
	if err != nil {
		return errors.Newf("failed to call job executor:%w", err)
	}

	if response.StatusCode != http.StatusAccepted {
		return errors.Newf("failed to call job executor, status: %d", response.StatusCode)
	}

	return nil
}

func (c *Controller) getGitlabAccessToken(ctx context.Context, accessTokenReqBody accessTokenReqBody) (string, error) {
	gitlabTokenEndpoint := fmt.Sprintf("https://%s%s", c.Config.Gitlab.Host, gitlabTokenPath)
	exchangeURL := fmt.Sprintf("%s?client_id=%s&client_secret=%s&code=%s&grant_type=authorization_code&redirect_uri=%s",
		gitlabTokenEndpoint, accessTokenReqBody.ClientID, accessTokenReqBody.ClientSecret, accessTokenReqBody.Code, accessTokenReqBody.RedirectURI)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, exchangeURL, nil)
	if err != nil {
		return "", errors.Newf("failed to create gitlab token request :%w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	response, err := c.client.Do(req)
	if err != nil {
		return "", errors.Newf("failed to call gitlab: %w", err)
	}

	if response.StatusCode != http.StatusOK {
		return "", errors.Newf("failed to call gitlab, status: %d", response.StatusCode)
	}

	gitlabAccessToken := gitlabAccessToken{}
	if err := json.NewDecoder(response.Body).Decode(&gitlabAccessToken); err != nil {
		return "", errors.Newf("failed to decode gitlab access token: %w", err)
	}

	return gitlabAccessToken.AccessToken, nil
}

func (c *Controller) getGitlabUserInfo(ctx context.Context, accessToken string) (gitlabUser, error) {
	gitlabUserEndpoint := fmt.Sprintf("https://%s%s", c.Config.Gitlab.Host, gitlabUserPath)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, gitlabUserEndpoint, nil)
	if err != nil {
		return gitlabUser{}, errors.Newf("failed to create gitlab user request: %w", err)
	}
	setGitlabHeaders(req, accessToken)

	response, err := c.client.Do(req)
	if err != nil {
		return gitlabUser{}, errors.Newf("failed to call gitlab user endpoint: %w", err)
	}

	if response.StatusCode != http.StatusOK {
		return gitlabUser{}, errors.Newf("failed to call gitlab user endpoint, status: %d", response.StatusCode)
	}

	gitlabUser := gitlabUser{}
	if err := json.NewDecoder(response.Body).Decode(&gitlabUser); err != nil {
		return gitlabUser, errors.Newf("failed to decode gitlab user: %w", err)
	}

	return gitlabUser, nil
}

func setGitlabHeaders(req *http.Request, accessToken string) {
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	req.Header.Add("User-Agent", "golang")
}
