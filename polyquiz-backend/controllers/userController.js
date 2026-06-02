const User = require('../models/User');

const updateScore = async (req, res) => {
  try {
    const { score } = req.body;
    const user = await User.findById(req.user._id);
    if (score > user.bestScore) {
      user.bestScore = score;
      await user.save();
    }
    res.json({ bestScore: user.bestScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const top = await User.find()
      .sort({ bestScore: -1 })
      .limit(10)
      .select('pseudo bestScore -_id');
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { updateScore, getLeaderboard };