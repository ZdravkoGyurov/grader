package controller

import (
	"context"
	"time"

	"github.com/ZdravkoGyurov/grader/pkg/types"
	"github.com/google/uuid"
)

func (c *Controller) CreateCourse(ctx context.Context, course *types.Course) (*types.Course, error) {
	course.ID = uuid.NewString()
	course.CreatedOn = time.Now()
	course.LastEditedOn = time.Now()

	if err := course.ValidateCreate(); err != nil {
		return nil, err
	}

	if err := c.storage.CreateCourse(ctx, course); err != nil {
		return nil, err
	}

	return course, nil
}

func (c *Controller) GetCourses(ctx context.Context, userEmail string) ([]*types.Course, error) {
	return c.storage.GetCourses(ctx, userEmail)
}

func (c *Controller) GetCourse(ctx context.Context, id, userEmail string) (*types.Course, error) {
	return c.storage.GetCourse(ctx, id, userEmail)
}

func (c *Controller) UpdateCourse(ctx context.Context, course *types.Course) (*types.Course, error) {
	course.LastEditedOn = time.Now()

	if err := course.ValidateUpdate(); err != nil {
		return nil, err
	}

	return c.storage.UpdateCourse(ctx, course)
}

func (c *Controller) DeleteCourse(ctx context.Context, id, userEmail string) error {
	return c.storage.DeleteCourse(ctx, id, userEmail)
}
