const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

const fallbackUri = 'mysql://root:SVWvJbvYkFQhLsfsvBONkVkmnbJhCBry@zephyr.proxy.rlwy.net:32700/railway';
const uri = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || fallbackUri;

pool = mysql.createPool(uri);

module.exports = pool;
