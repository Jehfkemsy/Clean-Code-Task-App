CREATE TABLE users (
    user_id    CHAR(26) PRIMARY KEY NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    biography  TEXT,
    username   VARCHAR(20)  NOT NULL,
    email      VARCHAR(100) NOT NULL,
    password   CHAR(60)     NOT NULL
);