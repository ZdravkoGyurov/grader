FROM openjdk:18-jdk-alpine3.15

ARG graderGitlabPAT
ARG graderGitlabHost
ARG graderGitlabName
ARG courseGitlabName
ARG assignmentGitlabName
ARG submitterGitlabName
ARG testerGitlabName
ARG junitConsoleLauncherName=junit-platform-console-standalone
ARG junitConsoleLauncherVersion=1.8.2
ENV JUNIT_JAR ${junitConsoleLauncherName}-${junitConsoleLauncherVersion}.jar

WORKDIR /app

COPY ./run_tests.sh .

# download dependencies
RUN apk update && apk upgrade && apk add --no-cache git
RUN wget https://repo1.maven.org/maven2/org/junit/platform/${junitConsoleLauncherName}/${junitConsoleLauncherVersion}/$JUNIT_JAR

# download solution and tests
RUN git clone https://${graderGitlabName}:${graderGitlabPAT}@${graderGitlabHost}/${graderGitlabName}/${courseGitlabName}/${submitterGitlabName}.git
RUN cp -r ./${submitterGitlabName}/${assignmentGitlabName}/src/* src/ && rm -rf ./${submitterGitlabName}
RUN git clone https://${graderGitlabName}:${graderGitlabPAT}@${graderGitlabHost}/${graderGitlabName}/${courseGitlabName}/${testerGitlabName}.git
RUN cp -r ./${testerGitlabName}/${assignmentGitlabName}/test/* test/ && rm -rf ./${testerGitlabName}

# compile java files
RUN mkdir -p target
RUN find . -name "*.java" | xargs javac -d target/ -cp $JUNIT_JAR:target/

ENTRYPOINT ./run_tests.sh $JUNIT_JAR
