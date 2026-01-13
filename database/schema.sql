CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    group_name VARCHAR(50) DEFAULT 'stable', -- 'canary', 'stable'
    current_version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'offline', -- 'online', 'offline', 'updating'
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS firmware_versions (
    id SERIAL PRIMARY KEY,
    version_string VARCHAR(50) UNIQUE NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS deployments (
    id SERIAL PRIMARY KEY,
    firmware_id INTEGER REFERENCES firmware_versions(id),
    target_group VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    message TEXT,
    log_level VARCHAR(20) DEFAULT 'info',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
