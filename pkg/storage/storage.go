package storage

import (
	"context"

	"github.com/ZdravkoGyurov/grader/pkg/config"
	"github.com/ZdravkoGyurov/grader/pkg/errors"

	"github.com/jackc/pgx/v4/pgxpool"
)

type Storage struct {
	pool *pgxpool.Pool
	cfg  config.DB
}

func New(cfg config.DB) *Storage {
	return &Storage{
		cfg: cfg,
	}
}

func (s *Storage) Connect(ctx context.Context) error {
	connectCtx, connectCtxCancel := context.WithTimeout(ctx, s.cfg.ConnectTimeout)
	defer connectCtxCancel()

	pool, err := pgxpool.Connect(connectCtx, s.cfg.URI)
	if err != nil {
		return errors.Newf("could not create postgresql connection pool: %w", err)
	}

	s.pool = pool

	return nil
}

func (s *Storage) Close() {
	s.pool.Close()
}
