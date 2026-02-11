const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const aiService = require('../services/AiService');

const router = express.Router();

// Generate new learning path
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { goal, skillLevel, learningStyle } = req.body;

    if (!goal || !skillLevel) {
      return res.status(400).json({ error: 'Goal and skill level are required' });
    }

    // Generate learning path using AI
    const pathContent = await aiService.generateLearningPath(
      goal,
      skillLevel,
      learningStyle || 'visual'
    );

    // Save to database
    const result = await db.query(
      `INSERT INTO learning_paths (user_id, title, description, difficulty, estimated_duration, content)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.userId,
        pathContent.title,
        pathContent.description,
        pathContent.difficulty,
        pathContent.estimatedDuration,
        JSON.stringify(pathContent)
      ]
    );

    res.status(201).json({
      message: 'Learning path generated successfully',
      learningPath: result.rows[0]
    });
  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({ error: 'Failed to generate learning path' });
  }
});

// Get all learning paths for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM learning_paths WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({ learningPaths: result.rows });
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
});

// Get specific learning path
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM learning_paths WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Get progress for this learning path
    const progressResult = await db.query(
      'SELECT * FROM user_progress WHERE learning_path_id = $1 AND user_id = $2',
      [id, req.userId]
    );

    res.json({
      learningPath: result.rows[0],
      progress: progressResult.rows
    });
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ error: 'Failed to fetch learning path' });
  }
});

// Update progress for a module
router.post('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { moduleId, completed, score, timeSpent } = req.body;

    const result = await db.query(
      `INSERT INTO user_progress (user_id, learning_path_id, module_id, completed, score, time_spent, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, learning_path_id, module_id)
       DO UPDATE SET completed = $4, score = $5, time_spent = $6, completed_at = $7
       RETURNING *`,
      [
        req.userId,
        id,
        moduleId,
        completed,
        score || null,
        timeSpent || 0,
        completed ? new Date() : null
      ]
    );

    res.json({
      message: 'Progress updated successfully',
      progress: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Delete learning path
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM learning_paths WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    res.json({ message: 'Learning path deleted successfully' });
  } catch (error) {
    console.error('Error deleting learning path:', error);
    res.status(500).json({ error: 'Failed to delete learning path' });
  }
});

module.exports = router;