const db = require('../config/db');

exports.getTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC', 
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

exports.addTransaction = async (req, res) => {
  const { description, amount, category, type } = req.body;
  if (!description || !amount || !category || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO transactions (user_id, description, amount, category, type, date) VALUES (?, ?, ?, ?, ?, CURDATE())',
      [req.user.id, description, amount, category, type]
    );
    
    // Return the newly created transaction
    const [newTransaction] = await db.query('SELECT * FROM transactions WHERE id = ?', [result.insertId]);
    res.status(201).json(newTransaction[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
