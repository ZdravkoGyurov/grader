package app

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/api/router"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/config"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/controller"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/executor"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/storage"
)

type GlobalContext struct {
	Context context.Context
	Cancel  context.CancelFunc
}

func NewGlobalContext() GlobalContext {
	ctx, cancel := context.WithCancel(context.Background())
	return GlobalContext{
		Context: ctx,
		Cancel:  cancel,
	}
}

type Application struct {
	appContext GlobalContext
	config     config.Config
	server     *http.Server
	storage    *storage.Storage
	executor   *executor.Executor
}

func New(cfg config.Config) (*Application, error) {
	globalContext := NewGlobalContext()

	storage := storage.New(cfg.DB)

	executor := executor.New(cfg.Executor)

	ctrl, err := controller.New(cfg, storage, executor)
	if err != nil {
		return nil, err
	}
	r := router.New(ctrl)

	server := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Handler:      r,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	return &Application{
		appContext: globalContext,
		config:     cfg,
		server:     server,
		storage:    storage,
		executor:   executor,
	}, nil
}

func (a *Application) Start() error {
	logger := log.DefaultLogger()
	logger.Info().Msg("starting application...")
	a.setupSignalNotifier()

	if err := a.storage.Connect(a.appContext.Context); err != nil {
		return err
	}
	logger.Info().Msg("storage connection opened")

	a.executor.Start()
	logger.Info().Msg("job executor started")

	logger.Info().Msg("server started")
	go func() {
		if err := a.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Err(err).Msg("failed listen and serve")
		}
	}()

	logger.Info().Msg("application started")

	<-a.appContext.Context.Done()

	a.stopServer()
	a.stopExecutor()
	a.closeStorageConnection()
	logger.Info().Msg("application stopped")
	return nil
}

func (a *Application) Stop() {
	a.appContext.Cancel()
}

func (a *Application) setupSignalNotifier() {
	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-signalChannel
		log.DefaultLogger().Info().Msg("stopping application...")
		a.appContext.Cancel()
	}()
}

func (a *Application) closeStorageConnection() {
	a.storage.Close()
	log.DefaultLogger().Info().Msg("storage connection closed")
}

func (a *Application) stopServer() {
	logger := log.DefaultLogger()
	ctx, cancel := context.WithTimeout(context.Background(), a.config.Server.ShutdownTimeout)
	defer cancel()
	if err := a.server.Shutdown(ctx); err != nil {
		logger.Err(err).Msg("failed to stop server")
	}
	logger.Info().Msg("server stopped")
}

func (a *Application) stopExecutor() {
	a.executor.Stop()
	log.DefaultLogger().Info().Msg("job executor stopped")
}
