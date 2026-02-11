const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const aiService = require('../services/AiService');

const router = express.Router();

// Generate quiz for a module
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { learningPathId, moduleId, moduleTopic, difficulty } = req.body;

    if (!learningPathId || !moduleId || !moduleTopic) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if quiz already exists
    const existing = await db.query(
      'SELECT * FROM quizzes WHERE learning_path_id = $1 AND module_id = $2',
      [learningPathId, moduleId]
    );

    if (existing.rows.length > 0) {
      return res.json({ quiz: existing.rows[0] });
    }

    // Generate quiz using AI
    const quizContent = await aiService.generateQuiz(moduleTopic, difficulty || 'intermediate');

    // Save to database
    const result = await db.query(
      'INSERT INTO quizzes (learning_path_id, module_id, questions) VALUES ($1, $2, $3) RETURNING *',
      [learningPathId, moduleId, JSON.stringify(quizContent)]
    );

    res.status(201).json({
      message: 'Quiz generated successfully',
      quiz: result.rows[0]
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// Get quiz by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('SELECT * FROM quizzes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ quiz: result.rows[0] });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Submit quiz attempt
router.post('/:id/attempt', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    // Get quiz
    const quizResult = await db.query('SELECT * FROM quizzes WHERE id = $1', [id]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = quizResult.rows[0];
    const questions = quiz.questions.questions;

    // Calculate score
    let correctCount = 0;
    const results = questions.map((q, index) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        correct: isCorrect,
        userAnswer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);

    // Save attempt
    const attemptResult = await db.query(
      'INSERT INTO quiz_attempts (user_id, quiz_id, answers, score) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, id, JSON.stringify(answers), score]
    );

    res.json({
      message: 'Quiz submitted successfully',
      score,
      results,
      attempt: attemptResult.rows[0]
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get user's quiz attempts
router.get('/:id/attempts', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM quiz_attempts WHERE quiz_id = $1 AND user_id = $2 ORDER BY created_at DESC',
      [id, req.userId]
    );

    res.json({ attempts: result.rows });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).json({ error: 'Failed to fetch quiz attempts' });
  }
});

module.exports = router;