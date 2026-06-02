const express = require('express');
const router = express.Router();
const { getAllQuestions } = require('../controllers/questionController');

router.get('/', getAllQuestions);

module.exports = router;