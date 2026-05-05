# Krishi Mitra - Smart Farmer Advisory System (Local Setup)

This project is a fully functional local version of Krishi Mitra. It uses a Node.js backend and a MySQL database.

## Prerequisites
1. **Node.js**: Install from [nodejs.org](https://nodejs.org/)
2. **MySQL**: Install MySQL Server and Workbench.

## Step 1: Database Setup
1. Open MySQL Workbench.
2. Run the SQL script located in `database/krishi.sql`.
3. This will create the `krishi_mitra` database and all required tables.

## Step 2: Backend Setup
1. Open the `backend` folder in your terminal.
2. Run `npm install` to install dependencies.
3. Open `server.js` and update the MySQL password:
   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: 'your_password', // UPDATE THIS
       database: 'krishi_mitra'
   });
   ```
4. Run `node server.js` to start the backend.
5. The server will run on `http://localhost:5000`.

## Step 3: Frontend Setup
1. Simply open `frontend/index.html` in your web browser.
2. You can also use a VS Code extension like "Live Server" for a better experience.

## Features
- **Farmer Registration & Login**: Secure authentication with password hashing.
- **Admin Portal**: Manage users and reply to farmer queries.
- **Crop Advisory**: Get recommendations based on soil type.
- **Soil Health**: Analyze soil test results with charts.
- **Market Prices**: Real-time view of crop prices.
- **Multilingual Support**: Toggle between English and Hindi.

## Troubleshooting
- **CORS Error**: Ensure the backend is running and `cors` is enabled in `server.js`.
- **Database Connection**: Check if MySQL service is running and credentials are correct.
- **Fetch Errors**: Ensure the backend URL in frontend files matches `http://localhost:5000`.
