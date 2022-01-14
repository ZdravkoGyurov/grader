package types

type UserCourse struct {
	UserEmail      string     `json:"userEmail"`
	CourseID       string     `json:"courseId"`
	CourseRoleName CourseRole `json:"courseRoleName"`
}
