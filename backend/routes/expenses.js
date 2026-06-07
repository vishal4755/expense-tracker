const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');

// Add new expense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, note, date } = req.body;
    const expense = await Expense.create({ 
      title, amount, category, note, date, userId: req.user.id
    });
    res.status(201).json({ message: 'Expense added successfully!', expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all expenses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.findAll({ 
      where: { userId: req.user.id },
      order: [['date', 'DESC']] 
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get expenses by category
router.get('/category/:cat', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.findAll({ 
      where: { category: req.params.cat, userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Expense.destroy({ 
      where: { id: req.params.id, userId: req.user.id } 
    });
    res.json({ message: 'Expense deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;