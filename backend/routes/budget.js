const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const authMiddleware = require('../middleware/auth');

// Get current month budget
router.get('/', authMiddleware, async (req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7);
    let budget = await Budget.findOne({ where: { month, userId: req.user.id } });
    if (!budget) {
      budget = await Budget.create({ amount: 0, month, userId: req.user.id });
    }
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set or update budget
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const month = new Date().toISOString().slice(0, 7);
    let budget = await Budget.findOne({ where: { month, userId: req.user.id } });
    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({ amount, month, userId: req.user.id });
    }
    res.json({ message: 'Budget updated!', budget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;