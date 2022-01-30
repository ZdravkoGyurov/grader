package paths

const (
	RootPath = "/"

	GitlabLoginPath         = "/login/oauth/gitlab"
	GitlabLoginCallbackPath = "/login/oauth/gitlab/callback"
	UserInfoPath            = "/userInfo"
	TokenPath               = "/token"
	LogoutPath              = "/logout"

	UserPath             = "/user"
	CoursePath           = "/course"
	CourseWithIDPath     = "/course/{id}"
	AssignmentPath       = "/assignment"
	AssignmentWithIDPath = "/assignment/{id}"
	SubmissionPath       = "/submission"
	SubmissionWithIDPath = "/submission/{id}"
	UserCoursePath       = "/userCourse"
)
