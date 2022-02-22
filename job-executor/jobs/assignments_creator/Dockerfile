FROM alpine:3.15

# $USER
# $USER_EMAIL
# $PAT
# $GITLAB_HOST
# $ROOT_GROUP
# $COURSE_GROUP
# $ASSIGNMENT_PATHS
# $GITLAB_USERNAMES

WORKDIR /work

COPY ./create_assignment.sh .

RUN apk update && apk upgrade && apk add --no-cache git

ENTRYPOINT ./create_assignment.sh
