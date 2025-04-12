const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const { authenticateJWT } = require('../middleware/auth');  // Import the correct middleware

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
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const characters = await Character.find({ userId: req.user.userId });  // Query by userId
    if (characters.length === 0) {
      return res.status(404).json({ message: 'No characters found.' });
    }
    res.status(200).json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Select character to enter the game
router.post('/select', authenticateJWT, async (req, res) => {
  const { characterId } = req.body;

  try {
    const character = await Character.findOne({ _id: characterId, userId: req.user.userId });

    if (!character) {
      return res.status(404).json({ error: 'Character not found or does not belong to this user.' });
    }

    const session = await Session.findOneAndUpdate(
      { userId: req.user.userId },
      { characterId, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Character selected successfully!', session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
