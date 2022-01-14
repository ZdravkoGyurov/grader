package types

type Submission struct {
	ID                   string           `json:"id"`
	Result               string           `json:"result"`
	SubmissionStatusName SubmissionStatus `json:"submissionStatusName"`
	SubmitterEmail       string           `json:"submitterEmail"`
	AssignmentID         string           `json:"assignmentId"`
}
