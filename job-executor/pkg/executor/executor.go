package executor

import (
	"context"
	"sync"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/config"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
	"github.com/google/uuid"

	"github.com/rs/zerolog"
)

type job struct {
	id     string
	name   string
	exec   func()
	logger *zerolog.Logger
}

type Executor struct {
	wg      sync.WaitGroup
	jobs    chan job
	stopped bool
	cfg     config.Executor
}

// New creates an executor with workers
func New(cfg config.Executor) *Executor {
	return &Executor{
		wg:      sync.WaitGroup{},
		jobs:    make(chan job, cfg.MaxConcurrentJobs),
		stopped: false,
		cfg:     cfg,
	}
}

func (e *Executor) Start() {
	e.wg.Add(e.cfg.MaxWorkers)
	for i := 0; i < e.cfg.MaxWorkers; i++ {
		e.startWorker()
	}
}

func (e *Executor) QueueJob(ctx context.Context, name string, exec func()) error {
	if e.stopped {
		return errors.New("executor is stopped")
	}

	j := job{
		id:     uuid.NewString(),
		name:   name,
		exec:   exec,
		logger: log.CtxLogger(ctx),
	}

	select {
	case e.jobs <- j:
		j.logger.Info().Msgf("enqueued job %s '%s'\n", j.id, j.name)
		return nil
	default:
		return errors.New("channel is full")
	}
}

func (e *Executor) startWorker() {
	go func() {
		defer e.wg.Done()

		for job := range e.jobs {
			job.logger.Info().Msgf("executing job %s\n", job.id)
			job.exec()
			job.logger.Info().Msgf("finished job %s\n", job.id)
		}
	}()
}

// Stop the executor, waits for all jobs to finish
func (e *Executor) Stop() {
	if !e.stopped {
		e.stopped = true
		close(e.jobs)
		e.wg.Wait()
	}
}
