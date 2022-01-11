package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/controller"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/dexec"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
)

type Job struct {
	Controller *controller.Controller
}

func (h *Job) Post(writer http.ResponseWriter, request *http.Request) {
	testsRunConfig := dexec.TestsRunConfig{}
	if err := json.NewDecoder(request.Body).Decode(&testsRunConfig); err != nil {
		err = errors.HTTPErr{StatusCode: http.StatusBadRequest, Err: err}
		response.SendError(writer, request, err)
		return
	}

	if err := testsRunConfig.Validate(); err != nil {
		err = errors.HTTPErr{StatusCode: http.StatusBadRequest, Err: errors.Newf("invalid tests config: %w", err)}
		response.SendError(writer, request, err)
		return
	}

	if err := h.Controller.ExecJob(request.Context(), testsRunConfig); err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusAccepted, struct{}{})
}
