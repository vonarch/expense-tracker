const pool = require('../config/db');

const formatGoal = (row) => ({
  id: String(row.id),
  title: row.title,
  targetAmount: Number(row.target_amount),
  currentAmount: Number(row.current_amount),
  deadline: row.deadline
    ? row.deadline instanceof Date
      ? row.deadline.toISOString().slice(0, 10)
      : row.deadline
    : undefined,
});

const formatTransaction = (row) => ({
  id: String(row.id),
  amount: Number(row.amount),
  category: row.category,
  date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date,
  description: row.description || '',
  type: row.type,
});

const todayString = () => new Date().toISOString().slice(0, 10);

const getGoals = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows.map(formatGoal));
  } catch (err) {
    console.error('getGoals error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;

    if (!title?.trim() || targetAmount == null) {
      return res.status(400).json({ message: 'title and targetAmount are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO goals (user_id, title, target_amount, deadline) VALUES (?, ?, ?, ?)',
      [req.user.id, title.trim(), targetAmount, deadline || null]
    );

    const [rows] = await pool.query('SELECT * FROM goals WHERE id = ?', [result.insertId]);
    res.status(201).json(formatGoal(rows[0]));
  } catch (err) {
    console.error('createGoal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGoalProgress = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'amount must be a positive number' });
    }

    const [existing] = await connection.query(
      'SELECT * FROM goals WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const goal = existing[0];
    const previousAmount = Number(goal.current_amount);
    const newAmount = Math.min(
      previousAmount + Number(amount),
      Number(goal.target_amount)
    );
    const contributed = newAmount - previousAmount;

    if (contributed <= 0) {
      return res.status(400).json({ message: 'Goal is already at target' });
    }

    await connection.beginTransaction();

    try {
      await connection.query('UPDATE goals SET current_amount = ? WHERE id = ?', [
        newAmount,
        req.params.id,
      ]);

      const [txResult] = await connection.query(
        `INSERT INTO transactions (user_id, amount, category, date, description, type)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          contributed,
          'Savings',
          todayString(),
          `Goal: ${goal.title}`,
          'expense',
        ]
      );

      await connection.commit();

      const [goalRows] = await connection.query('SELECT * FROM goals WHERE id = ?', [
        req.params.id,
      ]);
      const [txRows] = await connection.query('SELECT * FROM transactions WHERE id = ?', [
        txResult.insertId,
      ]);

      res.json({
        goal: formatGoal(goalRows[0]),
        transaction: formatTransaction(txRows[0]),
      });
    } catch (txErr) {
      await connection.rollback();
      throw txErr;
    }
  } catch (err) {
    console.error('updateGoalProgress error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

const deleteGoal = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM goals WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted' });
  } catch (err) {
    console.error('deleteGoal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getGoals, createGoal, updateGoalProgress, deleteGoal };
