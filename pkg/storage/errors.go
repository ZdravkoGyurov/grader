package storage

import (
	"github.com/ZdravkoGyurov/grader/pkg/errors"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx"
)

const (
	foreignKeyViolation = "23503"
	uniqueViolation     = "23505"
)

func dbError(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return errors.ErrEntityNotFound
	}

	var pgxErr *pgconn.PgError
	if ok := errors.As(err, &pgxErr); ok {
		switch pgxErr.Code {
		case uniqueViolation:
			return errors.ErrEntityAlreadyExists
		case foreignKeyViolation:
			return errors.ErrRefEntityNotFound
		}
	}

	return err
}
