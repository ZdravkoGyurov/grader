FROM openjdk:18-jdk-alpine3.15

ARG assignment=assignment1
ARG solutionGitUser=ZdravkoGyurov
ARG solutionGitUserToken=xxx
ARG solutionGitRepo=grader-java-example
ARG testsGitUser=ZdravkoGyurov
ARG testsGitUserToken=xxx
ARG testsGitRepo=grader-java-example
ARG junitConsoleLauncherName=junit-platform-console-standalone
ARG junitConsoleLauncherVersion=1.8.2
ENV JUNIT_JAR ${junitConsoleLauncherName}-${junitConsoleLauncherVersion}.jar

WORKDIR /app

COPY ./run_tests.sh .

# download dependencies
RUN apk update && apk upgrade && apk add --no-cache git
RUN wget https://repo1.maven.org/maven2/org/junit/platform/${junitConsoleLauncherName}/${junitConsoleLauncherVersion}/$JUNIT_JAR

# download solution and tests
RUN git clone https://${solutionGitUser}:${solutionGitUserToken}@github.com/${solutionGitUser}/${solutionGitRepo}.git
RUN cp -r ./${solutionGitRepo}/${assignment}/src/* ./src && rm -rf ./${solutionGitRepo}
RUN git clone https://${testsGitUser}:${testsGitUserToken}@github.com/${testsGitUser}/${testsGitRepo}.git
RUN cp -r ./${testsGitRepo}/${assignment}/test/* ./test && rm -rf ./${testsGitRepo}

# compile java files
RUN mkdir -p target
RUN find . -name "*.java" | xargs javac -d target/ -cp $JUNIT_JAR:target/

ENTRYPOINT ./run_tests.sh $JUNIT_JAR
