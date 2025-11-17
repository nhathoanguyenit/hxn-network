-- Active: 1761033786548@@10.8.0.1@5432@hxn_core
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS hxn_graphic;

CREATE TABLE hxn_graphic.models_ (
    id_ UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ TEXT NOT NULL,
    description_ TEXT,
    created_at_ TIMESTAMP DEFAULT NOW(),
    updated_at_ TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hxn_graphic.objects_ (
    id_ UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id_ UUID NOT NULL,
    name_ TEXT NOT NULL,
    parent_id_ INT,
    position_ FLOAT8[] DEFAULT ARRAY[0, 0, 0],
    rotation_ FLOAT8[] DEFAULT ARRAY[0, 0, 0],
    scale FLOAT8[] DEFAULT ARRAY[1, 1, 1],
    created_at_ TIMESTAMP DEFAULT NOW(),
    updated_at_ TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hxn_graphic.geometry_ (
    id_ UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_id_ UUID NOT NULL,
    vertices_ JSONB NOT NULL,
    indices_ JSONB, 
    normals_ JSONB,
    uvs_ JSONB,
    created_at_ TIMESTAMP DEFAULT NOW(),
    updated_at_ TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hxn_graphic.materials_ (
    id_ UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_id_ UUID NOT NULL,
    color_ TEXT DEFAULT '#ffffff',
    roughness_ FLOAT8 DEFAULT 0.5,
    metalness_ FLOAT8 DEFAULT 0.0,
    texture_url_ TEXT,
    created_at_ TIMESTAMP DEFAULT NOW(),
    updated_at_ TIMESTAMP DEFAULT NOW()
);

-- Insert a sample model
