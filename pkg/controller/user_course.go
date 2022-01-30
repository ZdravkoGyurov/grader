package controller

import (
	"context"

	"github.com/ZdravkoGyurov/grader/pkg/types"
)

func (c *Controller) CreateUserCourseMapping(ctx context.Context, userEmail string, userCourse *types.UserCourse) error {
	return c.storage.CreateUserCourse(ctx, userEmail, userCourse)
}

func (c *Controller) GetUserCourseMappings(ctx context.Context, courseID string) ([]types.UserCourse, error) {
	return c.storage.GetUserCourses(ctx, courseID)
}

func (c *Controller) UpdateUserCourseMapping(ctx context.Context, userCourse *types.UserCourse) (*types.UserCourse, error) {
	return c.storage.UpdateUserCourse(ctx, userCourse)
}

func (c *Controller) DeleteUserCourseMapping(ctx context.Context, userCourse *types.UserCourse) error {
	return c.storage.DeleteUserCourse(ctx, userCourse)
}
