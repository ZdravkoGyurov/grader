CREATE TABLE IF NOT EXISTS role (
    id SERIAL,
    name TEXT,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS user_info (
    email TEXT,
    name TEXT,
    avatar_url TEXT,
    refresh_token TEXT,
    github_access_token TEXT,
    role_id INT,
    PRIMARY KEY(email),
    CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES role(id)
);

INSERT INTO role(name)
VALUES('Admin'), ('Teacher'), ('Student');