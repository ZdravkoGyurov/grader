package controller

import (
	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"
	"github.com/golang-jwt/jwt"
)

func VerifyJWT(jwtToken, secret string) (types.JWTClaims, error) {
	claims := types.JWTClaims{}
	token, err := jwt.ParseWithClaims(jwtToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			err = errors.Newf("invalid token signature %s: %w", err, errors.ErrInvalidAccessToken)
			return types.JWTClaims{}, err
		}

		err = errors.Newf("failed to validate token signature %s: %w", err, errors.ErrInvalidAccessToken)
		return types.JWTClaims{}, err
	}

	if !token.Valid {
		err = errors.Newf("invalid token %s: %w", err, errors.ErrInvalidAccessToken)
		return types.JWTClaims{}, err
	}

	return claims, nil
}
