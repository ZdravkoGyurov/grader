package types

type AssignmentBody struct {
	CourseGroup     string `json:"courseGroup"`
	AssignmentPaths string `json:"assignmentPaths"`
	GitlabUsernames string `json:"gitlabUsernames"`
}
