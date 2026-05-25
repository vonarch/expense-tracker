const pool = require('../config/db');

const DEFAULT_CATEGORIES = [
  { name: 'Food', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Shopping', type: 'expense' },
  { name: 'Bills', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Health', type: 'expense' },
  { name: 'Other', type: 'expense' },
  { name: 'Salary', type: 'income' },
  { name: 'Freelance', type: 'income' },
  { name: 'Investment', type: 'income' },
  { name: 'Other', type: 'income' },
];

async function seedDefaultCategories(userId) {
  for (const cat of DEFAULT_CATEGORIES) {
    try {
      await pool.query(
        'INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)',
        [userId, cat.name, cat.type]
      );
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') throw err;
    }
  }
}

module.exports = { seedDefaultCategories, DEFAULT_CATEGORIES };
