package types

import "time"

type Course struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	GithubName   string    `json:"githubName"`
	CreatorEmail string    `json:"creatorEmail"`
	CreatedOn    time.Time `json:"createdOn"`
	LastEditedOn time.Time `json:"lastEditedOn"`
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
