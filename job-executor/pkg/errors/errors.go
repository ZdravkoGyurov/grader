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

type HTTPErr struct {
	StatusCode int
	Err        error
}

func (e HTTPErr) Error() string {
	return fmt.Sprintf("%d - %s", e.StatusCode, e.Err)
}
