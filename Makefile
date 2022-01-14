start-grader:
	go vet ./... && export LOCAL_DEV=true && go run cmd/main.go

start-job-executor:
	go vet ./... && export LOCAL_DEV=true && go run job-executor/cmd/main.go