package log

import (
	"net/http"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

const (
	CorrelationIDHeader    = "X-Correlation-Id"
	correlationIDAttribute = "correlationId"
	componentAttribute     = "component"
	component              = "job-executor"
)

var logger zerolog.Logger

func init() {
	loggerOutput := zerolog.NewConsoleWriter() // os.Stdout for json logging
	logger = zerolog.New(loggerOutput).With().Timestamp().Str(componentAttribute, component).Logger()
}

func SetCorrelationID(logger *zerolog.Logger, correlationID string) {
	logger.UpdateContext(func(logCtx zerolog.Context) zerolog.Context {
		return logCtx.Str(correlationIDAttribute, correlationID)
	})
}

func DefaultLogger() *zerolog.Logger {
	return &logger
}

func RequestLogger(r *http.Request) *zerolog.Logger {
	return log.Ctx(r.Context())
}

var CtxLogger = log.Ctx
