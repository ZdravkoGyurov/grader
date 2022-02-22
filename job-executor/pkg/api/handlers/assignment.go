package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/controller"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/types"
)

type Assignment struct {
	Controller *controller.Controller
}

func (h *Assignment) Post(writer http.ResponseWriter, request *http.Request) {
	assignment := types.AssignmentBody{}
	if err := json.NewDecoder(request.Body).Decode(&assignment); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	if err := h.Controller.CreateAssignment(request.Context(), assignment); err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusAccepted, struct{}{})
}
