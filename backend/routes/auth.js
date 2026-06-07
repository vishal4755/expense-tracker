const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered!' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, mobile, email, password: hashedPassword });
    res.status(201).json({ message: 'Registration successful!', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password!' });
    }
    const token = jwt.sign({ id: user.id }, 'expense_secret_key', { expiresIn: '7d' });
    res.json({ message: 'Login successful!', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Email not registered!' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Expense Tracker - Password Reset OTP',
      html: `<h2>Password Reset OTP</h2><p>Your OTP is: <strong style="font-size:24px;">${otp}</strong></p><p>Valid for 10 minutes.</p>`
    });
    res.json({ message: 'OTP sent to your email!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found!' });
    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP!' });
    if (new Date() > user.otpExpiry) return res.status(400).json({ error: 'OTP expired!' });
    res.json({ message: 'OTP verified successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found!' });
    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP!' });
    if (new Date() > user.otpExpiry) return res.status(400).json({ error: 'OTP expired!' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.json({ message: 'Password reset successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, 'expense_secret_key');
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found!' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect!' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password changed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;