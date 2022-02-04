package controller

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/ZdravkoGyurov/grader/pkg/errors"
)

const (
	gitlabTokenPath          = "/oauth/token"
	gitlabUserPath           = "/api/v4/user"
	gitlabGroupsPath         = "/api/v4/groups"
	gitlabProjectsPath       = "/api/v4/projects"
	gitlabProjectMembersPath = "/api/v4/projects/%s/members"

	privateVisibility          = "private"
	developerAccessLevel       = 30
	gitlabPrivateTokenHeader   = "PRIVATE-TOKEN"
	contentTypeHeader          = "Content-Type"
	contentTypeApplicationJSON = "application/json"
)

type submissionReqBody struct {
	ID string `json:"submissionId"`
}

type createAssignmentReqBody struct {
	CourseGroup     string `json:"courseGroup"`
	AssignmentPaths string `json:"assignmentPaths"`
	GitlabUsernames string `json:"gitlabUsernames"`
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

type subgroupReqBody struct {
	Name       string `json:"name"`
	Path       string `json:"path"`
	ParentID   string `json:"parent_id"`
	Visibility string `json:"visibility"`
}

type subgroupResponseBody struct {
	ID int `json:"id"`
}

type projectReqBody struct {
	Name        string `json:"name"`
	Path        string `json:"path"`
	NamespaceID string `json:"namespace_id"`
	Visibility  string `json:"visibility"`
}

type projectResponseBody struct {
	ID int `json:"id"`
}

type projectMembersReqBody struct {
	UserID      string `json:"user_id"`
	AccessLevel int    `json:"access_level"`
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
	url := fmt.Sprintf("%s%s", c.Config.JobExecutor.Host, "/job")
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, body)
	if err != nil {
		return errors.Newf("failed to create job executor request :%w", err)
	}

	response, err := c.client.Do(req)
	if err != nil {
		return errors.Newf("failed to call job executor:%w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusAccepted {
		return errors.Newf("failed to call job executor, status: %d", response.StatusCode)
	}

	return nil
}

func (c *Controller) createGitlabAssignments(ctx context.Context, courseGroup, assignmentPaths, gitlabUsernames string) error {

	createAssignmentReqBody := createAssignmentReqBody{
		CourseGroup:     courseGroup,
		AssignmentPaths: assignmentPaths,
		GitlabUsernames: gitlabUsernames,
	}
	createAssignmentReqJSON, err := json.Marshal(createAssignmentReqBody)
	if err != nil {
		return errors.Newf("failed to marshal create gitlab assignment request body:%w", err)
	}

	body := bytes.NewBuffer(createAssignmentReqJSON)
	url := fmt.Sprintf("%s%s", c.Config.JobExecutor.Host, "/assignment")
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, body)
	if err != nil {
		return errors.Newf("failed to create gitlab assignment request :%w", err)
	}

	response, err := c.client.Do(req)
	if err != nil {
		return errors.Newf("failed to call job executor:%w", err)
	}
	defer response.Body.Close()

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
	defer response.Body.Close()

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
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return gitlabUser{}, errors.Newf("failed to call gitlab user endpoint, status: %d", response.StatusCode)
	}

	gitlabUser := gitlabUser{}
	if err := json.NewDecoder(response.Body).Decode(&gitlabUser); err != nil {
		return gitlabUser, errors.Newf("failed to decode gitlab user: %w", err)
	}

	return gitlabUser, nil
}

func (c *Controller) getGitlabGroup(ctx context.Context, gitlabName string) (string, bool, error) {
	gitlabGroupsEndpoint := fmt.Sprintf("https://%s%s/%s/subgroups?search=%s",
		c.Config.Gitlab.Host, gitlabGroupsPath, c.Config.Gitlab.GroupParentID, gitlabName)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, gitlabGroupsEndpoint, nil)
	if err != nil {
		return "", false, errors.Newf("failed to create course subgroup get request :%w", err)
	}
	req.Header.Add(gitlabPrivateTokenHeader, c.Config.Gitlab.PAT)
	req.Header.Add(contentTypeHeader, contentTypeApplicationJSON)

	response, err := c.client.Do(req)
	if err != nil {
		return "", false, errors.Newf("failed to call gitlab groups endpoint: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return "", false, errors.Newf("failed to call gitlab groups endpoint, status: %d", response.StatusCode)
	}

	subgroups := []subgroupResponseBody{}
	if err := json.NewDecoder(response.Body).Decode(&subgroups); err != nil {
		return "", false, errors.Newf("failed to decode gitlab subgroup: %w", err)
	}

	if len(subgroups) != 1 {
		return "", false, nil
	}

	return strconv.Itoa(subgroups[0].ID), true, nil
}

