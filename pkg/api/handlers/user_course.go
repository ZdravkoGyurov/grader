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

type UserCourse struct {
	Controller controller.Controller
}

func (uc UserCourse) Post(writer http.ResponseWriter, request *http.Request) {
	userData, ok := req.GetUserData(request)
	if !ok {
		response.SendError(writer, request, errors.New("failed to get request user data"))
		return
	}

	userCourse := types.UserCourse{}
	if err := json.NewDecoder(request.Body).Decode(&userCourse); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	if err := uc.Controller.CreateUserCourseMapping(request.Context(), userData.Email, &userCourse); err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusCreated, userCourse)
}

func (uc UserCourse) Get(writer http.ResponseWriter, request *http.Request) {
	courseID := request.URL.Query().Get("courseId")
	if courseID == "" {
		err := errors.Newf("courseId query parameter should not be empty: %w", errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	userCourses, err := uc.Controller.GetUserCourseMappings(request.Context(), courseID)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusOK, userCourses)
}

func (uc UserCourse) Put(writer http.ResponseWriter, request *http.Request) {
	userCourse := types.UserCourse{}
	if err := json.NewDecoder(request.Body).Decode(&userCourse); err != nil {
		err = errors.Newf("%s: %w", err, errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	updatedUserCourse, err := uc.Controller.UpdateUserCourseMapping(request.Context(), &userCourse)
	if err != nil {
		response.SendError(writer, request, err)
		return
	}

	response.SendData(writer, request, http.StatusOK, updatedUserCourse)
}

func (uc UserCourse) Delete(writer http.ResponseWriter, request *http.Request) {
	userEmail := request.URL.Query().Get("userEmail")
	if userEmail == "" {
		err := errors.Newf("userEmail query parameter should not be empty: %w", errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}
	courseID := request.URL.Query().Get("courseId")
	if courseID == "" {
		err := errors.Newf("courseId query parameter should not be empty: %w", errors.ErrInvalidEntity)
		response.SendError(writer, request, err)
		return
	}

	userCourse := types.UserCourse{
		UserEmail: userEmail,
		CourseID:  courseID,
	}
	if err := uc.Controller.DeleteUserCourseMapping(request.Context(), &userCourse); err != nil {
		response.SendError(writer, request, err)
		return
	}
	response.SendData(writer, request, http.StatusNoContent, struct{}{})
}
