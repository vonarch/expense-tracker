const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  try {
    // Check if user exists
    const [existing] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already in use' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    // Find user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
