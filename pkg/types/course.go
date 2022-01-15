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
	GithubName   string    `json:"githubName"`
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
	if c.Description == "" {
		return errors.Newf("course description should not be empty: %w", errors.ErrInvalidEntity)
	}
	if c.GithubName == "" {
		return errors.Newf("course github name should not be empty: %w", errors.ErrInvalidEntity)
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
		c.GithubName,
		c.CreatorEmail,
		c.CreatedOn,
		c.LastEditedOn,
	}
}
