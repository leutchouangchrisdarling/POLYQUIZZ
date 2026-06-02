const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { pseudo } = req.body;
    let user = await User.findOne({ pseudo: pseudo.toLowerCase() });
    if (!user) {
      user = await User.create({ pseudo: pseudo.toLowerCase() });
    }
    const token = jwt.sign(
      { _id: user._id, pseudo: user.pseudo },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token, pseudo: user.pseudo, bestScore: user.bestScore });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { login };