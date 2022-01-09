package handlers

import (
	"net/http"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/controller"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/log"
	"github.com/google/uuid"
)

type Job struct {
	Controller *controller.Controller
}

func (h *Job) Post(writer http.ResponseWriter, request *http.Request) {
	logger := log.RequestLogger(request)
	logger.Info().Msg("creating a new job")

	// TODO get submissionID from body
	submissionID := uuid.NewString()

	if err := h.Controller.ExecJob(request.Context(), submissionID); err != nil {
		response.SendError(writer, request, http.StatusInternalServerError, err)
		return
	}

	response.SendData(writer, request, http.StatusAccepted, struct{}{})
}
