const pool = require('../config/db');

const formatCategory = (row) => ({
  id: row.id,
  name: row.name,
  type: row.type,
});

const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, type FROM categories WHERE user_id = ? ORDER BY name',
      [req.user.id]
    );
    res.json(rows.map(formatCategory));
  } catch (err) {
    console.error('getCategories error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name?.trim() || !type) {
      return res.status(400).json({ message: 'name and type are required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'type must be income or expense' });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)',
      [req.user.id, name.trim(), type]
    );

    res.status(201).json({ id: result.insertId, name: name.trim(), type });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Category already exists' });
    }
    console.error('createCategory error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM categories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('deleteCategory error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
