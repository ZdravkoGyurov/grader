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
		"--build-arg", fmt.Sprintf("graderGitlabPAT=%s", testsConfig.GraderGitlabPAT),
		"--build-arg", fmt.Sprintf("graderGitlabHost=%s", testsConfig.GraderGitlabHost),
		"--build-arg", fmt.Sprintf("graderGitlabName=%s", testsConfig.GraderGitlabName),
		"--build-arg", fmt.Sprintf("courseGitlabName=%s", testsConfig.CourseGitlabName),
		"--build-arg", fmt.Sprintf("assignmentGitlabName=%s", testsConfig.AssignmentGitlabName),
		"--build-arg", fmt.Sprintf("submitterGitlabName=%s", testsConfig.SubmitterGitlabName),
		"--build-arg", fmt.Sprintf("testerGitlabName=%s", testsConfig.TesterGitlabName),
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
