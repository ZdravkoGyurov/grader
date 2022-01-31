INSERT INTO role(name)
VALUES('Admin'), ('Teacher'), ('Student');

INSERT INTO course_role(name)
VALUES('Assistant'), ('Student');

INSERT INTO submission_status(name)
VALUES('Success'), ('Pending'), ('Fail');

INSERT INTO users(email, name, avatar_url, gitlab_id, refresh_token, role_name) 
VALUES ('test@test', 'test', 'testavatar', '1', '', 'Student');