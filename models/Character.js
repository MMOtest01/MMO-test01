const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    enum: ['Warrior', 'Mage', 'Archer'] // or whatever classes you support
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hairStyle: {
    type: String,
    default: 'default'
  },
  hairColor: {
    type: String,
    default: 'brown'
  },
  level: {
    type: Number,
    default: 1
  },
  hp: {
    type: Number,
    default: 100
  },
  exp: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Character', characterSchema);
