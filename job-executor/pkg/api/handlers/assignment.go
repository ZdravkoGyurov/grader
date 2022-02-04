package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/controller"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/dexec"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
)

type Assignment struct {
	Controller *controller.Controller
}

func (h *Assignment) Post(writer http.ResponseWriter, request *http.Request) {
	createAssignmentConfig := dexec.CreateAssignmentConfig{}
	if err := json.NewDecoder(request.Body).Decode(&createAssignmentConfig); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	if err := h.Controller.CreateAssignment(request.Context(), createAssignmentConfig); err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusAccepted, struct{}{})
}
