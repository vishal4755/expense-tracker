const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const Expense = require('./models/Expense');
const User = require('./models/User');
const expenseRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budget');
const authRoutes = require('./routes/auth');
const Budget = require('./models/Budget');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: 'https://daily-expense-tracker-update.netlify.app'
}));
app.use(express.json());
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/auth', authRoutes);
sequelize.authenticate()
  .then(() => {
    console.log('MySQL Connected!');
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('Tables ready!'))
  .catch((err) => console.log('Error:', err));
app.get('/', (req, res) => {
  res.json({ 
    message: 'Expense Tracker Backend is running!',
    status: 'OK'
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});