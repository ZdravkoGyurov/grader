package types

import "github.com/golang-jwt/jwt"

type JWTClaims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}
