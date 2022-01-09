package middlewares

import (
	"fmt"
	"net/http"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/api/response"
)

func PanicRecovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		defer func() {
			panicErr := recover()
			if panicErr != nil {
				err := fmt.Errorf("recovered from panic: %s", panicErr)
				response.SendError(writer, request, http.StatusInternalServerError, err)
			}
		}()

		next.ServeHTTP(writer, request)
	})
}
