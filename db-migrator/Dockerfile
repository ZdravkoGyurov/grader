FROM alpine:3.15.0

WORKDIR /db-migrator

RUN apk add curl
RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.15.1/migrate.linux-amd64.tar.gz | tar xz

COPY migrations ./migrations

ENTRYPOINT ./migrate -path migrations -database $DB_URL up
