const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const initDb = require('./src/config/initDb');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database automatically
initDb();

// Routes
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
