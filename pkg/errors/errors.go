package errors

import (
	"errors"
	"fmt"
)

var (
	As   = errors.As
	Is   = errors.Is
	New  = errors.New
	Newf = fmt.Errorf
)

var (
	ErrInvalidEntity       = errors.New("entity is invalid")
	ErrNoAccessToken       = errors.New("missing access token")
	ErrInvalidAccessToken  = errors.New("invalid access token")
	ErrUnauthorized        = errors.New("unauthorized")
	ErrEntityNotFound      = errors.New("entity not found")
	ErrRefEntityNotFound   = errors.New("referenced entity not found")
	ErrEntityAlreadyExists = errors.New("entity already exists")
)
