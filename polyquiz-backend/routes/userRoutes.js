const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { updateScore, getLeaderboard } = require('../controllers/userController');

router.post('/users/score', authMiddleware, updateScore);
router.get('/leaderboard', getLeaderboard);

module.exports = router;