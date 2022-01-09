package storage

import (
	"net/http"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/jackc/pgconn"
	"github.com/jackc/pgx"
)

const (
	foreignKeyViolation = "23503"
	uniqueViolation     = "23505"
)

var errNoRowsAffected = errors.New("no rows affected")

func mapDBError(err error) error {
	if errors.Is(err, pgx.ErrNoRows) || errors.Is(err, errNoRowsAffected) {
		return errors.HTTPErr{StatusCode: http.StatusNotFound, Err: err}
	}

	var pgxErr *pgconn.PgError
	if ok := errors.As(err, &pgxErr); ok {
		switch pgxErr.Code {
		case uniqueViolation:
			return errors.HTTPErr{StatusCode: http.StatusConflict, Err: err}
		case foreignKeyViolation:
			return errors.HTTPErr{StatusCode: http.StatusNotFound, Err: err}
		}
	}

	return errors.HTTPErr{StatusCode: http.StatusInternalServerError, Err: err}
}
