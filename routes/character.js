const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { authenticateJWT } = require('../middleware/auth');
const Session = require('../models/Session');


// const express = require('express');
// const router = express.Router();
// const Character = require('../models/Character');
// const authMiddleware = require('../middleware/auth');

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

// Create a character
router.post('/create', authenticateJWT, async (req, res) => {
  const { name, class: characterClass } = req.body;
  const userId = req.user.userId;  // Get the userId from JWT payload

  try {
    const character = new Character({
      name,
      class: characterClass,
      userId, // Associate the character with the authenticated user
    });

    await character.save();
    res.status(201).json({ message: 'Character created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Character validation failed: ' + err.message });
  }
});

// View all characters for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const characters = await Character.find({ userId: req.user._id });  // Query by userId
    if (characters.length === 0) {
      return res.status(404).json({ message: 'No characters found.' });
    }
    res.status(200).json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Select character to enter the game
router.post('/select', authMiddleware, async (req, res) => {
  const { characterId } = req.body;

  try {
    // Find the character by ID and ensure it belongs to the authenticated user
    const character = await Character.findOne({ _id: characterId, userId: req.user._id });

    if (!character) {
      return res.status(404).json({ error: 'Character not found or does not belong to this user.' });
    }

    // Set the selected character in the session or a temporary user context
    // You can store this in a session, a JWT, or a temporary database to track the session

    // For demonstration, we just send back the character data
    res.json({
      message: 'Character selected successfully!',
      character,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/select', authMiddleware, async (req, res) => {
  const { characterId } = req.body;

  try {
    const character = await Character.findOne({ _id: characterId, userId: req.user.userId });
    if (!character) return res.status(404).json({ error: 'Character not found or not yours.' });

    const session = await Session.findOneAndUpdate(
      { userId: req.user.userId },
      { characterId, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Character selected.', session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
