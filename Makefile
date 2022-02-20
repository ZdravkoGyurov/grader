start-grader:
	export LOCAL_DEV=true && export CONFIG_DIR=config && go run cmd/main.go

start-job-executor:
	export LOCAL_DEV=true && export CONFIG_DIR=config && go run job-executor/cmd/main.go

build-grader-image:
	docker build . -t grader

build-grader-job-executor-image:
	docker build ./job-executor -t grader-job-executor

build-grader-ui-image:
	docker build ./web -t grader-ui

build-all-images: build-grader-image build-grader-job-executor-image build-grader-ui-image

remove-all-images:
	docker image rm -f grader grader-job-executor grader-ui

install-on-k8s:
	helm upgrade --install --wait --create-namespace -n grader grader deployments/helm_charts/grader

uninstall-from-k8s:
	helm uninstall -n grader grader