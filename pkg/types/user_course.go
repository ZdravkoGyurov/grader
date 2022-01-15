package types

type UserCourse struct {
	UserEmail      string     `json:"userEmail"`
	CourseID       string     `json:"courseId"`
	CourseRoleName CourseRole `json:"courseRoleName"`
}

func (uc UserCourse) Fields() []interface{} {
	return []interface{}{
		uc.UserEmail,
		uc.CourseID,
		uc.CourseRoleName,
	}
}
