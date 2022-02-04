FROM alpine:3.15

ARG user
ARG userEmail
ARG pat
ARG gitlabHost
ARG rootGroup
ARG courseGroup
ARG assignmentPath
ARG assignmentName
ARG gitlabUsernames

ENV USER=${user}
ENV USER_EMAIL=${userEmail}
ENV PAT=${pat}
ENV GITLAB_HOST=${gitlabHost}
ENV ROOT_GROUP=${rootGroup}
ENV COURSE_GROUP=${courseGroup}
ENV ASSIGNMENT_PATH=${assignmentPath}
ENV ASSIGNMENT_NAME=${assignmentName}
ENV GITLAB_USERNAMES=${gitlabUsernames}

WORKDIR /work

COPY ./create_assignment.sh .

RUN apk update && apk upgrade && apk add --no-cache git

ENTRYPOINT ./create_assignment.sh
