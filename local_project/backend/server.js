const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'krishi_mitra_local_secret';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // Change this to your MySQL password
    database: 'krishi_mitra'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL Connection Failed:', err.message);
    } else {
        console.log('Connected to MySQL Database.');
    }
});

// --- ROUTES ---

app.post('/register', async (req, res) => {
    const { name, email_mobile, password, role, village, land_size, soil_type, security_question, security_answer } = req.body;
    
    if (!name || !email_mobile || !password || !security_question || !security_answer) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const userSql = 'INSERT INTO users (name, email_mobile, password, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(userSql, [name, email_mobile, hashedPassword, role || 'farmer', security_question, security_answer], (err, result) => {
            if (err) {
                console.error('Registration Error:', err.message);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email or Mobile already exists' });
                }
                return res.status(500).json({ error: err.message });
            }

            const userId = result.insertId;
            if (role !== 'admin') {
                const farmerSql = 'INSERT INTO farmers (user_id, village, land_size, soil_type) VALUES (?, ?, ?, ?)';
                db.query(farmerSql, [userId, village, land_size, soil_type], (err) => {
                    if (err) console.error('Farmer Details Error:', err.message);
                });
            }
            
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', (req, res) => {
    const { email_mobile, password } = req.body;
    if (!email_mobile || !password) {
        return res.status(400).json({ error: 'Credentials required' });
    }

    const sql = 'SELECT * FROM users WHERE email_mobile = ?';
    db.query(sql, [email_mobile], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
});

app.post('/admin/login', (req, res) => {
    const { email_mobile, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email_mobile = ? AND role = "admin"';
    db.query(sql, [email_mobile], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(403).json({ error: 'Admin access denied' });

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
});

// --- ADDITIONAL DATA ROUTES ---

app.get('/api/market-prices', (req, res) => {
    db.query('SELECT * FROM market_prices ORDER BY date DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/pest-disease', (req, res) => {
    db.query('SELECT * FROM pest_disease', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/knowledge-base', (req, res) => {
    db.query('SELECT * FROM knowledge_base', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/farmer/dashboard/:id', (req, res) => {
    res.json({
        crops: [],
        notifications: [
            { message: 'Welcome to Krishi Mitra!', created_at: new Date() }
        ]
    });
});

app.get('/api/farmer/queries/:id', (req, res) => {
    db.query('SELECT * FROM queries WHERE farmer_id = ? ORDER BY created_at DESC', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/farmer/queries', (req, res) => {
    const { farmer_id, question } = req.body;
    db.query('INSERT INTO queries (farmer_id, question) VALUES (?, ?)', [farmer_id, question], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Query submitted' });
    });
});

app.post('/api/advisory/recommend', (req, res) => {
    const { soil_type, pH } = req.body;
    let recommendation = 'Based on your soil, we recommend Rice or Wheat.';
    if (soil_type === 'Black') recommendation = 'Black soil is excellent for Cotton and Soybeans.';
    if (soil_type === 'Red') recommendation = 'Red soil is suitable for Groundnuts and Pulses.';
    res.json({ recommendation });
});

app.post('/api/soil/test', (req, res) => {
    const { pH, nitrogen, phosphorus, potassium } = req.body;
    let suggestion = 'Your soil health is good. Maintain organic matter.';
    if (pH < 6) suggestion = 'Soil is acidic. Add lime to balance pH.';
    if (nitrogen < 50) suggestion = 'Nitrogen is low. Use urea or compost.';
    res.json({ suggestion });
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
    const stats = { farmers: 0, pendingQueries: 0 };
    db.query('SELECT COUNT(*) as count FROM users WHERE role = "farmer"', (err, results) => {
        if (!err) stats.farmers = results[0].count;
        db.query('SELECT COUNT(*) as count FROM queries WHERE status = "pending"', (err, results) => {
            if (!err) stats.pendingQueries = results[0].count;
            res.json(stats);
        });
    });
});

// Admin Queries
app.get('/api/admin/queries', (req, res) => {
    const sql = 'SELECT q.*, u.name FROM queries q JOIN users u ON q.farmer_id = u.id ORDER BY q.created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Admin Users
app.get('/api/admin/users', (req, res) => {
    db.query('SELECT id, name, email_mobile, role, created_at FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Admin Reply
app.post('/api/admin/reply', (req, res) => {
    const { query_id, answer } = req.body;
    db.query('UPDATE queries SET answer = ?, status = "answered" WHERE id = ?', [answer, query_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Reply sent' });
    });
});

// Forgot Password - Check User
app.post('/api/auth/forgot-password/check', (req, res) => {
    const { email_mobile } = req.body;
    db.query('SELECT security_question FROM users WHERE email_mobile = ?', [email_mobile], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ security_question: results[0].security_question });
    });
});

// Forgot Password - Verify Answer & Reset
app.post('/api/auth/forgot-password/verify', (req, res) => {
    const { email_mobile, security_answer, new_password } = req.body;
    db.query('SELECT * FROM users WHERE email_mobile = ?', [email_mobile], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        
        const user = results[0];
        if (user.security_answer !== security_answer) {
            return res.status(401).json({ error: 'Incorrect security answer' });
        }

        const hashedPassword = bcrypt.hashSync(new_password, 10);
        db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Password reset successful' });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
