package middlewares

import (
	"net/http"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
)

func PanicRecovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		defer func() {
			panicErr := recover()
			if panicErr != nil {
				err := errors.Newf("recovered from panic: %s", panicErr)
				response.SendError(writer, request, err)
			}
		}()

		next.ServeHTTP(writer, request)
	})
}