func (c *Controller) createGitlabGroup(ctx context.Context, name, gitlabName string) (string, error) {
	subgroupReqBody := subgroupReqBody{
		Name:       name,
		Path:       gitlabName,
		ParentID:   c.Config.Gitlab.GroupParentID,
		Visibility: privateVisibility,
	}
	subgroupReqJSON, err := json.Marshal(subgroupReqBody)
	if err != nil {
		return "", errors.Newf("failed to marshal course subgroup request body:%w", err)
	}

	gitlabGroupsEndpoint := fmt.Sprintf("https://%s%s", c.Config.Gitlab.Host, gitlabGroupsPath)
	body := bytes.NewBuffer(subgroupReqJSON)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, gitlabGroupsEndpoint, body)
	if err != nil {
		return "", errors.Newf("failed to create course subgroup post request :%w", err)
	}
	req.Header.Add(gitlabPrivateTokenHeader, c.Config.Gitlab.PAT)
	req.Header.Add(contentTypeHeader, contentTypeApplicationJSON)

	response, err := c.client.Do(req)
	if err != nil {
		return "", errors.Newf("failed to call gitlab groups endpoint: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusCreated {
		return "", errors.Newf("failed to call gitlab groups endpoint, status: %d", response.StatusCode)
	}

	subgroup := subgroupResponseBody{}
	if err := json.NewDecoder(response.Body).Decode(&subgroup); err != nil {
		return "", errors.Newf("failed to decode gitlab subgroup: %w", err)
	}

	return strconv.Itoa(subgroup.ID), nil
}

func (c *Controller) getGitlabProject(ctx context.Context, user, groupID string) (string, bool, error) {
	gitlabGroupsEndpoint := fmt.Sprintf("https://%s%s/%s/projects?search=%s",
		c.Config.Gitlab.Host, gitlabGroupsPath, groupID, user)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, gitlabGroupsEndpoint, nil)
	if err != nil {
		return "", false, errors.Newf("failed to create course subgroup get request :%w", err)
	}
	req.Header.Add(gitlabPrivateTokenHeader, c.Config.Gitlab.PAT)
	req.Header.Add(contentTypeHeader, contentTypeApplicationJSON)

	response, err := c.client.Do(req)
	if err != nil {
		return "", false, errors.Newf("failed to call gitlab groups endpoint: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return "", false, errors.Newf("failed to call gitlab groups endpoint, status: %d", response.StatusCode)
	}

	projects := []projectResponseBody{}
	if err := json.NewDecoder(response.Body).Decode(&projects); err != nil {
		return "", false, errors.Newf("failed to decode gitlab subgroup: %w", err)
	}

	if len(projects) != 1 {
		return "", false, nil
	}

	return strconv.Itoa(projects[0].ID), true, nil
}

func (c *Controller) createGitlabProject(ctx context.Context, user, groupID string) (string, error) {
	projectReqBody := projectReqBody{
		Name:        user,
		Path:        user,
		NamespaceID: groupID,
		Visibility:  privateVisibility,
	}
	projectReqJSON, err := json.Marshal(projectReqBody)
	if err != nil {
		return "", errors.Newf("failed to marshal course user project request body:%w", err)
	}

	gitlabProjectsEndpoint := fmt.Sprintf("https://%s%s", c.Config.Gitlab.Host, gitlabProjectsPath)
	body := bytes.NewBuffer(projectReqJSON)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, gitlabProjectsEndpoint, body)
	if err != nil {
		return "", errors.Newf("failed to create course user project post request :%w", err)
	}
	req.Header.Add(gitlabPrivateTokenHeader, c.Config.Gitlab.PAT)
	req.Header.Add(contentTypeHeader, contentTypeApplicationJSON)

	response, err := c.client.Do(req)
	if err != nil {
		return "", errors.Newf("failed to call gitlab projects endpoint: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusCreated {
		return "", errors.Newf("failed to call gitlab projects endpoint, status: %d", response.StatusCode)
	}

	project := projectResponseBody{}
	if err := json.NewDecoder(response.Body).Decode(&project); err != nil {
		return "", errors.Newf("failed to decode gitlab project: %w", err)
	}

	return strconv.Itoa(project.ID), nil
}

func (c *Controller) addUserInGitlabProject(ctx context.Context, userID, projectID string) error {
	projectMembersReqBody := projectMembersReqBody{
		UserID:      userID,
		AccessLevel: developerAccessLevel,
	}
	projectMembersReqJSON, err := json.Marshal(projectMembersReqBody)
	if err != nil {
		return errors.Newf("failed to marshal project members request body:%w", err)
	}

	path := fmt.Sprintf(gitlabProjectMembersPath, projectID)
	gitlabProjectMembersEndpoint := fmt.Sprintf("https://%s%s", c.Config.Gitlab.Host, path)
	body := bytes.NewBuffer(projectMembersReqJSON)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, gitlabProjectMembersEndpoint, body)
	if err != nil {
		return errors.Newf("failed to create project members post request :%w", err)
	}
	req.Header.Add(gitlabPrivateTokenHeader, c.Config.Gitlab.PAT)
	req.Header.Add(contentTypeHeader, contentTypeApplicationJSON)

	response, err := c.client.Do(req)
	if err != nil {
		return errors.Newf("failed to call gitlab project members endpoint: %w", err)
	}
	defer response.Body.Close()

	responseBytes, err := io.ReadAll(response.Body)
	if err != nil {
		return errors.Newf("failed to read gitlab project members response: %w", err)
	}

	if response.StatusCode != http.StatusCreated && !alreadyMember(response.StatusCode, string(responseBytes)) {
		return errors.Newf("failed to call gitlab project members endpoint, status: %d", response.StatusCode)
	}

	return nil
}

func alreadyMember(status int, response string) bool {
	return (status == http.StatusBadRequest && strings.Contains(response, "inherited membership")) ||
		(status == http.StatusConflict && strings.Contains(response, "Member already exists"))
}

func setGitlabHeaders(req *http.Request, accessToken string) {
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	req.Header.Add("User-Agent", "golang")
}
