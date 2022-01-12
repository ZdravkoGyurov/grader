package executor

import (
	"context"
	"sync"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/config"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
)

type job struct {
	exec func()
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
	for i := 0; i < e.cfg.MaxWorkers; i++ {
		e.startWorker()
	}
}

func (e *Executor) QueueJob(ctx context.Context, exec func()) error {
	if e.stopped {
		return errors.New("executor is stopped")
	}

	j := job{exec: exec}

	select {
	case e.jobs <- j:
		return nil
	default:
		// channel is full
		return errors.ErrTooManyRequests
	}
}

func (e *Executor) startWorker() {
	e.wg.Add(1)
	go func() {
		defer e.wg.Done()

		for job := range e.jobs {
			job.exec()
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
