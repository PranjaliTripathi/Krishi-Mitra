import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'krishimitra.db');
const schemaPath = path.join(__dirname, 'schema.sql');

export const initDB = () => {
    try {
        const db = new Database(dbPath);
        console.log('Connected to the SQLite database.');

        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema);
        console.log('Database schema initialized.');
        
        db.close();
        return true;
    } catch (err: any) {
        console.error('Error initializing database:', err.message);
        return false;
    }
};

// Check if this script is being run directly
if (process.argv[1] && (process.argv[1].includes('init_db'))) {
    initDB();
}
