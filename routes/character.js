const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Character creation route
router.post('/create', authenticateToken, async (req, res) => {
  const { name, class: charClass } = req.body;

  try {
    const newChar = new Character({
      name,
      class: charClass,
      owner: req.user.id,
      // Optionally: set stats based on class here
    });

    await newChar.save();
    res.status(201).json({ message: 'Character created!', character: newChar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
