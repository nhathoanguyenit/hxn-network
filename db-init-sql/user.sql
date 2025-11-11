CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    display_name VARCHAR(255),
    avatar_url VARCHAR(255),
    bio TEXT,
    birthday DATE,
    location TEXT,
    interests TEXT[],
    work TEXT,
    visibility VARCHAR(20) DEFAULT 'public',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL, 
    description TEXT
);

CREATE TABLE permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,       
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE user_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    PRIMARY KEY (role_id, permission_id)
);

INSERT INTO roles (code, name, description)
VALUES
  ('ADMIN', 'Administrator', 'Has full system access'),
  ('AGENT', 'Agent', 'Handles operational tasks'),
  ('USER', 'User', 'Read-only access');

INSERT INTO users (id, username, fullname, password, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'ADMIN', 'System Admin', '$2b$10$pdlxxHxI04SCtdMr2ze24ubacfX8hJWVnIdi5kLm29A2mYmMiuKRm', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000001', 'AGENT', 'Support Agent', '$2b$10$pdlxxHxI04SCtdMr2ze24ubacfX8hJWVnIdi5kLm29A2mYmMiuKRm', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'USER', 'Guest User', '$2b$10$pdlxxHxI04SCtdMr2ze24ubacfX8hJWVnIdi5kLm29A2mYmMiuKRm', NOW(), NOW());


-- INSERT INTO users (id, username, fullname, password, created_at, updated_at)
-- VALUES
--   (gen_random_uuid(), 'alice01', 'Alice Nguyen', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'bob02', 'Bob Tran', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'carol03', 'Carol Pham', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'david04', 'David Le', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'emma05', 'Emma Vo', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'frank06', 'Frank Dang', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'grace07', 'Grace Bui', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'henry08', 'Henry Hoang', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'ivy09', 'Ivy Lam', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'jack10', 'Jack Phan', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'kate11', 'Kate Nguyen', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'leo12', 'Leo Do', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'mia13', 'Mia Vu', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'nick14', 'Nick Huynh', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'olivia15', 'Olivia Chau', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'peter16', 'Peter Dinh', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'quinn17', 'Quinn Trinh', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'ryan18', 'Ryan Ly', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'sophia19', 'Sophia Dang', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'tom20', 'Tom Pham', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'uma21', 'Uma Nguyen', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'vinh22', 'Vinh Bui', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'wendy23', 'Wendy Tran', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'xavier24', 'Xavier Le', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'yuri25', 'Yuri Ho', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'zane26', 'Zane Phan', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'hannah27', 'Hannah Dao', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'lucas28', 'Lucas Truong', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'ella29', 'Ella Pham', 'guest123', NOW(), NOW()),
--   (gen_random_uuid(), 'noah30', 'Noah Vo', 'guest123', NOW(), NOW());


INSERT INTO user_profiles (id, user_id, display_name, bio, birthday, location, work, interests, created_at, updated_at)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'System Admin', 'Manages the system', NULL, 'HQ', 'Administrator', ARRAY['management', 'security'], NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Support Agent', 'Handles user support', NULL, 'Remote', 'Support', ARRAY['communication', 'helpdesk'], NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'User', 'Temporary guest account', NULL, NULL, NULL, ARRAY['explore'], NOW(), NOW());

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON (
  (u.username = 'ADMIN' AND r.code = 'ADMIN') OR
  (u.username = 'AGENT' AND r.code = 'AGENT') OR
  (u.username = 'USER' AND r.code = 'USER')
);

SELECT
  u.username,
  array_agg(r.code) AS roles
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
GROUP BY u.username;

