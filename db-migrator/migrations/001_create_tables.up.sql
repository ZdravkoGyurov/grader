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
    gitlab_id TEXT,
    refresh_token TEXT,
    role_name TEXT NOT NULL,
    PRIMARY KEY(email),
    CONSTRAINT fk_role_name FOREIGN KEY(role_name) REFERENCES role(name)
);

CREATE TABLE IF NOT EXISTS course (
    id uuid DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    gitlab_id TEXT NOT NULL,
    gitlab_name TEXT NOT NULL,
    creator_email TEXT NOT NULL,
	created_on TIMESTAMP NOT NULL,
	last_edited_on TIMESTAMP NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_user_email FOREIGN KEY(creator_email) REFERENCES users(email)
);

CREATE TABLE IF NOT EXISTS assignment (
    id uuid DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    gitlab_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    course_id uuid NOT NULL,
	created_on TIMESTAMP NOT NULL,
	last_edited_on TIMESTAMP NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_user_email FOREIGN KEY(author_email) REFERENCES users(email),
    CONSTRAINT fk_course_id FOREIGN KEY(course_id) REFERENCES course(id)
);

CREATE TABLE IF NOT EXISTS submission (
    id uuid DEFAULT uuid_generate_v4(),
    result TEXT,
    points SMALLINT,
    submission_status_name TEXT NOT NULL,
    submitter_email TEXT NOT NULL,
	submitted_on TIMESTAMP NOT NULL,
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