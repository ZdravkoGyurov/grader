CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS role (
    id SERIAL,
    name TEXT,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS submission_status (
    id SERIAL,
    name TEXT,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS users (
    email TEXT,
    name TEXT NOT NULL,
    avatar_url TEXT,
    refresh_token TEXT,
    github_access_token TEXT,
    role_id INT NOT NULL,
    PRIMARY KEY(email),
    CONSTRAINT fk_role_id FOREIGN KEY(role_id) REFERENCES role(id)
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
    result jsonb,
    submission_status_id INT NOT NULL,
    submitter_email TEXT NOT NULL,
    assignment_id uuid NOT NULL, 
    PRIMARY KEY(id),
    CONSTRAINT fk_submission_status_id FOREIGN KEY(submission_status_id) REFERENCES submission_status(id),
    CONSTRAINT fk_user_email FOREIGN KEY(submitter_email) REFERENCES users(email),
    CONSTRAINT fk_assignment_id FOREIGN KEY(assignment_id) REFERENCES assignment(id)
);

CREATE TABLE IF NOT EXISTS user_course (
    user_email TEXT,
    course_id uuid,
    PRIMARY KEY(user_email, course_id),
    CONSTRAINT fk_user_email FOREIGN KEY(user_email) REFERENCES users(email),
    CONSTRAINT fk_course_id FOREIGN KEY(course_id) REFERENCES course(id)
);
