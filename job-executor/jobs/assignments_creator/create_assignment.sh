create_assignments_readme () {
  for assignment_path in $(echo $ASSIGNMENT_PATHS | tr ";" "\n")
  do
    echo "creating README.md for assignment $assignment_path"
    mkdir $assignment_path
    echo $assignment_path > ./$assignment_path/README.md
  done
}

push_assignment () {
  gitlab_username=$1

  rm -rf .git
  git clone https://$USER:$PAT@$GITLAB_HOST/$ROOT_GROUP/$COURSE_GROUP/$gitlab_username.git

  for assignment_path in $(echo $ASSIGNMENT_PATHS | tr ";" "\n")
  do
    cp -r ./$assignment_path $gitlab_username
  done

  cd $gitlab_username
  git checkout -b master

  for assignment_path in $(echo $ASSIGNMENT_PATHS | tr ";" "\n")
  do
    git add ./$assignment_path
  done

  git commit -m "add assignment(s)"
  git push origin master
  cd ..
  rm -rf $gitlab_username
}

create_assignments_readme || exit 1

git config --global user.email $USER_EMAIL
git config --global user.name $USER
for gitlab_username in $(echo $GITLAB_USERNAMES | tr ";" "\n")
do
  echo "pushing assignment to user $gitlab_username"
  push_assignment $gitlab_username || exit 1
done

echo "created assignment successfully"
