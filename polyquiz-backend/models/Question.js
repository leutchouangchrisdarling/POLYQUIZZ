const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  text: { type: String, required: true },
  options: {
    type: [String],
    validate: v => v.length >= 2 && v.length <= 4
  },
  correctAnswer: { type: String, required: true }
});

module.exports = mongoose.model('Question', questionSchema);