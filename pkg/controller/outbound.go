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
	githubTokenUrl           = "https://github.com/login/oauth/access_token"
	githubUserEndpoint       = "https://api.github.com/user"
	githubUserEmailsEndpoint = "https://api.github.com/user/emails"
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

type githubUser struct {
	Name      string `json:"login"`
	AvatarURL string `json:"avatar_url"`
}

type githubEmail struct {
	Email   string `json:"email"`
	Primary bool   `json:"primary"`
}

type githubAccessToken struct {
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

func (c *Controller) getGithubAccessToken(ctx context.Context, accessTokenReqBody accessTokenReqBody) (string, error) {
	accessTokenJSON, err := json.Marshal(accessTokenReqBody)
	if err != nil {
		return "", errors.Newf("failed to marshal access token request body:%w", err)
	}

	body := bytes.NewBuffer(accessTokenJSON)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, githubTokenUrl, body)
	if err != nil {
		return "", errors.Newf("failed to create github token request :%w", err)
	}

	response, err := c.client.Do(req)
	if err != nil {
		return "", errors.Newf("failed to call github:%w", err)
	}

	if response.StatusCode != http.StatusOK {
		return "", errors.Newf("failed to call github, status: %d", response.StatusCode)
	}

	var githubAccessToken *githubAccessToken
	if err := json.NewDecoder(response.Body).Decode(githubAccessToken); err != nil {
		return "", errors.Newf("failed to decode github access token: %w", err)
	}

	return githubAccessToken.AccessToken, nil
}

func (c *Controller) getGithubUserInfo(ctx context.Context, accessToken string) (*githubUser, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, githubUserEndpoint, nil)
	if err != nil {
		return nil, errors.Newf("failed to create github user request: %w", err)
	}
	setGithubHeaders(req, accessToken)

	response, err := c.client.Do(req)
	if err != nil {
		return nil, errors.Newf("failed to call github user endpoint: %w", err)
	}

	if response.StatusCode != http.StatusOK {
		return nil, errors.Newf("failed to call github emails endpoint, status: %d", response.StatusCode)
	}

	var githubUser *githubUser
	if err := json.NewDecoder(response.Body).Decode(githubUser); err != nil {
		return nil, errors.Newf("failed to decode github user: %w", err)
	}

	return githubUser, nil
}

func (c *Controller) getGithubUserEmail(ctx context.Context, accessToken string) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, githubUserEmailsEndpoint, nil)
	if err != nil {
		return "", errors.Newf("failed to create github emails request: %w", err)
	}
	setGithubHeaders(req, accessToken)

	response, err := c.client.Do(req)
	if err != nil {
		return "", errors.Newf("failed to call github emails endpoint: %w", err)
	}

	if response.StatusCode != http.StatusOK {
		return "", errors.Newf("failed to call github emails endpoint, status: %d", response.StatusCode)
	}

	var emails []githubEmail
	if err := json.NewDecoder(response.Body).Decode(&emails); err != nil {
		return "", errors.Newf("failed to decode github emails: %w", err)
	}

	return getPrimaryEmail(emails)
}

func getPrimaryEmail(emails []githubEmail) (string, error) {
	for _, email := range emails {
		if email.Primary {
			return email.Email, nil
		}
	}
	return "", errors.New("no primary email")
}

func setGithubHeaders(req *http.Request, accessToken string) {
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	req.Header.Add("User-Agent", "golang")
}
