-- Krishi Mitra Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email_mobile TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('farmer', 'admin')) DEFAULT 'farmer',
    security_question TEXT,
    security_answer TEXT,
    reset_request_status TEXT DEFAULT 'none', -- 'none', 'pending', 'approved'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farmers Table
CREATE TABLE IF NOT EXISTS farmers (
    user_id INTEGER PRIMARY KEY,
    village TEXT,
    land_size REAL,
    soil_type TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Crops Table
CREATE TABLE IF NOT EXISTS crops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER,
    crop_name TEXT NOT NULL,
    sowing_date DATE,
    status TEXT DEFAULT 'growing',
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Soil Data Table
CREATE TABLE IF NOT EXISTS soil_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER,
    pH REAL,
    nitrogen REAL,
    phosphorus REAL,
    potassium REAL,
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER,
    crop TEXT,
    suggestion TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Pest & Disease Table
CREATE TABLE IF NOT EXISTS pest_disease (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_name TEXT,
    symptoms TEXT,
    solution TEXT
);

-- Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Queries Table
CREATE TABLE IF NOT EXISTS queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER,
    question TEXT NOT NULL,
    answer TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Market Prices Table
CREATE TABLE IF NOT EXISTS market_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop TEXT NOT NULL,
    mandi TEXT NOT NULL,
    price REAL NOT NULL,
    date DATE NOT NULL
);

-- Weather Cache Table
CREATE TABLE IF NOT EXISTS weather_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT UNIQUE,
    data TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample Data
INSERT INTO users (name, email_mobile, password, role, security_question, security_answer) VALUES ('Admin', 'admin@krishimitra.com', '$2b$10$0MqVGYa6YW4FJsQsBiCgYuG3LU2TIR7GJUDdBCBDDUhegXMB1QMIq', 'admin', 'What is your birth place?', 'AdminCity'); -- password: password123
INSERT INTO pest_disease (crop_name, symptoms, solution) VALUES 
('Wheat', 'Yellowing of leaves, stunted growth', 'Apply Nitrogen-rich fertilizer and ensure proper irrigation.'),
('Rice', 'Brown spots on leaves', 'Use recommended fungicides and maintain water levels.'),
('Tomato', 'Wilting of plants', 'Check for soil-borne pathogens, use crop rotation.');

INSERT INTO knowledge_base (title, content, category) VALUES 
('Organic Farming Tips', 'Use compost and natural manure to improve soil health...', 'General'),
('Water Management', 'Drip irrigation can save up to 50% water...', 'Irrigation');

INSERT INTO market_prices (crop, mandi, price, date) VALUES 
('Wheat', 'Indore Mandi', 2400, '2026-04-13'),
('Rice', 'Nagpur Mandi', 3200, '2026-04-13'),
('Tomato', 'Nashik Mandi', 1500, '2026-04-13');
