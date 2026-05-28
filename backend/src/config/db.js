const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

if (process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL) {
  const uri = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
  pool = mysql.createPool(uri);
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'expense_tracker',
    waitForConnections: true,
    connectionLimit: 10,
  });
}

module.exports = pool;
