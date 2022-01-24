package types

import (
	"time"

	"github.com/ZdravkoGyurov/grader/pkg/errors"

	"github.com/google/uuid"
)

type Course struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	GitlabName   string    `json:"gitlabName"`
	CreatorEmail string    `json:"creatorEmail"`
	CreatedOn    time.Time `json:"createdOn"`
	LastEditedOn time.Time `json:"lastEditedOn"`
}

func (c Course) ValidateCreate() error {
	if _, err := uuid.Parse(c.ID); err != nil {
		return errors.Newf("course id should be UUID: %w", errors.ErrInvalidEntity)
	}
	if c.Name == "" {
		return errors.Newf("course name should not be empty: %w", errors.ErrInvalidEntity)
	}
	if c.GitlabName == "" {
		return errors.Newf("course gitlab name should not be empty: %w", errors.ErrInvalidEntity)
	}
	if c.CreatorEmail == "" {
		return errors.Newf("course creator email should not be empty: %w", errors.ErrInvalidEntity)
	}
	return nil
}

func (c Course) ValidateUpdate() error {
	if _, err := uuid.Parse(c.ID); err != nil {
		return errors.Newf("course id should be UUID: %w", errors.ErrInvalidEntity)
	}
	if c.CreatorEmail == "" {
		return errors.Newf("course creator email should not be empty: %w", errors.ErrInvalidEntity)
	}
	return nil
}

func (c Course) Fields() []interface{} {
	return []interface{}{
		c.ID,
		c.Name,
		c.Description,
		c.GitlabName,
		c.CreatorEmail,
		c.CreatedOn,
		c.LastEditedOn,
	}
}
