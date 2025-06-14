import React, { useState } from 'react';
import { Heart, Zap, Shield, Moon, Droplets, Brain, TrendingUp, Calendar, Music } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';

interface WellnessMetric {
  key: keyof WellnessData;
  label: string;
  icon: React.ReactNode;
  color: string;
  unit?: string;
}

/**
 * Dashboard Page Component
 * Comprehensive wellness tracking and visualization
 */
const Dashboard: React.FC = () => {
  const { wellnessData, updateWellnessData } = useWellness();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metrics: WellnessMetric[] = [
    {
      key: 'mood',
      label: 'Estado de ánimo',
      icon: <Heart size={24} color="var(--color-error)" />,
      color: 'var(--color-error)',
    },
    {
      key: 'energy',
      label: 'Energía',
      icon: <Zap size={24} color="var(--color-warning)" />,
      color: 'var(--color-warning)',
    },
    {
      key: 'stress',
      label: 'Estrés',
      icon: <Shield size={24} color="#8B5CF6" />,
      color: '#8B5CF6',
    },
    {
      key: 'sleep',
      label: 'Calidad del sueño',
      icon: <Moon size={24} color="#1E40AF" />,
      color: '#1E40AF',
      unit: 'hrs',
    },
    {
      key: 'water',
      label: 'Hidratación',
      icon: <Droplets size={24} color="#0EA5E9" />,
      color: '#0EA5E9',
      unit: 'vasos',
    },
    {
      key: 'anxiety',
      label: 'Ansiedad',
      icon: <Brain size={24} color="#DC2626" />,
      color: '#DC2626',
    },
  ];

  /**
   * Determines the level and color based on metric value
   */
  const getMetricLevel = (value: number, max: number = 10) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return { level: 'Excelente', color: 'var(--color-success)' };
    if (percentage >= 60) return { level: 'Bueno', color: 'var(--color-warning)' };
    if (percentage >= 40) return { level: 'Regular', color: 'var(--color-error)' };
    return { level: 'Necesita atención', color: '#DC2626' };
  };

  /**
   * Calculates overall wellness score
   */
  const getOverallWellness = () => {
    const positiveMetrics = (wellnessData.mood + wellnessData.energy + wellnessData.sleep) / 3;
    const negativeMetrics = (wellnessData.stress + wellnessData.anxiety) / 2;
    const overall = (positiveMetrics + (10 - negativeMetrics)) / 2;
    return Math.round(overall * 10) / 10;
  };

  /**
   * Generates personalized recommendations based on wellness data
   */
  const getRecommendation = () => {
    const { mood, energy, stress, anxiety, sleep, water } = wellnessData;
    
    if (mood <= 4 || anxiety >= 7) {
      return {
        title: "💙 Apoyo emocional",
        message: "Parece que hoy te sientes un poco bajo. ¿Te gustaría escuchar música relajante o ver algunos recuerdos bonitos?",
        action: "Ver recomendaciones"
      };
    }
    
    if (energy <= 4 && sleep <= 5) {
      return {
        title: "😴 Descanso necesario",
        message: "Tu energía y sueño están bajos. Es momento de priorizar el descanso.",
        action: "Tips de sueño"
      };
    }
    
    if (stress >= 7) {
      return {
        title: "🧘 Manejo del estrés",
        message: "Detectamos niveles altos de estrés. Te sugerimos técnicas de relajación.",
        action: "Ejercicios de respiración"
      };
    }
    
    if (water <= 3) {
      return {
        title: "💧 Hidratación",
        message: "No olvides mantener tu cuerpo hidratado. ¡Tu cerebro lo agradecerá!",
        action: "Recordatorio de agua"
      };
    }
    
    return {
      title: "🌟 ¡Vas muy bien!",
      message: "Tu bienestar general está en buen estado. ¡Sigue así!",
      action: "Nuevos objetivos"
    };
  };

  /**
   * Updates a specific wellness metric
   */
  const updateMetric = (key: keyof WellnessData, value: number) => {
    updateWellnessData({ [key]: value });
  };

  const overallScore = getOverallWellness();
  const recommendation = getRecommendation();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Mi Bienestar</h1>
        <p>Seguimiento diario de tu estado</p>
        
        <div className="overall-score-container">
          <span className="overall-score-label">Puntuación general</span>
          <div className="overall-score">{overallScore}/10</div>
          <div className="score-bar">
            <div 
              className="score-progress" 
              style={{ width: `${(overallScore / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recommendation Card */}
        <div className="recommendation-card card">
          <div className="recommendation-header">
            <TrendingUp size={20} color="var(--color-primary)" />
            <h3>{recommendation.title}</h3>
          </div>
          <p>{recommendation.message}</p>
          <button className="btn btn-primary">
            {recommendation.action}
          </button>
        </div>

        {/* Metrics Grid */}
        <h2 className="section-title">Estado actual</h2>
        <div className="metrics-grid">
          {metrics.map((metric) => {
            const value = wellnessData[metric.key];
            const maxValue = metric.key === 'water' ? 8 : 10;
            const level = getMetricLevel(value, maxValue);
            
            return (
              <div
                key={metric.key}
                className={`metric-card card ${selectedMetric === metric.key ? 'selected' : ''}`}
                onClick={() => setSelectedMetric(selectedMetric === metric.key ? null : metric.key)}
              >
                <div className="metric-header">
                  {metric.icon}
                  <span className="metric-label">{metric.label}</span>
                </div>
                
                <div className="metric-value">
                  <span className="metric-number">
                    {value}{metric.unit && ` ${metric.unit}`}
                  </span>
                  <span className="metric-level" style={{ color: level.color }}>
                    {level.level}
                  </span>
                </div>
                
                <div className="metric-bar">
                  <div 
                    className="metric-progress"
                    style={{ 
                      width: `${(value / maxValue) * 100}%`,
                      backgroundColor: metric.color
                    }}
                  />
                </div>

                {selectedMetric === metric.key && (
                  <div className="metric-slider">
                    <div className="slider-container">
                      {Array.from({ length: maxValue }, (_, i) => (
                        <button
                          key={i}
                          className={`slider-dot ${(i + 1) <= value ? 'active' : ''}`}
                          style={{
                            backgroundColor: (i + 1) <= value ? metric.color : 'var(--color-gray-300)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateMetric(metric.key, i + 1);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Weekly Trends */}
        <div className="trends-card card">
          <div className="trends-header">
            <Calendar size={20} color="var(--color-gray-500)" />
            <h3>Tendencias de la semana</h3>
          </div>
          
          <div className="trends-list">
            <div className="trend-item">
              <span className="trend-label">Estado de ánimo promedio</span>
              <span className="trend-value">7.2/10 📈</span>
            </div>
            <div className="trend-item">
              <span className="trend-label">Mejor día de la semana</span>
              <span className="trend-value">Sábado 🌟</span>
            </div>
            <div className="trend-item">
              <span className="trend-label">Área de mejora</span>
              <span className="trend-value">Hidratación 💧</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-card card">
          <h3>Acciones rápidas</h3>
          <div className="quick-actions">
            <button className="quick-action">
              <Music size={20} color="var(--color-primary)" />
              <span>Música relajante</span>
            </button>
            <button className="quick-action">
              <Brain size={20} color="#8B5CF6" />
              <span>Meditación 5 min</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: var(--bg-secondary);
        }

        .dashboard-header {
          background: linear-gradient(135deg, var(--color-success), var(--color-secondary-dark));
          padding: var(--spacing-16) var(--spacing-6) var(--spacing-8);
          color: var(--text-inverse);
          text-align: center;
        }

        .dashboard-header h1 {
          font-size: var(--font-size-4xl);
          font-weight: 700;
          margin-bottom: var(--spacing-1);
        }

        .dashboard-header p {
          font-size: var(--font-size-base);
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: var(--spacing-5);
        }

        .overall-score-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .overall-score-label {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: var(--spacing-2);
        }

        .overall-score {
          font-size: var(--font-size-4xl);
          font-weight: 700;
          margin-bottom: var(--spacing-3);
        }

        .score-bar {
          width: 200px;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .score-progress {
          height: 100%;
          background: var(--text-inverse);
          border-radius: var(--radius-sm);
          transition: width var(--transition-normal);
        }

        .dashboard-content {
          padding: var(--spacing-6);
          margin-top: -var(--spacing-5);
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }

        .recommendation-card {
          margin-bottom: var(--spacing-6);
        }

        .recommendation-header {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-3);
          gap: var(--spacing-2);
        }

        .recommendation-header h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .recommendation-card p {
          font-size: var(--font-size-base);
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-4);
        }

        .section-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-4);
        }

        .metrics-grid {
          display: grid;
          gap: var(--spacing-3);
          margin-bottom: var(--spacing-6);
        }

        .metric-card {
          cursor: pointer;
          transition: all var(--transition-fast);
          border: 2px solid transparent;
        }

        .metric-card:hover {
          transform: translateY(-2px);
        }

        .metric-card.selected {
          border-color: var(--color-primary);
        }

        .metric-header {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-3);
          gap: var(--spacing-2);
        }

        .metric-label {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
        }

        .metric-value {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-3);
        }

        .metric-number {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--text-primary);
        }

        .metric-level {
          font-size: var(--font-size-sm);
          font-weight: 500;
        }

        .metric-bar {
          height: 6px;
          background: var(--color-gray-200);
          border-radius: var(--radius-sm);
          overflow: hidden;
          margin-bottom: var(--spacing-2);
        }

        .metric-progress {
          height: 100%;
          border-radius: var(--radius-sm);
          transition: width var(--transition-normal);
        }

        .metric-slider {
          margin-top: var(--spacing-2);
          padding-top: var(--spacing-3);
          border-top: 1px solid var(--border-light);
        }

        .slider-container {
          display: flex;
          justify-content: space-between;
        }

        .slider-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--border-medium);
          background: var(--color-gray-300);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .slider-dot:hover {
          transform: scale(1.1);
        }

        .trends-card {
          margin-bottom: var(--spacing-5);
        }

        .trends-header {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-4);
          gap: var(--spacing-2);
        }

        .trends-header h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .trends-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .trend-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .trend-label {
          font-size: var(--font-size-base);
          color: var(--text-secondary);
        }

        .trend-value {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--text-primary);
        }

        .quick-actions-card h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-4);
        }

        .quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-3);
        }

        .quick-action {
          display: flex;
          align-items: center;
          background: var(--bg-tertiary);
          padding: var(--spacing-3) var(--spacing-4);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: background-color var(--transition-fast);
          gap: var(--spacing-2);
        }

        .quick-action:hover {
          background: var(--color-gray-300);
        }

        .quick-action span {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: var(--spacing-12) var(--spacing-4) var(--spacing-6);
          }

          .dashboard-header h1 {
            font-size: var(--font-size-3xl);
          }

          .dashboard-content {
            padding: var(--spacing-4);
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .trend-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-1);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;