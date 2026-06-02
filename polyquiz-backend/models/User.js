const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+$/,
    lowercase: true
  },
  bestScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);