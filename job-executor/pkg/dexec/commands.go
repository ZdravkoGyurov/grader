package dexec

import (
	"fmt"
	"os/exec"
	"syscall"
)

func buildSubmissionImage(testsConfig TestsRunConfig, dockerfile string) (string, error) {
	buildArgs := []string{
		"build",
		"--no-cache",
		"-t", testsConfig.ImageName,
		"--build-arg", fmt.Sprintf("courseGithubName=%s", testsConfig.CourseGithubName),
		"--build-arg", fmt.Sprintf("assignmentGithubName=%s", testsConfig.AssignmentGithubName),
		"--build-arg", fmt.Sprintf("submitterGithubName=%s", testsConfig.SubmitterGithubName),
		"--build-arg", fmt.Sprintf("submitterGithubToken=%s", testsConfig.SubmitterGithubToken),
		"--build-arg", fmt.Sprintf("testerGithubName=%s", testsConfig.TesterGithubName),
		"--build-arg", fmt.Sprintf("testerGithubToken=%s", testsConfig.TesterGithubToken),
		dockerfile,
	}
	cmd := exec.Command("docker", buildArgs...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		Setpgid: true,
	}

	output, err := cmd.CombinedOutput()
	return string(output), err
}

func runImage(imageName, containerName string) (string, error) {
	cmd := exec.Command("docker", "run", "--rm", "--name", containerName, imageName)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		Setpgid: true,
	}

	bytes, err := cmd.CombinedOutput()
	return string(bytes), err
}

func removeImage(imageName string) error {
	cmd := exec.Command("docker", "image", "rm", imageName)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		Setpgid: true,
	}

	_, err := cmd.CombinedOutput()
	return err
}
