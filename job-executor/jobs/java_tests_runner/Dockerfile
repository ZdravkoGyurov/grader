FROM openjdk:18-jdk-alpine3.15

ARG junitConsoleLauncherName=junit-platform-console-standalone
ARG junitConsoleLauncherVersion=1.8.2
ENV JUNIT_JAR ${junitConsoleLauncherName}-${junitConsoleLauncherVersion}.jar

# $GRADER_GITLAB_NAME
# $GRADER_GITLAB_PAT
# $GRADER_GITLAB_HOST
# $COURSE_GITLAB_NAME
# $ASSIGNMENT_GITLAB_NAME
# $SUBMITTER_GITLAB_NAME
# $TESTER_GITLAB_NAME

WORKDIR /app

COPY ./run_tests.sh .

RUN apk update && apk upgrade && apk add --no-cache git
RUN wget https://repo1.maven.org/maven2/org/junit/platform/${junitConsoleLauncherName}/${junitConsoleLauncherVersion}/$JUNIT_JAR

ENTRYPOINT ./run_tests.sh
