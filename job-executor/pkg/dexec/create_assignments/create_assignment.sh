create_assignments_readme () {
  mkdir $ASSIGNMENT_PATH
  echo $ASSIGNMENT_NAME > ./$ASSIGNMENT_PATH/README.md
}

push_assignment () {
  gitlab_username=$1

  rm -rf .git
  git clone https://$USER:$PAT@$GITLAB_HOST/$ROOT_GROUP/$COURSE_GROUP/$gitlab_username.git
  cp -r ./$ASSIGNMENT_PATH $gitlab_username
  cd $gitlab_username
  git checkout -b master
  git add ./$ASSIGNMENT_PATH
  git commit -m "add assignment $ASSIGNMENT_NAME"
  git push origin master
  cd ..
  rm -rf $gitlab_username
}

echo "creating README.md for assignment $ASSIGNMENT_NAME"
create_assignments_readme || exit 1

git config --global user.email $USER_EMAIL
git config --global user.name $USER
for gitlab_username in $(echo $GITLAB_USERNAMES | tr ";" "\n")
do
  echo "pushing assignment to user $gitlab_username"
  push_assignment $gitlab_username || exit 1
done

echo "created assignment successfully"
