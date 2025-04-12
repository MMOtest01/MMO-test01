// routes/auth.js
const express = require('express');
const User = require('../models/User'); // <-- Make sure this path is correct
const router = express.Router();

// Example register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
