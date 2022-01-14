package types

type SubmissionStatus string

const (
	SubmissionStatusSuccess SubmissionStatus = "Success"
	SubmissionStatusPending SubmissionStatus = "Pending"
	SubmissionStatusFail    SubmissionStatus = "Fail"
)
