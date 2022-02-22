pull_submissions () {
  git clone --quiet https://$GRADER_GITLAB_NAME:$GRADER_GITLAB_PAT@$GRADER_GITLAB_HOST/$GRADER_GITLAB_NAME/$COURSE_GITLAB_NAME/$SUBMITTER_GITLAB_NAME.git
  cp -r ./$SUBMITTER_GITLAB_NAME/$ASSIGNMENT_GITLAB_NAME/src/* src/ && rm -rf ./$SUBMITTER_GITLAB_NAME
  git clone --quiet https://$GRADER_GITLAB_NAME:$GRADER_GITLAB_PAT@$GRADER_GITLAB_HOST/$GRADER_GITLAB_NAME/$COURSE_GITLAB_NAME/$TESTER_GITLAB_NAME.git
  cp -r ./$TESTER_GITLAB_NAME/$ASSIGNMENT_GITLAB_NAME/test/* test/ && rm -rf ./$TESTER_GITLAB_NAME
}

compile_java_files () {
  mkdir -p target
  find . -name "*.java" | xargs javac -d target/ -cp $JUNIT_JAR:target/
}

run_tests () {
  java -jar $JUNIT_JAR -cp target --scan-class-path --disable-ansi-colors --disable-banner --details=tree > output.txt

  grep "tests successful\|tests failed" output.txt | \
  awk -F '[[:space:]][[:space:]]+' '{print $2}' | \
  awk -F '[[:space:]][[:space:]]+' '{print $1}'

  grep "✘" output.txt | awk -F '✘ ' '{print $2}'
}

pull_submissions || exit 1
compile_java_files || exit 1
run_tests || exit 1
