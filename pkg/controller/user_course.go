package controller

import (
	"context"
	"strings"

	"github.com/ZdravkoGyurov/grader/pkg/errors"
	"github.com/ZdravkoGyurov/grader/pkg/types"
)

func (c *Controller) CreateUserCourseMapping(ctx context.Context, userEmail string, userCourse *types.UserCourse) error {
	course, err := c.GetCourse(ctx, userCourse.CourseID, userEmail)
	if err != nil {
		return err
	}

	assignments, err := c.GetAssignmentsByCourseID(ctx, userEmail, userCourse.CourseID)
	if err != nil {
		return err
	}

	user, err := c.GetUser(ctx, userCourse.UserEmail)
	if err != nil {
		return err
	}

	userProjectID, found, err := c.getGitlabProject(ctx, user.Name, course.GitlabID)
	if err != nil {
		return err
	}
	if !found {
		userProjectID, err = c.createGitlabProject(ctx, user.Name, course.GitlabID)
		if err != nil {
			return err
		}
	}

	if err := c.addUserInGitlabProject(ctx, user.GitlabID, userProjectID); err != nil {
		return err
	}

	if err := c.storage.CreateUserCourse(ctx, userEmail, userCourse); err != nil {
		return err
	}

	assignmentPaths := []string{}
	for _, assignment := range assignments {
		assignmentPaths = append(assignmentPaths, assignment.GitlabName)
	}
	if err := c.createGitlabAssignments(ctx, course.GitlabName, strings.Join(assignmentPaths, ";"), user.Name); err != nil {
		return err
	}

	return nil
}

func (c *Controller) GetUserCourseMappings(ctx context.Context, courseID string) ([]types.UserCourse, error) {
	return c.storage.GetUserCourses(ctx, courseID)
}

func (c *Controller) UpdateUserCourseMapping(ctx context.Context, userCourse *types.UserCourse, userEmail string) (*types.UserCourse, error) {
	course, err := c.GetCourse(ctx, userCourse.CourseID, userEmail)
	if err != nil {
		return nil, errors.Newf("failed to get course creator email: %w", err)
	}

	if course.CreatorEmail == userCourse.UserEmail {
		return nil, errors.Newf("cannot edit the course creator course roles: %w", errors.ErrInvalidEntity)
	}

	return c.storage.UpdateUserCourse(ctx, userCourse)
}

func (c *Controller) DeleteUserCourseMapping(ctx context.Context, userCourse *types.UserCourse, userEmail string) error {
	course, err := c.GetCourse(ctx, userCourse.CourseID, userEmail)
	if err != nil {
		return errors.Newf("failed to get course creator email: %w", err)
	}

	if course.CreatorEmail == userCourse.UserEmail {
		return errors.Newf("cannot remove the course creator from the course: %w", errors.ErrInvalidEntity)
	}

	return c.storage.DeleteUserCourse(ctx, userCourse)
}
