const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One session per user
  },
  characterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Session', sessionSchema);
