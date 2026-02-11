import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LearningPathGenerator.css';

function LearningPathGenerator() {
  const [goal, setGoal] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [learningStyle, setLearningStyle] = useState('visual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/learning-paths/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ goal, skillLevel, learningStyle })
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/path/${data.learningPath.id}`);
      } else {
        setError(data.error || 'Failed to generate learning path');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generator-container">
      <div className="bg-decoration bg-circle-1"></div>
      <div className="bg-decoration bg-circle-2"></div>
      
      <div className="generator-content">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>

        <div className="generator-header">
          <h1 className="generator-title">Smart Learning Path Generator</h1>
          <p className="generator-subtitle">
            Define your learning goal and current skill level. We'll create a structured learning path for you.
          </p>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="generator-form">
          <div className="form-section">
            <h3 className="section-title">Learning Goal</h3>
            <div className="form-group">
              <label className="form-label">What do you want to learn?</label>
              <input
                type="text"
                className="form-input"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
                placeholder="e.g., Learn Python for data analysis, Become a full-stack developer"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Skill Level</h3>
            <div className="skill-options">
              <label className={`skill-option ${skillLevel === 'beginner' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="skillLevel"
                  value="beginner"
                  checked={skillLevel === 'beginner'}
                  onChange={(e) => setSkillLevel(e.target.value)}
                />
                <div className="option-content">
                  <div className="option-icon">🌱</div>
                  <div className="option-label">Beginner</div>
                  <div className="option-desc">Starting from scratch</div>
                </div>
              </label>

              <label className={`skill-option ${skillLevel === 'intermediate' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="skillLevel"
                  value="intermediate"
                  checked={skillLevel === 'intermediate'}
                  onChange={(e) => setSkillLevel(e.target.value)}
                />
                <div className="option-content">
                  <div className="option-icon">🚀</div>
                  <div className="option-label">Intermediate</div>
                  <div className="option-desc">Some experience</div>
                </div>
              </label>

              <label className={`skill-option ${skillLevel === 'advanced' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="skillLevel"
                  value="advanced"
                  checked={skillLevel === 'advanced'}
                  onChange={(e) => setSkillLevel(e.target.value)}
                />
                <div className="option-content">
                  <div className="option-icon">⭐</div>
                  <div className="option-label">Advanced</div>
                  <div className="option-desc">Deep expertise</div>
                </div>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Learning Style</h3>
            <div className="form-group">
              <select
                className="form-select"
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value)}
              >
                <option value="visual">Visual (diagrams, videos)</option>
                <option value="reading">Reading/Writing</option>
                <option value="kinesthetic">Hands-on practice</option>
                <option value="auditory">Audio/listening</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Generating Your Path...
              </>
            ) : (
              '✨ Generate Learning Path'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LearningPathGenerator;