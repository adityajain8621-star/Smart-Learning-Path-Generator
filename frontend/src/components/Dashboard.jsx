import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard({ user, onLogout }) {
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const response = await fetch('/api/learning-paths', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLearningPaths(data.learningPaths);
      }
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyClass = (difficulty) => {
    const level = difficulty?.toLowerCase();
    if (level === 'beginner') return 'difficulty-beginner';
    if (level === 'intermediate') return 'difficulty-intermediate';
    if (level === 'advanced') return 'difficulty-advanced';
    return 'difficulty-intermediate';
  };

  return (
    <div className="app-container">
      <div className="bg-decoration bg-circle-1"></div>
      <div className="bg-decoration bg-circle-2"></div>
      
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Your Learning Paths</h1>
          <div className="header-actions">
            {user && <div className="user-info">👤 {user.name || user.email}</div>}
            <Link to="/generate" className="btn btn-primary">
              ✨ Generate New Path
            </Link>
            <button onClick={onLogout} className="btn btn-logout">
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : learningPaths.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h2 className="empty-title">No Learning Paths Yet</h2>
            <p className="empty-text">
              Start your learning journey by generating a personalized learning path
            </p>
            <Link to="/generate" className="btn btn-primary btn-large">
              Generate Your First Path
            </Link>
          </div>
        ) : (
          <div className="paths-grid">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="path-card"
                onClick={() => navigate(`/path/${path.id}`)}
              >
                <div className={`path-difficulty ${getDifficultyClass(path.difficulty)}`}>
                  {path.difficulty || 'Intermediate'}
                </div>
                <h3 className="path-title">{path.title}</h3>
                <p className="path-description">
                  {path.description?.substring(0, 120)}
                  {path.description?.length > 120 ? '...' : ''}
                </p>
                <div className="path-meta">
                  <div className="meta-item">
                    <span>⏱️</span>
                    <span>{path.estimated_duration || 0} hours</span>
                  </div>
                  <div className="meta-item">
                    <span>📅</span>
                    <span>{new Date(path.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;