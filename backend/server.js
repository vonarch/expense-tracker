require('dotenv').config();
const express = require('express');
const cors = require('cors');
const os = require('os');
const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Global Middleware
app.use(cors());
app.use(express.json());

// Simple Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  next();
});

// 2. Database Connection Verification
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('🐬 Connected to XAMPP MySQL Database successfully!');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 TIP: Make sure XAMPP (MySQL) is running and you created the "expense_tracker" database.');
  }
}
testDatabaseConnection();

// Make the pool accessible globally across controllers if needed
app.set('db', pool);

// 3. API Routes Mounting
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const goalRoutes = require('./src/routes/goalRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/goals', goalRoutes);

// Health check for /api
app.get('/api', (req, res) => {
  res.json({
    status: "online",
    message: "Expense Tracker API is reachable!",
    endpoints: ["/auth", "/transactions", "/categories", "/goals"]
  });
});

// Fallback Root Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Expense Tracker API!" });
});

// 4. LAN IP printer helper function for Mobile Connections
const getLanAddresses = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if ((iface.family === 'IPv4' || iface.family === 4) && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
};

// 5. Start Server Listener
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running locally on http://localhost:${PORT}`);
  
  const lan = getLanAddresses();
  if (lan.length > 0) {
    console.log('\n📱 Base API endpoints for your frontend / phone calls:');
    lan.forEach((ip) => {
      console.log(`👉 http://${ip}:${PORT}/api`);
    });
    console.log('\nAvailable routes:');
    console.log(' - Auth: /api/auth');
    console.log(' - Transactions: /api/transactions');
    console.log(' - Categories: /api/categories');
    console.log(' - Goals: /api/goals');
  }
});
