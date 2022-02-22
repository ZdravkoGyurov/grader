package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/controller"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/types"
)

type Job struct {
	Controller *controller.Controller
}

func (h *Job) Post(writer http.ResponseWriter, request *http.Request) {
	submission := types.SubmissionBody{}
	if err := json.NewDecoder(request.Body).Decode(&submission); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	if err := h.Controller.RunTests(request.Context(), submission.ID); err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusAccepted, struct{}{})
}
