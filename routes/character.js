const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');  // Use correct middleware

// Create a character
router.post('/create', authMiddleware, async (req, res) => {
  const { name, class: characterClass } = req.body;
  const userId = req.user._id;  // Get the userId from JWT payload (Note: use _id from user object)

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
    const characters = await Character.find({ userId: req.user._id });  // Query by userId (use _id from user object)
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
    const character = await Character.findOne({ _id: characterId, userId: req.user._id });

    if (!character) {
      return res.status(404).json({ error: 'Character not found or does not belong to this user.' });
    }

    const session = await Session.findOneAndUpdate(
      { userId: req.user._id },
      { characterId, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Character selected successfully!', session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
