package types

type SubmissionStatus string

const (
	SubmissionStatusSuccess SubmissionStatus = "Success"
	SubmissionStatusPending SubmissionStatus = "Pending"
	SubmissionStatusFail    SubmissionStatus = "Fail"
)

type Submission struct {
	ID     string
	Result string
	Status SubmissionStatus
}

type SubmissionInfo struct {
	CourseGithubName     string
	AssignmentGithubName string
	SubmitterGithubName  string
	SubmitterGithubToken string
	TesterGithubName     string
	TesterGithubToken    string
}
