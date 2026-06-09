const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'Food',
      'Transport',
      'Mobile Recharge',
      'Shopping',
      'Entertainment',
      'Medical',
      'Education',
      'Grocery',
      'Room Rent',
      'Others'
    ),
    allowNull: false
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'expenses',
  timestamps: true
});

module.exports = Expense;