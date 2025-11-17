-- Active: 1761033786548@@10.8.0.1@5432@hxn_core
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS hxn_graphic;

CREATE TABLE hxn_graphic.models_ (
    id_ UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ TEXT NOT NULL,
    type_ VARCHAR NOT NULL,
    description_ TEXT,
    data_ JSON,
    created_at_ TIMESTAMP DEFAULT NOW(),
    updated_at_ TIMESTAMP DEFAULT NOW()
);


