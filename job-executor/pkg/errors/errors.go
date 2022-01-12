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
	ErrEntityNotFound      = errors.New("entity not found")
	ErrRefEntityNotFound   = errors.New("referenced entity not found")
	ErrEntityAlreadyExists = errors.New("entity already exists")
	ErrTooManyRequests     = errors.New("too many requests")
)
