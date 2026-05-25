const pool = require('../config/db');

const formatTransaction = (row) => ({
  id: String(row.id),
  amount: Number(row.amount),
  category: row.category,
  date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date,
  description: row.description || '',
  type: row.type,
});

const getTransactions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC',
      [req.user.id]
    );
    res.json(rows.map(formatTransaction));
  } catch (err) {
    console.error('getTransactions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransaction = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(formatTransaction(rows[0]));
  } catch (err) {
    console.error('getTransaction error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { amount, category, date, description, type } = req.body;

    if (amount == null || !category || !date || !type) {
      return res
        .status(400)
        .json({ message: 'amount, category, date, and type are required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'type must be income or expense' });
    }

    const [result] = await pool.query(
      `INSERT INTO transactions (user_id, amount, category, date, description, type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, amount, category, date, description || '', type]
    );

    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [
      result.insertId,
    ]);

    res.status(201).json(formatTransaction(rows[0]));
  } catch (err) {
    console.error('createTransaction error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { amount, category, date, description, type } = req.body;

    const [existing] = await pool.query(
      'SELECT id FROM transactions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await pool.query(
      `UPDATE transactions
       SET amount = ?, category = ?, date = ?, description = ?, type = ?
       WHERE id = ? AND user_id = ?`,
      [
        amount,
        category,
        date,
        description || '',
        type,
        req.params.id,
        req.user.id,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [
      req.params.id,
    ]);

    res.json(formatTransaction(rows[0]));
  } catch (err) {
    console.error('updateTransaction error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error('deleteTransaction error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
