package kexec

import (
	"context"
	"io"
	"time"

	"github.com/ZdravkoGyurov/grader/job-executor/pkg/errors"

	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

const (
	runTestsMaxDuration         = 20 * time.Second
	createAssignmentMaxDuration = 20 * time.Second
	watchPodDuration            = 10 * time.Second
)

func runPod(ctx context.Context, k8sClient *kubernetes.Clientset, pod *v1.Pod) (string, error) {
	createdPod, err := k8sClient.CoreV1().Pods(namespace).Create(ctx, pod, metav1.CreateOptions{})
	if err != nil {
		return "", errors.Newf("failed to create pod: %w", err)
	}

	if err = waitPodToComplete(ctx, k8sClient, createdPod.ObjectMeta); err != nil {
		return "", err
	}

	logRequest := k8sClient.CoreV1().Pods(namespace).GetLogs(createdPod.Name, &v1.PodLogOptions{})
	podLogs, err := logRequest.Stream(ctx)
	if err != nil {
		return "", errors.Newf("failed to get pod logs: %w", err)
	}
	defer podLogs.Close()

	logBytes, err := io.ReadAll(podLogs)
	if err != nil {
		return "", errors.Newf("failed to read pod logs: %w", err)
	}

	return string(logBytes), nil
}

func waitPodToComplete(ctx context.Context, k8sClient *kubernetes.Clientset, meta metav1.ObjectMeta) error {
	w, err := k8sClient.CoreV1().Pods(namespace).Watch(ctx, metav1.SingleObject(meta))
	if err != nil {
		return errors.Newf("failed to watch pod: %w", err)
	}

	var phase v1.PodPhase
	func() {
		for {
			select {
			case events, ok := <-w.ResultChan():
				if !ok {
					return
				}

				pod, isPod := events.Object.(*v1.Pod)
				if isPod {
					phase = pod.Status.Phase
					if pod.Status.Phase == v1.PodSucceeded {
						w.Stop()
					}
				}
			case <-time.After(watchPodDuration):
				w.Stop()
			}
		}
	}()

	if phase != v1.PodSucceeded {
		return errors.Newf("tests run pod status phase: %v", phase)
	}

	return nil
}
