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

build-grader-java-tests-runner-image:
	docker build ./job-executor/jobs/java_tests_runner -t grader-java-tests-runner

build-grader-assignments-creator-image:
	docker build ./job-executor/jobs/assignments_creator -t grader-assignments-creator

build-grader-db-migrator-image:
	docker build ./db-migrator -t grader-db-migrator

build-all-images: build-grader-image build-grader-job-executor-image build-grader-ui-image build-grader-java-tests-runner-image build-grader-assignments-creator-image build-grader-db-migrator-image

remove-all-images:
	docker image rm -f grader grader-job-executor grader-ui grader-java-tests-runner grader-assignments-creator grader-db-migrator

install-db-on-k8s:
	helm upgrade --install grader-db bitnami/postgresql --wait \
		-n grader --create-namespace \
		--version=11.0.3 \
		--set fullnameOverride=postgresql \
		--set auth.postgresPassword=postgres \
		--set volumePermissions.enabled=true \
		--set primary.persistence.size=1Gi

uninstall-db-from-k8s:
	helm uninstall -n grader grader-db

install-on-k8s:
	helm upgrade --install grader deployments/helm_charts/grader --wait \
		 -n grader --create-namespace

uninstall-from-k8s:
	helm uninstall -n grader grader
