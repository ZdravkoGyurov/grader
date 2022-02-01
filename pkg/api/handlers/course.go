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

type Course struct {
	Controller controller.Controller
}

func (c *Course) Post(writer http.ResponseWriter, request *http.Request) {
	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	course := types.Course{}
	if err := json.NewDecoder(request.Body).Decode(&course); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}
	course.CreatorEmail = userData.Email

	createdCourse, err := c.Controller.CreateCourse(request.Context(), &course, userData.GitlabID, userData.Name)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusCreated, createdCourse)
}

func (c *Course) GetAll(writer http.ResponseWriter, request *http.Request) {
	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	courses, err := c.Controller.GetCourses(request.Context(), userData.Email)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusOK, courses)
}

func (c *Course) Get(writer http.ResponseWriter, request *http.Request) {
	courseID := pathParam(request)

	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	course, err := c.Controller.GetCourse(request.Context(), courseID, userData.Email)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusOK, course)
}

func (c *Course) Patch(writer http.ResponseWriter, request *http.Request) {
	courseID := pathParam(request)

	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	course := types.Course{}
	if err := json.NewDecoder(request.Body).Decode(&course); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	course.ID = courseID
	course.CreatorEmail = userData.Email

	updatedCourse, err := c.Controller.UpdateCourse(request.Context(), &course)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusOK, updatedCourse)
}

func (c *Course) Delete(writer http.ResponseWriter, request *http.Request) {
	courseID := pathParam(request)

	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	if err := c.Controller.DeleteCourse(request.Context(), courseID, userData.Email); err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusNoContent, struct{}{})
}
