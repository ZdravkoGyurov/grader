package types

type Submission struct {
	ID                   string           `json:"id"`
	Result               string           `json:"result"`
	SubmissionStatusName SubmissionStatus `json:"submissionStatusName"`
	SubmitterEmail       string           `json:"submitterEmail"`
	AssignmentID         string           `json:"assignmentId"`
}

func (s Submission) Fields() []interface{} {
	return []interface{}{
		s.ID,
		s.Result,
		s.SubmissionStatusName,
		s.SubmitterEmail,
		s.AssignmentID,
	}
}
