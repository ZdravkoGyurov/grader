package controller

import (
	"context"
	"strings"
	"time"

	"github.com/ZdravkoGyurov/grader/pkg/types"

	"github.com/google/uuid"
)

func (c *Controller) CreateAssignment(ctx context.Context, assignment *types.Assignment) (*types.Assignment, error) {
	assignment.ID = uuid.NewString()
	assignment.CreatedOn = time.Now()
	assignment.LastEditedOn = time.Now()

	if err := assignment.ValidateCreate(); err != nil {
		return nil, err
	}

	course, err := c.storage.GetCourse(ctx, assignment.CourseID, assignment.AuthorEmail)
	if err != nil {
		return nil, err
	}

	usernames, err := c.storage.GetCoruseUserNames(ctx, assignment.CourseID)
	if err != nil {
		return nil, err
	}

	if err := c.createGitlabAssignments(ctx, course.GitlabName, assignment.GitlabName,
		strings.Join(usernames, ";")); err != nil {

		return nil, err
	}

	if err := c.storage.CreateAssignment(ctx, assignment); err != nil {
		return nil, err
	}

	return assignment, nil
}

func (c *Controller) GetAssignments(ctx context.Context, userEmail string) ([]*types.Assignment, error) {
	return c.storage.GetAssignments(ctx, userEmail)
}

func (c *Controller) GetAssignmentsByCourseID(ctx context.Context, userEmail, courseID string) ([]*types.Assignment, error) {
	return c.storage.GetAssignmentsByCourseID(ctx, userEmail, courseID)
}

func (c *Controller) GetAssignment(ctx context.Context, id, userEmail string) (*types.Assignment, error) {
	return c.storage.GetAssignment(ctx, id, userEmail)
}

func (c *Controller) UpdateAssignment(ctx context.Context, assignment *types.Assignment) (*types.Assignment, error) {
	assignment.LastEditedOn = time.Now()

	if err := assignment.ValidateUpdate(); err != nil {
		return nil, err
	}

	return c.storage.UpdateAssignment(ctx, assignment)
}

func (c *Controller) DeleteAssignment(ctx context.Context, id, userEmail string) error {
	return c.storage.DeleteAssignment(ctx, id, userEmail)
}
