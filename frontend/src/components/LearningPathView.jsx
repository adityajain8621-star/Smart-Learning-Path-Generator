import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LearningPathView.css';

function LearningPathView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [learningPath, setLearningPath] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    fetchLearningPath();
  }, [id]);

  const fetchLearningPath = async () => {
    try {
      const response = await fetch(`/api/learning-paths/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLearningPath(data.learningPath);
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Error fetching learning path:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const markModuleComplete = async (moduleId) => {
    try {
      const response = await fetch(`/api/learning-paths/${id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          moduleId,
          completed: true
        })
      });

      if (response.ok) {
        fetchLearningPath();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const isModuleCompleted = (moduleId) => {
    return progress.some(p => p.module_id === moduleId && p.completed);
  };

  const calculateProgress = () => {
    if (!learningPath?.content?.modules) return 0;
    const completedCount = progress.filter(p => p.completed).length;
    const totalModules = learningPath.content.modules.length;
    return Math.round((completedCount / totalModules) * 100);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="error">Learning path not found</div>
    );
  }

  const pathContent = learningPath.content;
  const modules = pathContent.modules || [];
  const progressPercent = calculateProgress();

  return (
    <div className="path-view-container">
      <div className="bg-decoration bg-circle-1"></div>
      <div className="bg-decoration bg-circle-2"></div>
      
      <div className="path-view-content">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>

        <div className="path-header">
          <div className="path-header-content">
            <h1 className="path-view-title">{learningPath.title}</h1>
            <p className="path-view-description">{learningPath.description}</p>
            
            <div className="path-stats">
              <div className="stat-item">
                <span className="stat-icon">📊</span>
                <span className="stat-label">Difficulty:</span>
                <span className="stat-value">{learningPath.difficulty}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⏱️</span>
                <span className="stat-label">Duration:</span>
                <span className="stat-value">{learningPath.estimated_duration} hours</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📚</span>
                <span className="stat-label">Modules:</span>
                <span className="stat-value">{modules.length}</span>
              </div>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <span className="progress-label">Your Progress</span>
              <span className="progress-percent">{progressPercent}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="modules-container">
          <h2 className="modules-title">Learning Modules</h2>
          
          <div className="modules-list">
            {modules.map((module, index) => {
              const isCompleted = isModuleCompleted(module.id);
              const isExpanded = expandedModule === module.id;

              return (
                <div key={module.id} className={`module-card ${isCompleted ? 'completed' : ''}`}>
                  <div className="module-header" onClick={() => toggleModule(module.id)}>
                    <div className="module-number">{index + 1}</div>
                    <div className="module-info">
                      <h3 className="module-title">{module.title}</h3>
                      <p className="module-description">{module.description}</p>
                    </div>
                    <div className="module-actions">
                      {isCompleted && <span className="completed-badge">✓ Completed</span>}
                      <button className="expand-btn">
                        {isExpanded ? '−' : '+'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="module-content">
                      <div className="module-section">
                        <h4 className="section-heading">📋 Topics Covered</h4>
                        <ul className="topics-list">
                          {module.topics?.map((topic, i) => (
                            <li key={i}>{topic}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="module-section">
                        <h4 className="section-heading">🎯 Learning Objectives</h4>
                        <ul className="objectives-list">
                          {module.objectives?.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="module-section">
                        <h4 className="section-heading">📚 Resources</h4>
                        <ul className="resources-list">
                          {module.resources?.map((resource, i) => (
                            <li key={i}>{resource}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="module-footer">
                        <div className="module-duration">
                          ⏱️ Estimated: {module.duration} hours
                        </div>
                        {!isCompleted && (
                          <button
                            onClick={() => markModuleComplete(module.id)}
                            className="btn btn-primary"
                          >
                            Mark as Complete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningPathView;