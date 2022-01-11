package response

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
)

func SendData(writer http.ResponseWriter, request *http.Request, status int, data interface{}) {
	jsonBytes, err := json.Marshal(data)
	if err != nil {
		respondInternalError(writer, request)
		log.RequestLogger(request).Error().Msgf("failed to marshal response %+v", data)
		return
	}
	respond(writer, request, status, jsonBytes)
}

func SendError(writer http.ResponseWriter, request *http.Request, err error) {
	logger := log.RequestLogger(request)
	if err == nil {
		logger.Error().Msg("failed to return nil error")
		respondInternalError(writer, request)
		return
	}

	httpErr := &errors.HTTPErr{}
	if errors.As(err, httpErr) {
		logger.Err(err).Send()
		respondInternalError(writer, request)
		return
	}

	if httpErr.StatusCode == http.StatusInternalServerError {
		respondInternalError(writer, request)
		return
	}

	logger.Err(err).Send()
	respondError(writer, request, httpErr.StatusCode, err.Error())
}

func respondInternalError(writer http.ResponseWriter, request *http.Request) {
	errorMsg := http.StatusText(http.StatusInternalServerError)
	respondError(writer, request, http.StatusInternalServerError, errorMsg)
}

func respondError(writer http.ResponseWriter, request *http.Request, status int, errorMsg string) {
	response := fmt.Sprintf(`{"error":"%s", "statusCode": "%d"}`, errorMsg, status)
	respond(writer, request, status, []byte(response))
}

func respond(writer http.ResponseWriter, request *http.Request, status int, jsonBytes []byte) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	writer.Write(jsonBytes)
	log.RequestLogger(request).Info().Msgf("responded with %d - %s", status, string(jsonBytes))
}
