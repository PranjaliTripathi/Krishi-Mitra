import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const SECRET_KEY = 'krishi_mitra_secret_key';

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));

// Database Connection
const dbDir = path.join(__dirname, 'database');
// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'krishimitra.db');
let db: any;
try {
    db = new Database(dbPath);
    console.log('Connected to Krishi Mitra Database at', dbPath);
} catch (err: any) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
}

// Initialize Database Schema
const schemaPath = path.join(__dirname, 'database', 'schema.sql');
if (fs.existsSync(schemaPath)) {
    try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // Split schema into individual statements to avoid issues with some SQL engines
        // and to allow partial success if some tables already exist
        db.exec(schema);
        console.log('Database schema initialized successfully.');
    } catch (err: any) {
        console.warn('Database schema initialization notice (might already exist):', err.message);
    }
}

// --- AUTH ROUTES ---

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Alias routes as requested by user
app.post('/register', (req, res) => {
    console.log('Handling /register alias');
    // Forward to existing logic or just handle here
    handleRegister(req, res);
});

app.post('/login', (req, res) => {
    console.log('Handling /login alias');
    handleLogin(req, res);
});

app.post('/admin/login', (req, res) => {
    console.log('Handling /admin/login alias');
    handleLogin(req, res, true); // true for admin check
});

