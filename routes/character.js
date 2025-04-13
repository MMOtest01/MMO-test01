const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Character = require('../models/Character');
const User = require('../models/User');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');

// ✅ Create a character
router.post('/create', authMiddleware, async (req, res) => {
  console.log('📩 /create hit');
  console.log('Authenticated User ID:', req.user?._id);

  const { name, class: characterClass, hairStyle, hairColor } = req.body;
  const userId = req.user._id;

  try {
    const character = new Character({
      name,
      class: characterClass,
      userId,
      hairStyle: hairStyle || 'default',
      hairColor: hairColor || 'brown',
      level: 1,
      hp: 100,
      exp: 0,
      createdAt: new Date()
    });

    await character.save();

    res.status(201).json({
      message: 'Character created successfully!',
      characterId: character._id
    });
  } catch (err) {
    console.error('Character creation error:', err.message);
    res.status(400).json({ error: 'Character validation failed: ' + err.message });
  }
});

// ✅ View all characters for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const characters = await Character.find({ userId: req.user._id });

    res.status(200).json(characters); // Always return array, even if empty
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Select a character to enter the game
router.post('/select', authMiddleware, async (req, res) => {
  const { characterId } = req.body;

  console.log('📥 /select hit');
  console.log('Authenticated User ID:', req.user?._id);
  console.log('➡️ Character ID received:', characterId);

  try {
    const character = await Character.findOne({ _id: characterId, userId: req.user._id });

    if (!character) {
      console.warn('❌ Character not found or does not belong to user');
      return res.status(404).json({ error: 'Character not found or does not belong to this user.' });
    }

    const session = await Session.findOneAndUpdate(
      { userId: req.user._id },
      { characterId, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    console.log('✅ Character selected and session created:', session);

    res.status(200).json({
      message: 'Character selected successfully!',
      session,
      character,
    });
  } catch (err) {
    console.error('❌ Error in /select route:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
