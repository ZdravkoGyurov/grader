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

RUN adduser --system --no-create-home --uid 1000 robot

USER 1000

EXPOSE 8081

ENTRYPOINT [ "./main" ]
