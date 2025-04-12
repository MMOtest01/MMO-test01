const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = require('../middleware/auth'); // <-- Add this line



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

// Character creation route
router.post('/create', authMiddleware, async (req, res) => {
  const { name, class: characterClass } = req.body;

  try {
    const newCharacter = new Character({
      name,
      class: characterClass,
      userId: req.user.userId  // <--- comes from the middleware
    });

    await newCharacter.save();
    res.status(201).json({ message: 'Character created successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create a new character
router.post('/create', authMiddleware, async (req, res) => {
  const { name, class: charClass } = req.body;
  const userId = req.user.userId; // Extract from JWT

  try {
    const character = new Character({
      name,
      class: charClass,
      userId: userId 
    });

    await character.save();
    res.status(201).json({ message: 'Character created!', character });
  } catch (err) {
    res.status(400).json({ error: err.message });
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


module.exports = router;
