CREATE DATABASE IF NOT EXISTS krishi_mitra;
USE krishi_mitra;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email_mobile VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('farmer', 'admin') DEFAULT 'farmer',
    security_question VARCHAR(255) NOT NULL,
    security_answer VARCHAR(255) NOT NULL,
    reset_request_status ENUM('none', 'pending', 'approved') DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farmers Table
CREATE TABLE IF NOT EXISTS farmers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    village VARCHAR(255),
    land_size DECIMAL(10, 2),
    soil_type VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Queries Table
CREATE TABLE IF NOT EXISTS queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT,
    question TEXT NOT NULL,
    answer TEXT,
    status ENUM('pending', 'answered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Market Prices Table
CREATE TABLE IF NOT EXISTS market_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop VARCHAR(255) NOT NULL,
    mandi VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    date DATE NOT NULL
);

-- Pest & Disease Table
CREATE TABLE IF NOT EXISTS pest_disease (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(255) NOT NULL,
    symptoms TEXT NOT NULL,
    solution TEXT NOT NULL
);

-- Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL
);

-- Sample Admin User (password: password123)
INSERT INTO users (name, email_mobile, password, role, security_question, security_answer) 
VALUES ('Admin', 'admin@krishimitra.com', '$2b$10$0MqVGYa6YW4FJsQsBiCgYuG3LU2TIR7GJUDdBCBDDUhegXMB1QMIq', 'admin', 'What is your birth place?', 'AdminCity')
ON DUPLICATE KEY UPDATE id=id;

-- Sample Data
INSERT INTO market_prices (crop, mandi, price, date) VALUES 
('Wheat', 'Indore Mandi', 2400, '2026-04-13'),
('Rice', 'Nagpur Mandi', 3200, '2026-04-13'),
('Tomato', 'Nashik Mandi', 1500, '2026-04-13');

INSERT INTO pest_disease (crop_name, symptoms, solution) VALUES 
('Wheat', 'Yellowing of leaves, stunted growth', 'Apply Nitrogen-rich fertilizer and ensure proper irrigation.'),
('Rice', 'Brown spots on leaves', 'Use recommended fungicides and maintain water levels.');
