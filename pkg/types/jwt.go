package types

import "github.com/golang-jwt/jwt"

type JWTClaims struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	GitlabID string `json:"gitlabId"`
	RoleName Role   `json:"roleName"`
	jwt.StandardClaims
}
