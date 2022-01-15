package storage

import (
	"context"

	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/log"

	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
)

func inTransaction(ctx context.Context, pool *pgxpool.Pool, txSteps func(tx pgx.Tx) error) error {
	tx, err := pool.Begin(ctx)
	if err != nil {
		return errors.Newf("failed to create transaction: %w", err)
	}

	ok := false
	defer func() {
		if !ok {
			rollbackTransaction(ctx, tx)
		}
	}()

	if err = txSteps(tx); err != nil {
		return err
	}

	if err = tx.Commit(ctx); err != nil {
		return err
	}

	ok = true
	return nil
}

func rollbackTransaction(ctx context.Context, transaction pgx.Tx) {
	logger := log.CtxLogger(ctx)
	logger.Debug().Msg("rolling back transaction")
	if err := transaction.Rollback(ctx); err != nil {
		logger.Err(err).Msg("failed to rollback transaction")
	}
}