async function handleRegister(req: any, res: any) {
    const { name, email_mobile, password, role, village, land_size, soil_type, security_question, security_answer } = req.body;
    
    if (!name || !email_mobile || !password || !security_question || !security_answer) {
        console.log('Registration failed: Missing fields');
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const insertUser = db.prepare('INSERT INTO users (name, email_mobile, password, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?)');
        const result = insertUser.run(name, email_mobile, hashedPassword, role || 'farmer', security_question, security_answer);
        
        if (role !== 'admin') {
            const insertFarmer = db.prepare('INSERT INTO farmers (user_id, village, land_size, soil_type) VALUES (?, ?, ?, ?)');
            insertFarmer.run(result.lastInsertRowid, village, land_size, soil_type);
        }
        
        console.log(`User registered successfully: ${email_mobile}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err: any) {
        console.error('Registration error:', err.message);
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email or Mobile already exists' });
        }
        res.status(400).json({ error: err.message });
    }
}

async function handleLogin(req: any, res: any, isAdminOnly = false) {
    const { email_mobile, password } = req.body;
    if (!email_mobile || !password) {
        console.log('Login failed: Missing credentials');
        return res.status(400).json({ error: 'Email/Mobile and Password are required' });
    }
    try {
        const user: any = db.prepare('SELECT * FROM users WHERE email_mobile = ?').get(email_mobile);
        if (!user) {
            console.log(`Login failed: User not found (${email_mobile})`);
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            console.log(`Login failed: Invalid password for ${email_mobile}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (isAdminOnly && user.role !== 'admin') {
            console.log(`Login failed: Access denied for ${email_mobile} (Not an admin)`);
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
        console.log(`Login successful: ${email_mobile} (${user.role})`);
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err: any) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

app.post('/api/auth/register', async (req, res) => {
    handleRegister(req, res);
});

app.post('/api/auth/login', async (req, res) => {
    handleLogin(req, res);
});

// --- FORGOT PASSWORD ROUTES ---

app.post('/api/auth/forgot-password/check', (req, res) => {
    const { email_mobile } = req.body;
    try {
        const user: any = db.prepare('SELECT security_question FROM users WHERE email_mobile = ?').get(email_mobile);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ security_question: user.security_question });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/forgot-password/verify', async (req, res) => {
    const { email_mobile, security_answer, new_password } = req.body;
    try {
        const user: any = db.prepare('SELECT * FROM users WHERE email_mobile = ?').get(email_mobile);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.security_answer !== security_answer) {
            return res.status(401).json({ error: 'Incorrect security answer' });
        }

        const hashedPassword = bcrypt.hashSync(new_password, 10);
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, user.id);
        res.json({ message: 'Password reset successful' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/forgot-password/request-admin', (req, res) => {
    const { email_mobile } = req.body;
    try {
        const user: any = db.prepare('SELECT id FROM users WHERE email_mobile = ?').get(email_mobile);
        if (!user) return res.status(404).json({ error: 'User not found' });

        db.prepare('UPDATE users SET reset_request_status = "pending" WHERE id = ?').run(user.id);
        res.json({ message: 'Reset request sent to admin' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- FARMER ROUTES ---

app.get('/api/farmer/profile/:id', (req, res) => {
    try {
        const profile = db.prepare(
            'SELECT u.name, u.email_mobile, f.* FROM users u JOIN farmers f ON u.id = f.user_id WHERE u.id = ?'
        ).get(req.params.id);
        res.json(profile);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/farmer/dashboard/:id', (req, res) => {
    try {
        const crops = db.prepare('SELECT * FROM crops WHERE farmer_id = ?').all(req.params.id);
        const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5').all(req.params.id);
        const weather = db.prepare('SELECT * FROM weather_cache LIMIT 1').get();
        res.json({ crops, notifications, weather });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/farmer/query', (req, res) => {
    const { farmer_id, question } = req.body;
    try {
        db.prepare('INSERT INTO queries (farmer_id, question) VALUES (?, ?)').run(farmer_id, question);
        res.status(201).json({ message: 'Query submitted' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/farmer/queries/:id', (req, res) => {
    try {
        const queries = db.prepare('SELECT * FROM queries WHERE farmer_id = ? ORDER BY created_at DESC').all(req.params.id);
        res.json(queries);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADVISORY LOGIC (Rule-based) ---
app.post('/api/advisory/recommend', (req, res) => {
    const { soil_type, pH } = req.body;
    let recommendation = '';
    
    if (soil_type === 'Alluvial') {
        recommendation = 'Wheat, Rice, Sugarcane are highly recommended.';
    } else if (soil_type === 'Black') {
        recommendation = 'Cotton, Soyabean, Wheat are suitable.';
    } else if (soil_type === 'Red') {
        recommendation = 'Groundnut, Millets, Pulses are best.';
    } else {
        recommendation = 'General vegetables and local hardy crops.';
    }

    if (pH !== null && typeof pH === 'number') {
        if (pH < 6) recommendation += ' Add lime to balance acidity.';
        else if (pH > 7.5) recommendation += ' Use gypsum to reduce alkalinity.';
    }

    res.json({ recommendation });
});

// --- SOIL HEALTH ---
app.post('/api/soil/test', (req, res) => {
    const { farmer_id, pH, nitrogen, phosphorus, potassium } = req.body;
    try {
        db.prepare(
            'INSERT INTO soil_data (farmer_id, pH, nitrogen, phosphorus, potassium) VALUES (?, ?, ?, ?, ?)'
        ).run(farmer_id, pH, nitrogen, phosphorus, potassium);
        
        let suggestion = 'Soil health is good.';
        if (nitrogen < 20) suggestion = 'Add Urea or organic manure to increase Nitrogen.';
        else if (phosphorus < 15) suggestion = 'Add DAP for Phosphorus.';
        
        res.json({ suggestion });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- KNOWLEDGE BASE ---
app.get('/api/knowledge', (req, res) => {
    try {
        const articles = db.prepare('SELECT * FROM knowledge_base').all();
        res.json(articles);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- MARKET PRICES ---
app.get('/api/market', (req, res) => {
    try {
        const prices = db.prepare('SELECT * FROM market_prices').all();
        res.json(prices);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- PEST & DISEASE ---
app.get('/api/pest', (req, res) => {
    try {
        const pests = db.prepare('SELECT * FROM pest_disease').all();
        res.json(pests);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTES ---

app.get('/api/admin/users', (req, res) => {
    try {
        const users = db.prepare('SELECT id, name, email_mobile, role, reset_request_status, created_at FROM users').all();
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/reset-requests', (req, res) => {
    try {
        const requests = db.prepare('SELECT id, name, email_mobile FROM users WHERE reset_request_status = "pending"').all();
        res.json(requests);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/approve-reset', (req, res) => {
    const { user_id, new_password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(new_password, 10);
        db.prepare('UPDATE users SET password = ?, reset_request_status = "approved" WHERE id = ?').run(hashedPassword, user_id);
        res.json({ message: 'Password reset and request approved' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/reject-reset', (req, res) => {
    const { user_id } = req.body;
    try {
        db.prepare('UPDATE users SET reset_request_status = "none" WHERE id = ?').run(user_id);
        res.json({ message: 'Reset request rejected' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/reset-password', (req, res) => {
    const { user_id, new_password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(new_password, 10);
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, user_id);
        res.json({ message: 'Password reset successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/stats', (req, res) => {
    try {
        const farmersCount: any = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "farmer"').get();
        const queriesCount: any = db.prepare('SELECT COUNT(*) as count FROM queries WHERE status = "pending"').get();
        res.json({ farmers: farmersCount.count, pendingQueries: queriesCount.count });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/queries', (req, res) => {
    try {
        const queries = db.prepare('SELECT q.*, u.name FROM queries q JOIN users u ON q.farmer_id = u.id ORDER BY q.created_at DESC').all();
        res.json(queries);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/reply', (req, res) => {
    const { query_id, answer } = req.body;
    try {
        db.prepare('UPDATE queries SET answer = ?, status = "answered" WHERE id = ?').run(answer, query_id);
        res.json({ message: 'Reply sent' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Serve Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
