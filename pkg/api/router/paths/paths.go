package paths

const (
	RootPath = "/"

	GithubLoginPath         = "/login/oauth/github"
	GithubLoginCallbackPath = "/login/oauth/github/callback"
	UserInfoPath            = "/userInfo"
	TokenPath               = "/token"
	LogoutPath              = "/logout"

	CoursePath           = "/course"
	CourseWithIDPath     = "/course/{id}"
	AssignmentPath       = "/assignment"
	AssignmentWithIDPath = "/assignment/{id}"
	SubmissionPath       = "/submission"
	SubmissionWithIDPath = "/submission/{id}"
	UserCoursePath       = "/userCourse"
	UserCourseWithIDPath = "/userCourse/{id}"
)
