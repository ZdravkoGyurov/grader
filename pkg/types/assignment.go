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

func (a Assignment) Fields() []interface{} {
	return []interface{}{
		a.ID,
		a.Name,
		a.Description,
		a.GithubName,
		a.AuthorEmail,
		a.CourseID,
		a.CreatedOn,
		a.LastEditedOn,
	}
}
