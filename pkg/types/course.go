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
