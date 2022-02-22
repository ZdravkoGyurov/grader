package kexec

import (
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"
	"github.com/ZdravkoGyurov/grader/job-executor/pkg/random"

	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

const (
	namespace            = "grader-jobs"
	podKind              = "Pod"
	podAPIVersion        = "v1"
	javaTestsRunnerImage = "grader-java-tests-runner"
)

const (
	graderGitlabNameEnvVar     = "GRADER_GITLAB_NAME"
	graderGitlabPATEnvVar      = "GRADER_GITLAB_PAT"
	graderGitlabHostEnvVar     = "GRADER_GITLAB_HOST"
	courseGitlabNameEnvVar     = "COURSE_GITLAB_NAME"
	assignmentGitlabNameEnvVar = "ASSIGNMENT_GITLAB_NAME"
	submitterGitlabNameEnvVar  = "SUBMITTER_GITLAB_NAME"
	testerGitlabNameEnvVar     = "TESTER_GITLAB_NAME"
)

const (
	userEnvVar            = "USER"
	userEmailEnvVar       = "USER_EMAIL"
	patEnvVar             = "PAT"
	gitlabHostEnvVar      = "GITLAB_HOST"
	rootGroupEnvVar       = "ROOT_GROUP"
	courseGroupEnvVar     = "COURSE_GROUP"
	assignmentPathsEnvVar = "ASSIGNMENT_PATHS"
	gitlabUsernamesEnvVar = "GITLAB_USERNAMES"
)

type TestsRunnerConfig struct {
	TestsRunnerImage     string
	GraderGitlabName     string
	GraderGitlabPAT      string
	GraderGitlabHost     string
	CourseGitlabName     string
	AssignmentGitlabName string
	SubmitterGitlabName  string
	TesterGitlabName     string
}

func (c TestsRunnerConfig) Validate() error {
	if c.TestsRunnerImage == "" {
		return errors.New("testsRunnerConfig.testsRunnerImage cannot be empty")
	}
	if c.GraderGitlabName == "" {
		return errors.New("testsRunnerConfig.graderGitlabNameEnvVar cannot be empty")
	}
	if c.GraderGitlabName == "" {
		return errors.New("testsRunnerConfig.graderGitlabNameEnvVar cannot be empty")
	}
	if c.GraderGitlabHost == "" {
		return errors.New("testsRunnerConfig.graderGitlabHostEnvVar cannot be empty")
	}
	if c.CourseGitlabName == "" {
		return errors.New("testsRunnerConfig.courseGitlabNameEnvVar cannot be empty")
	}
	if c.AssignmentGitlabName == "" {
		return errors.New("testsRunnerConfig.assignmentGitlabNameEnvVar cannot be empty")
	}
	if c.SubmitterGitlabName == "" {
		return errors.New("testsRunnerConfig.submitterGitlabNameEnvVar cannot be empty")
	}
	if c.TesterGitlabName == "" {
		return errors.New("testsRunnerConfig.testerGitlabNameEnvVar cannot be empty")
	}
	return nil
}

type CreateAssignmentConfig struct {
	TestsRunnerImage string
	User             string
	UserEmail        string
	PAT              string
	GitlabHost       string
	RootGroup        string
	CourseGroup      string
	AssignmentPaths  string
	GitlabUsernames  string
}

func createTestsRunnerPod(cfg TestsRunnerConfig) (*v1.Pod, error) {
	name := random.LowercaseString(10)
	return &v1.Pod{
		TypeMeta: metav1.TypeMeta{
			Kind:       podKind,
			APIVersion: podAPIVersion,
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
		},
		Spec: v1.PodSpec{
			RestartPolicy: v1.RestartPolicyNever,
			Containers: []v1.Container{
				{
					Name:            name,
					Image:           cfg.TestsRunnerImage,
					ImagePullPolicy: v1.PullIfNotPresent,
					Env: []v1.EnvVar{
						{
							Name:  graderGitlabNameEnvVar,
							Value: cfg.GraderGitlabName,
						},
						{
							Name:  graderGitlabPATEnvVar,
							Value: cfg.GraderGitlabPAT,
						},
						{
							Name:  graderGitlabHostEnvVar,
							Value: cfg.GraderGitlabHost,
						},
						{
							Name:  courseGitlabNameEnvVar,
							Value: cfg.CourseGitlabName,
						},
						{
							Name:  assignmentGitlabNameEnvVar,
							Value: cfg.AssignmentGitlabName,
						},
						{
							Name:  submitterGitlabNameEnvVar,
							Value: cfg.SubmitterGitlabName,
						},
						{
							Name:  testerGitlabNameEnvVar,
							Value: cfg.TesterGitlabName,
						},
					},
				},
			},
		},
	}, nil
}

func createAssignmentCreatorPod(cfg CreateAssignmentConfig) (*v1.Pod, error) {
	name := random.LowercaseString(10)
	return &v1.Pod{
		TypeMeta: metav1.TypeMeta{
			Kind:       podKind,
			APIVersion: podAPIVersion,
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
		},
		Spec: v1.PodSpec{
			RestartPolicy: v1.RestartPolicyNever,
			Containers: []v1.Container{
				{
					Name:            name,
					Image:           cfg.TestsRunnerImage,
					ImagePullPolicy: v1.PullIfNotPresent,
					Env: []v1.EnvVar{
						{
							Name:  userEnvVar,
							Value: cfg.User,
						},
						{
							Name:  userEmailEnvVar,
							Value: cfg.UserEmail,
						},
						{
							Name:  patEnvVar,
							Value: cfg.PAT,
						},
						{
							Name:  gitlabHostEnvVar,
							Value: cfg.GitlabHost,
						},
						{
							Name:  rootGroupEnvVar,
							Value: cfg.RootGroup,
						},
						{
							Name:  courseGroupEnvVar,
							Value: cfg.CourseGroup,
						},
						{
							Name:  assignmentPathsEnvVar,
							Value: cfg.AssignmentPaths,
						},
						{
							Name:  gitlabUsernamesEnvVar,
							Value: cfg.GitlabUsernames,
						},
					},
				},
			},
		},
	}, nil
}
