const express = require('express');
const authMiddleware = require('../middleware/auth');
const aiService = require('../services/AiService');

const router = express.Router();

// Get tutoring help
router.post('/ask', authMiddleware, async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await aiService.getTutoringResponse(question, context || '');

    res.json({
      answer: response,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting tutoring response:', error);
    res.status(500).json({ error: 'Failed to get tutoring response' });
  }
});

module.exports = router;