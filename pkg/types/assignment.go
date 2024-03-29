package types

import (
	"time"

	"github.com/ZdravkoGyurov/grader/pkg/errors"

	"github.com/google/uuid"
)

type Assignment struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	AuthorEmail  string    `json:"authorEmail"`
	CourseID     string    `json:"courseId"`
	GitlabName   string    `json:"gitlabName"`
	CreatedOn    time.Time `json:"createdOn"`
	LastEditedOn time.Time `json:"lastEditedOn"`
}

func (a Assignment) ValidateCreate() error {
	if _, err := uuid.Parse(a.ID); err != nil {
		return errors.Newf("assignment id should be UUID: %w", errors.ErrInvalidEntity)
	}
	if a.Name == "" {
		return errors.Newf("assignment name should not be empty: %w", errors.ErrInvalidEntity)
	}
	if a.GitlabName == "" {
		return errors.Newf("assignment gitlab name should not be empty: %w", errors.ErrInvalidEntity)
	}
	if a.AuthorEmail == "" {
		return errors.Newf("assignment author email should not be empty: %w", errors.ErrInvalidEntity)
	}
	if _, err := uuid.Parse(a.CourseID); err != nil {
		return errors.Newf("assignment course id should be UUID: %w", errors.ErrInvalidEntity)
	}
	return nil
}

func (a Assignment) ValidateUpdate() error {
	if _, err := uuid.Parse(a.ID); err != nil {
		return errors.Newf("assignment id should be UUID: %w", errors.ErrInvalidEntity)
	}
	if a.AuthorEmail == "" {
		return errors.Newf("assignment author email should not be empty: %w", errors.ErrInvalidEntity)
	}
	return nil
}

func (a Assignment) Fields() []interface{} {
	return []interface{}{
		a.ID,
		a.Name,
		a.Description,
		a.AuthorEmail,
		a.CourseID,
		a.GitlabName,
		a.CreatedOn,
		a.LastEditedOn,
	}
}
