CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS hxn_chat;

CREATE TABLE hxn_chat.chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR NOT NULL,
    title VARCHAR NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE hxn_chat.chat_participants (
    chat_id UUID NOT NULL,
    user_id UUID NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE hxn_chat.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    sender_name VARCHAR(255),
    content TEXT NULL,
    reply_to UUID NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE hxn_chat.chat_message_statuses (
    message_id UUID NOT NULL,
    user_id UUID NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE NULL,
    read_at TIMESTAMP WITH TIME ZONE NULL,
    PRIMARY KEY (message_id, user_id)
);

CREATE TABLE hxn_chat.chat_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL,
    file_url VARCHAR NOT NULL,
    file_type VARCHAR NULL,
    file_size INTEGER NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

INSERT INTO hxn_chat.chats (id, type, title, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'public',
    'General',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;
