package dexec

import "github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"

type TestsRunConfig struct {
	SubmissionID         string
	ImageName            string
	ContainerName        string
	Assignment           string
	SolutionGitUser      string
	SolutionGitUserToken string
	SolutionGitRepo      string
	TestsGitUser         string
	TestsGitUserToken    string
	TestsGitRepo         string
}

func (c *TestsRunConfig) Validate() error {
	if c.Assignment == "" {
		return errors.New("tests run assignment cannot be empty")
	}
	if c.SolutionGitUser == "" {
		return errors.New("tests run solution git user cannot be empty")
	}
	if c.SolutionGitUserToken == "" {
		return errors.New("tests run solution git user token cannot be empty")
	}
	if c.SolutionGitRepo == "" {
		return errors.New("tests run solution git user repo cannot be empty")
	}
	if c.TestsGitUser == "" {
		return errors.New("tests run tests git user cannot be empty")
	}
	if c.TestsGitUserToken == "" {
		return errors.New("tests run tests git user token cannot be empty")
	}
	if c.TestsGitRepo == "" {
		return errors.New("tests run tests git user repo cannot be empty")
	}
	return nil
}
