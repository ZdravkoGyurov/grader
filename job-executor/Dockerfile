FROM golang:1.17.7-alpine3.15 as builder

WORKDIR /go/src/github.com/ZdravkoGyurov/grader/job-executor

COPY cmd ./cmd
COPY pkg ./pkg
COPY go.mod go.sum ./

RUN go build -o /main cmd/main.go

FROM alpine:3.15.0 as runtime

WORKDIR /app

RUN apk update && apk add --no-cache docker-cli

COPY --from=builder /main /app/
COPY pkg/dexec/create_assignments ./pkg/dexec/create_assignments
COPY pkg/dexec/run_tests ./pkg/dexec/run_tests

EXPOSE 8081

ENTRYPOINT [ "./main" ]
