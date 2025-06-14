import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Zap, Target, Sparkles, MessageCircle, TrendingUp } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';

/**
 * Home Page Component
 * Main dashboard showing overview of user's wellness status,
 * pet, daily goals, and quick actions
 */
const Home: React.FC = () => {
  const { pet, dailyGoals, streak, motivationalMessage, wellnessData } = useWellness();
  
  const completedGoals = dailyGoals.filter(goal => goal.completed).length;
  const completionPercentage = (completedGoals / dailyGoals.length) * 100;

  /**
   * Get pet emoji based on happiness level
   */
  const getPetEmoji = () => {
    if (pet.happiness > 80) return '🐱✨';
    if (pet.happiness > 60) return '🐱😊';
    if (pet.happiness > 40) return '🐱😐';
    return '🐱😴';
  };

  /**
   * Get mood color based on wellness data
   */
  const getMoodColor = () => {
    if (wellnessData.mood >= 8) return 'var(--color-success)';
    if (wellnessData.mood >= 6) return 'var(--color-warning)';
    if (wellnessData.mood >= 4) return 'var(--color-error)';
    return 'var(--color-gray-500)';
  };

  return (
    <div className="home-container">
      {/* Header with Motivational Message */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="greeting">¡Hola! 👋</h1>
          <p className="motivational-text">{motivationalMessage}</p>
          <div className="streak-container">
            <Sparkles size={16} color="var(--color-accent)" />
            <span className="streak-text">Racha de {streak} días</span>
          </div>
        </div>
      </div>

      <div className="content-container">
        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/chatbot" className="action-button">
            <MessageCircle size={24} color="var(--color-primary)" />
            <span>Chat IA</span>
          </Link>
          
          <Link to="/dashboard" className="action-button">
            <TrendingUp size={24} color="var(--color-success)" />
            <span>Mi Estado</span>
          </Link>
        </div>

        {/* Pet Section */}
        <div className="pet-card card">
          <div className="pet-header">
            <h3>Tu mascota: {pet.name}</h3>
            <span className="pet-level">Nivel {Math.floor(pet.level)}</span>
          </div>
          
          <div className="pet-display">
            <div className="pet-emoji">{getPetEmoji()}</div>
            <div className="pet-stats">
              <div className="pet-stat">
                <Heart size={16} color="var(--color-error)" />
                <span>Felicidad: {Math.round(pet.happiness)}%</span>
              </div>
              <div className="pet-stat">
                <Zap size={16} color="var(--color-success)" />
                <span>Salud: {Math.round(pet.health)}%</span>
              </div>
            </div>
          </div>

          <div className="pet-progress-bar">
            <div 
              className="pet-progress" 
              style={{ 
                width: `${pet.happiness}%`,
                backgroundColor: 'var(--color-success)'
              }}
            />
          </div>
        </div>

        {/* Daily Goals */}
        <div className="goals-card card">
          <div className="goals-header">
            <Target size={20} color="var(--color-primary)" />
            <h3>Objetivos del día</h3>
            <span className="goals-progress">{completedGoals}/{dailyGoals.length}</span>
          </div>

          <div className="goals-list">
            {dailyGoals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="goal-item">
                <div className={`goal-checkbox ${goal.completed ? 'completed' : ''}`}>
                  {goal.completed && <span className="checkmark">✓</span>}
                </div>
                <span className={`goal-text ${goal.completed ? 'completed' : ''}`}>
                  {goal.title}
                </span>
              </div>
            ))}
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="progress-text">{Math.round(completionPercentage)}% completado</span>
          </div>
        </div>

        {/* Mood Check */}
        <div className="mood-card card">
          <h3>¿Cómo te sientes hoy?</h3>
          <div className="mood-display">
            <div 
              className="mood-indicator" 
              style={{ backgroundColor: getMoodColor() }}
            />
            <span className="mood-text">
              {wellnessData.mood >= 8 ? 'Excelente' : 
               wellnessData.mood >= 6 ? 'Bien' :
               wellnessData.mood >= 4 ? 'Regular' : 'Necesitas apoyo'}
            </span>
          </div>
          <Link to="/chatbot" className="btn btn-primary">
            Hablar con IA
          </Link>
        </div>
      </div>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background: var(--bg-secondary);
        }

        .hero-section {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          padding: var(--spacing-16) var(--spacing-6) var(--spacing-8);
          color: var(--text-inverse);
          text-align: center;
        }

        .hero-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .greeting {
          font-size: var(--font-size-4xl);
          font-weight: 700;
          margin-bottom: var(--spacing-2);
        }

        .motivational-text {
          font-size: var(--font-size-lg);
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: var(--spacing-3);
        }

        .streak-container {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.2);
          padding: var(--spacing-2) var(--spacing-3);
          border-radius: var(--radius-full);
          gap: var(--spacing-1);
        }

        .streak-text {
          color: var(--color-accent);
          font-weight: 600;
          font-size: var(--font-size-sm);
        }

        .content-container {
          padding: var(--spacing-6);
          margin-top: -var(--spacing-6);
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-6);
        }

        .action-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-6);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          text-decoration: none;
          color: var(--text-primary);
          box-shadow: var(--shadow-md);
          transition: transform var(--transition-fast);
        }

        .action-button:hover {
          transform: translateY(-2px);
        }

        .action-button span {
          margin-top: var(--spacing-2);
          font-weight: 600;
        }

        .pet-card {
          margin-bottom: var(--spacing-6);
        }

        .pet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-4);
        }

        .pet-header h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
        }

        .pet-level {
          background: var(--bg-tertiary);
          padding: var(--spacing-1) var(--spacing-2);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text-secondary);
        }

        .pet-display {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-4);
        }

        .pet-emoji {
          font-size: 3rem;
          margin-right: var(--spacing-5);
        }

        .pet-stats {
          flex: 1;
        }

        .pet-stat {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-2);
          gap: var(--spacing-2);
        }

        .pet-stat span {
          font-weight: 500;
          color: var(--text-primary);
        }

        .pet-progress-bar {
          height: 8px;
          background: var(--color-gray-200);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .pet-progress {
          height: 100%;
          border-radius: var(--radius-sm);
          transition: width var(--transition-normal);
        }

        .goals-card {
          margin-bottom: var(--spacing-6);
        }

        .goals-header {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-4);
          gap: var(--spacing-2);
        }

        .goals-header h3 {
          flex: 1;
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
        }

        .goals-progress {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text-secondary);
        }

        .goals-list {
          margin-bottom: var(--spacing-4);
        }

        .goal-item {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-3);
        }

        .goal-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-medium);
          border-radius: 50%;
          margin-right: var(--spacing-3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .goal-checkbox.completed {
          background: var(--color-success);
          border-color: var(--color-success);
        }

        .checkmark {
          color: var(--text-inverse);
          font-size: var(--font-size-xs);
          font-weight: 700;
        }

        .goal-text {
          flex: 1;
          color: var(--text-primary);
        }

        .goal-text.completed {
          text-decoration: line-through;
          color: var(--text-secondary);
        }

        .progress-bar-container {
          text-align: center;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--color-gray-200);
          border-radius: var(--radius-sm);
          overflow: hidden;
          margin-bottom: var(--spacing-2);
        }

        .progress-fill {
          height: 100%;
          background: var(--color-primary);
          border-radius: var(--radius-sm);
          transition: width var(--transition-normal);
        }

        .progress-text {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text-secondary);
        }

        .mood-card {
          text-align: center;
        }

        .mood-card h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-4);
        }

        .mood-display {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--spacing-4);
          gap: var(--spacing-2);
        }

        .mood-indicator {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        .mood-text {
          font-size: var(--font-size-base);
          font-weight: 500;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: var(--spacing-12) var(--spacing-4) var(--spacing-6);
          }

          .greeting {
            font-size: var(--font-size-3xl);
          }

          .content-container {
            padding: var(--spacing-4);
          }

          .pet-display {
            flex-direction: column;
            text-align: center;
          }

          .pet-emoji {
            margin-right: 0;
            margin-bottom: var(--spacing-3);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;