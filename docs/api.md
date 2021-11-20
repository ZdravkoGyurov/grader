## Auth

- GET /login/oauth/github - login
- GET /login/oauth/github/callback - callback used by github
- GET /userInfo - get info about user
- POST /token - get access token by providing refresh token
- DELETE /logout - logout

## Course

- POST /course - create course
- GET /course - get all user courses
- GET /course/{id} - get course by id
- PATCH /course/{id} - edit course name, description
- DELETE /course/{id} - delete course by id

## Assignment

- POST /assignment - create assignment, **course_id in body**
- GET /assignment - get all course assignments, **course_id in query**
- GET /assignment/{id} - get assignment by id
- PATCH /assignment/{id} - edit assignment name, description
- DELETE /assignment/{id} - delete assignment by id

## Submission

- CREATE /submission - create submission, **assignment_id in body**
- GET /submission - get all user submissions, **assignment_id in body**
- GET /submission/{id} - get submission by id, **assignment_id in body**
