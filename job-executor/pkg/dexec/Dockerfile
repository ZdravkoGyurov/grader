FROM openjdk:18-jdk-alpine3.15

ARG courseGithubName
ARG assignmentGithubName
ARG submitterGithubName
ARG submitterGithubToken
ARG testerGithubName
ARG testerGithubToken
ARG junitConsoleLauncherName=junit-platform-console-standalone
ARG junitConsoleLauncherVersion=1.8.2
ENV JUNIT_JAR ${junitConsoleLauncherName}-${junitConsoleLauncherVersion}.jar

WORKDIR /app

COPY ./run_tests.sh .

# download dependencies
RUN apk update && apk upgrade && apk add --no-cache git
RUN wget https://repo1.maven.org/maven2/org/junit/platform/${junitConsoleLauncherName}/${junitConsoleLauncherVersion}/$JUNIT_JAR

# download solution and tests
RUN git clone https://${submitterGithubName}:${submitterGithubToken}@github.com/${submitterGithubName}/${courseGithubName}.git
RUN cp -r ./${courseGithubName}/${assignmentGithubName}/src/* ./src && rm -rf ./${courseGithubName}
RUN git clone https://${testerGithubName}:${testerGithubToken}@github.com/${testerGithubName}/${courseGithubName}.git
RUN cp -r ./${courseGithubName}/${assignmentGithubName}/test/* ./test && rm -rf ./${courseGithubName}

# compile java files
RUN mkdir -p target
RUN find . -name "*.java" | xargs javac -d target/ -cp $JUNIT_JAR:target/

ENTRYPOINT ./run_tests.sh $JUNIT_JAR
