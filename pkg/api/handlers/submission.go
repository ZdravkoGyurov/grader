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

type Submission struct {
	Controller controller.Controller
}

func (s Submission) Post(writer http.ResponseWriter, request *http.Request) {
	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	submission := types.Submission{}
	if err := json.NewDecoder(request.Body).Decode(&submission); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}
	submission.SubmitterEmail = userData.Email

	createdSubmission, err := s.Controller.CreateSubmission(request.Context(), &submission)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	if err = s.Controller.CreateSubmissionJob(request.Context(), createdSubmission.ID); err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusAccepted, createdSubmission)
}

func (s Submission) GetAll(writer http.ResponseWriter, request *http.Request) {
	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	assignmentID := request.URL.Query().Get("assignmentId")
	if assignmentID == "" {
		err := errors.Newf("assignmentId query parameter should not be empty: %w", errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	submission, err := s.Controller.GetSubmissions(request.Context(), userData.Email, assignmentID)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusOK, submission)
}

func (s Submission) Get(writer http.ResponseWriter, request *http.Request) {
	submissionID := pathParam(request)

	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	submission, err := s.Controller.GetSubmission(request.Context(), submissionID, userData.Email)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusOK, submission)
}
