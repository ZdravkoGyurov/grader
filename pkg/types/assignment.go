package types

import "time"

type Assignment struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	GithubName   string    `json:"githubName"`
	AuthorEmail  string    `json:"authorEmail"`
	CourseID     string    `json:"courseId"`
	CreatedOn    time.Time `json:"createdOn"`
	LastEditedOn time.Time `json:"lastEditedOn"`
}
