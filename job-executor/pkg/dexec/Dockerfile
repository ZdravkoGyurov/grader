FROM openjdk:18-jdk-alpine3.15

ARG junitConsoleLauncherName=junit-platform-console-standalone
ARG junitConsoleLauncherVersion=1.8.2

ENV JUNIT_JAR ${junitConsoleLauncherName}-${junitConsoleLauncherVersion}.jar

WORKDIR /app

RUN wget https://repo1.maven.org/maven2/org/junit/platform/${junitConsoleLauncherName}/${junitConsoleLauncherVersion}/$JUNIT_JAR

# TODO
# pull /src from student
# pull /test from teacher repo
COPY ./src .
COPY ./test .
COPY ./run_tests.sh .

RUN mkdir -p target
RUN find . -name "*.java" | xargs javac -d target/ -cp $JUNIT_JAR:target/

ENTRYPOINT ./run_tests.sh $JUNIT_JAR
