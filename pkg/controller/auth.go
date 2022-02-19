package controller

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/ZdravkoGyurov/grader/pkg/api/router/paths"
	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"

	"github.com/golang-jwt/jwt"
)

func (c *Controller) GenerateAccessToken(ctx context.Context, refreshToken string) (string, error) {
	claims, err := VerifyJWT(refreshToken, c.Config.Auth.RefreshTokenSecret)
	if err != nil {
		return "", errors.Newf("failed to verify refresh token: %w", err)
	}

	user, err := c.storage.GetUser(ctx, claims.Email)
	if err != nil {
		return "", errors.Newf("failed to get user: %w", err)
	}

	if user.RefreshToken != refreshToken {
		return "", errors.New("refresh token is invalid")
	}

	accessToken, err := c.createAccessToken(user)
	if err != nil {
		return "", errors.Newf("failed create access token: %w", err)
	}

	return accessToken, nil
}

func (c *Controller) GetUserInfo(ctx context.Context, accessToken string) (*types.User, error) {
	claims, err := VerifyJWT(accessToken, c.Config.Auth.AccessTokenSecret)
	if err != nil {
		return nil, errors.Newf("failed to verify access token: %w", err)
	}

	return c.storage.GetUser(ctx, claims.Email)
}

func (c *Controller) UpdateUserRole(ctx context.Context, updateUser *types.User) (*types.User, error) {
	if err := updateUser.ValidateUpdateRole(); err != nil {
		return nil, err
	}

	user, err := c.GetUser(ctx, updateUser.Email)
	if err != nil {
		return nil, errors.Newf("failed to get user: %w", err)
	}

	if user.RoleName == types.RoleAdmin {
		return nil, errors.Newf("cannot remove admin role: %w", errors.ErrInvalidEntity)
	}

	return c.storage.UpdateUserRole(ctx, updateUser)
}

func (c *Controller) GetUser(ctx context.Context, email string) (*types.User, error) {
	return c.storage.GetUser(ctx, email)
}

func (c *Controller) GetUsers(ctx context.Context) ([]types.User, error) {
	return c.storage.GetUsers(ctx)
}

func (c *Controller) Login(ctx context.Context, code string) (string, string, error) {
	accessToken, err := c.fetchGitlabAccessToken(ctx, code)
	if err != nil {
		return "", "", errors.Newf("failed to fetch access token from gitlab: %w", err)
	}

	gitlabUser, err := c.getGitlabUserInfo(ctx, accessToken)
	if err != nil {
		return "", "", errors.Newf("failed to fetch user info from gitlab: %w", err)
	}

	user, err := c.storage.GetUser(ctx, gitlabUser.Email)
	if err != nil {
		if !errors.Is(err, errors.ErrEntityNotFound) {
			return "", "", errors.Newf("failed to get user: %w", err)
		}

		refreshToken, err := c.createRefreshToken(gitlabUser.Email)
		if err != nil {
			return "", "", errors.Newf("failed to create refresh token: %w", err)
		}
		gitlabID := strconv.Itoa(gitlabUser.ID)
		user = &types.User{
			Email:        gitlabUser.Email,
			Name:         gitlabUser.Name,
			AvatarURL:    gitlabUser.AvatarURL,
			GitlabID:     gitlabID,
			RefreshToken: refreshToken,
			RoleName:     c.roleName(gitlabID),
		}
		if err := c.storage.CreateUser(ctx, user); err != nil {
			return "", "", errors.Newf("failed to create user: %w", err)
		}
	}

	if user.RefreshToken == "" {
		refreshToken, err := c.createRefreshToken(gitlabUser.Email)
		if err != nil {
			return "", "", errors.Newf("failed to generate new user refresh token: %w", err)
		}
		user.RefreshToken = refreshToken
		userWithRefreshToken := &types.User{
			Email:        gitlabUser.Email,
			RefreshToken: refreshToken,
		}
		if _, err := c.storage.UpdateUserRefreshToken(ctx, userWithRefreshToken); err != nil {
			return "", "", errors.Newf("failed to set new user refresh token: %w", err)
		}
	}

	userAccessToken, err := c.createAccessToken(user)
	if err != nil {
		return "", "", errors.Newf("failed to generate new user access token: %w", err)
	}

	return userAccessToken, user.RefreshToken, nil
}

func (c *Controller) DeleteUserRefreshToken(ctx context.Context, accessToken string) error {
	claims, err := VerifyJWT(accessToken, c.Config.Auth.AccessTokenSecret)
	if err != nil {
		return errors.Newf("failed to verify access token: %w", err)
	}

	user := &types.User{
		Email:        claims.Email,
		RefreshToken: "",
	}
	if _, err := c.storage.UpdateUserRefreshToken(ctx, user); err != nil {
		return err
	}

	return nil
}

func (c *Controller) createAccessToken(user *types.User) (string, error) {
	expiresAt := time.Now().Add(c.Config.Auth.AccessTokenExpirationTime)
	claims := types.JWTClaims{
		Email:    user.Email,
		Name:     user.Name,
		GitlabID: user.GitlabID,
		RoleName: user.RoleName,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiresAt.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(c.Config.Auth.AccessTokenSecret))
}

func (c *Controller) createRefreshToken(email string) (string, error) {
	expiresAt := time.Now().Add(c.Config.Auth.RefreshTokenExpirationTime)
	claims := types.JWTClaims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiresAt.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(c.Config.Auth.RefreshTokenSecret))
}

func (c *Controller) fetchGitlabAccessToken(ctx context.Context, code string) (string, error) {
	accessTokenReqBody := accessTokenReqBody{
		ClientID:     c.Config.Gitlab.ClientID,
		ClientSecret: c.Config.Gitlab.ClientSecret,
		Code:         code,
		RedirectURI:  fmt.Sprintf("http://%s%s", c.Config.IngressHost, paths.GitlabLoginCallbackPath),
	}
	return c.getGitlabAccessToken(ctx, accessTokenReqBody)
}

func (c *Controller) roleName(gitlabID string) types.Role {
	if gitlabID == c.Config.Gitlab.AdminUserID {
		return types.RoleAdmin
	}
	return types.RoleStudent
}
