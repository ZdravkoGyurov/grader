DROP TABLE IF EXISTS user_course;
DROP TABLE IF EXISTS submission;
DROP TABLE IF EXISTS assignment;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS submission_status;
DROP TABLE IF EXISTS course_role;
DROP TABLE IF EXISTS role;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS role (
    name TEXT,
    PRIMARY KEY(name)
);

CREATE TABLE IF NOT EXISTS course_role (
    name TEXT,
    PRIMARY KEY(name)
);

CREATE TABLE IF NOT EXISTS submission_status (
    name TEXT,
    PRIMARY KEY(name)
);

CREATE TABLE IF NOT EXISTS users (
    email TEXT,
    name TEXT NOT NULL,
    avatar_url TEXT,
    refresh_token TEXT,
    github_access_token TEXT,
    role_name TEXT NOT NULL,
    PRIMARY KEY(email),
    CONSTRAINT fk_role_name FOREIGN KEY(role_name) REFERENCES role(name)
);

CREATE TABLE IF NOT EXISTS course (
    id uuid DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    github_name TEXT NOT NULL,
    creator_email TEXT NOT NULL,
	created_on DATE NOT NULL,
	last_edited_on DATE NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_user_email FOREIGN KEY(creator_email) REFERENCES users(email)
);

CREATE TABLE IF NOT EXISTS assignment (
    id uuid DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    author_email TEXT NOT NULL,
    course_id uuid NOT NULL,
    github_name TEXT NOT NULL,
	created_on DATE NOT NULL,
	last_edited_on DATE NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_user_email FOREIGN KEY(author_email) REFERENCES users(email),
    CONSTRAINT fk_course_id FOREIGN KEY(course_id) REFERENCES course(id)
);

CREATE TABLE IF NOT EXISTS submission (
    id uuid DEFAULT uuid_generate_v4(),
    result TEXT,
    submission_status_name TEXT NOT NULL,
    submitter_email TEXT NOT NULL,
    assignment_id uuid NOT NULL, 
    PRIMARY KEY(id),
    CONSTRAINT fk_submission_status_name FOREIGN KEY(submission_status_name) REFERENCES submission_status(name),
    CONSTRAINT fk_user_email FOREIGN KEY(submitter_email) REFERENCES users(email),
    CONSTRAINT fk_assignment_id FOREIGN KEY(assignment_id) REFERENCES assignment(id)
);

CREATE TABLE IF NOT EXISTS user_course (
    user_email TEXT,
    course_id uuid,
    course_role_name TEXT,
    PRIMARY KEY(user_email, course_id),
    CONSTRAINT fk_user_email FOREIGN KEY(user_email) REFERENCES users(email),
    CONSTRAINT fk_course_id FOREIGN KEY(course_id) REFERENCES course(id),
    CONSTRAINT fk_course_role_name FOREIGN KEY(course_role_name) REFERENCES course_role(name)
);

INSERT INTO role(name)
VALUES('Admin'), ('Teacher'), ('Student');

INSERT INTO course_role(name)
VALUES('Assistant'), ('Student');

INSERT INTO submission_status(name)
VALUES('Success'), ('Pending'), ('Fail');

-- UPDATE users SET role_name='Admin' WHERE email='zdravko.gyurov97@gmail.com';