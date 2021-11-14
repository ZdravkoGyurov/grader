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

- POST /course/{id}/assignment - create assignment
- GET /course/{id}/assignment - get all course assignments
- GET /course/{id}/assignment/{id} - get assignment by id
- PATCH /course/{id}/assignment/{id} - edit assignment name, description
- DELETE /course/{id}/assignment/{id} - delete assignment by id

## Submission

- CREATE /course/{id}/assignment/{id}/submission - create submission
- GET /course/{id}/assignment/{id}/submission - get all submissions
- GET /course/{id}/assignment/{id}/submission/{id} - get submission by id
