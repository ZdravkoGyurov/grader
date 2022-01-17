package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ZdravkoGyurov/grader/pkg/api/req"
	"github.com/ZdravkoGyurov/grader/pkg/api/response"
	"github.com/ZdravkoGyurov/grader/pkg/controller"
	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"
)

type Assignment struct {
	Controller controller.Controller
}

func (a *Assignment) Post(writer http.ResponseWriter, request *http.Request) {
	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	assignment := types.Assignment{}
	if err := json.NewDecoder(request.Body).Decode(&assignment); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}
	assignment.AuthorEmail = userData.Email

	createdAssignment, err := a.Controller.CreateAssignment(request.Context(), &assignment)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusCreated, createdAssignment)
}

func (a *Assignment) GetAll(writer http.ResponseWriter, request *http.Request) {
	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	courseID := request.URL.Query().Get("courseId")
	if courseID == "" {
		err := errors.Newf("courseId query parameter should not be empty: %w", errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	assignments, err := a.Controller.GetAssignmentsByCourseID(request.Context(), userData.Email, courseID)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusOK, assignments)
}

func (a *Assignment) Get(writer http.ResponseWriter, request *http.Request) {
	assignmentID := pathParam(request)

	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	assignment, err := a.Controller.GetAssignment(request.Context(), assignmentID, userData.Email)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusOK, assignment)
}

func (a *Assignment) Patch(writer http.ResponseWriter, request *http.Request) {
	assignmentID := pathParam(request)

	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	assignment := types.Assignment{}
	if err := json.NewDecoder(request.Body).Decode(&assignment); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	assignment.ID = assignmentID
	assignment.AuthorEmail = userData.Email

	updatedAssignment, err := a.Controller.UpdateAssignment(request.Context(), &assignment)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusOK, updatedAssignment)
}

func (a *Assignment) Delete(writer http.ResponseWriter, request *http.Request) {
	assignmentID := pathParam(request)

	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	if err := a.Controller.DeleteAssignment(request.Context(), assignmentID, userData.Email); err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusNoContent, struct{}{})
}
