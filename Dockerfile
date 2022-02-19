FROM golang:1.17.7-alpine3.15 as builder

WORKDIR /go/src/github.com/ZdravkoGyurov/grader

COPY cmd ./cmd
COPY pkg ./pkg
COPY go.mod go.sum ./

RUN go build -o /main cmd/main.go

FROM alpine:3.15.0 as runtime

WORKDIR /app

COPY --from=builder /main /app/

RUN adduser --system --no-create-home --uid 1000 robot

USER 1000

EXPOSE 8080

ENTRYPOINT [ "./main" ]
