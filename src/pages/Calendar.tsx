import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, AlertTriangle, BookOpen, Coffee, Users, Brain } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'academic' | 'wellness' | 'social' | 'warning';
  stress_level?: number;
  description?: string;
}

interface WeekDay {
  date: string;
  day: string;
  isToday: boolean;
  mentalLoad: number;
}

/**
 * Calendar Page Component
 * Intelligent calendar with mental load prediction and wellness recommendations
 */
const Calendar: React.FC = () => {
  const { wellnessData } = useWellness();
  const [selectedDate, setSelectedDate] = useState('2025-01-28');

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'academic' as CalendarEvent['type']
  });


  /**
   * Generate week days with mental load simulation
   */
  const generateWeekDays = (): WeekDay[] => {
    const today = new Date();
    const week = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const isToday = dateString === today.toISOString().split('T')[0];
      
      // Simulate mental load calculation
      const mentalLoad = Math.random() * 10;
      
      week.push({
        date: dateString,
        day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        isToday,
        mentalLoad
      });
    }
    
    return week;
  };

  const [weekDays] = useState(generateWeekDays());

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Examen de Cálculo',
      date: '2025-01-28',
      time: '10:00',
      type: 'academic',
      stress_level: 8,
      description: 'Examen final de cálculo diferencial'
    },
    {
      id: '2',
      title: 'Entrega de Proyecto',
      date: '2025-01-28',
      time: '15:00',
      type: 'academic',
      stress_level: 7,
      description: 'Proyecto final de programación'
    },
    {
      id: '3',
      title: 'Sesión de meditación',
      date: '2025-01-28',
      time: '18:00',
      type: 'wellness',
      description: 'Meditación grupal - Reducir estrés pre-examen'
    },
    {
      id: '4',
      title: '⚠️ Día de alta carga mental',
      date: '2025-01-29',
      time: 'Todo el día',
      type: 'warning',
      description: 'Se detecta alta carga académica. Programa descansos.'
    },
    {
      id: '5',
      title: 'Café con amigos',
      date: '2025-01-29',
      time: '16:00',
      type: 'social',
      description: 'Recomendado: Socializar después del examen'
    },
    {
      id: '6',
      title: 'Ejercicio en el parque',
      date: '2025-01-30',
      time: '07:00',
      type: 'wellness',
      description: 'Actividad física para liberar endorfinas'
    }
  ]);

  /**
   * Get events for a specific date
   */
  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  /**
   * Get appropriate icon for event type
   */
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <BookOpen size={16} color="var(--color-primary)" />;
      case 'wellness':
        return <Brain size={16} color="var(--color-success)" />;
      case 'social':
        return <Users size={16} color="var(--color-warning)" />;
      case 'warning':
        return <AlertTriangle size={16} color="var(--color-error)" />;
      default:
        return <CalendarIcon size={16} color="var(--color-gray-500)" />;
    }
  };

  /**
   * Get background color for event type
   */
  const getEventColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'var(--color-primary-light)';
      case 'wellness':
        return 'var(--color-secondary-light)';
      case 'social':
        return 'var(--color-accent-light)';
      case 'warning':
        return '#FEE2E2';
      default:
        return 'var(--bg-tertiary)';
    }
  };

  /**
   * Get color for mental load indicator
   */
  const getMentalLoadColor = (load: number) => {
    if (load >= 7) return 'var(--color-error)';
    if (load >= 5) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  /**
   * Generate wellness recommendation based on current state
   */
  const generateWellnessRecommendation = () => {
    const todayEvents = getEventsForDate(selectedDate);
    const academicEvents = todayEvents.filter(e => e.type === 'academic').length;
    const stressLevel = wellnessData.stress;
    
    if (academicEvents >= 2 && stressLevel >= 6) {
      return {
        title: '🧘 Recomendación de bienestar',
        message: 'Tienes un día académicamente intenso. Te sugerimos incluir momentos de respiración profunda entre actividades.',
        action: 'Programar descansos'
      };
    }
    
    if (wellnessData.mood <= 5) {
      return {
        title: '💚 Apoyo emocional',
        message: 'Tu estado de ánimo está bajo. ¿Qué te parece programar una actividad que disfrutes?',
        action: 'Agregar actividad placentera'
      };
    }
    
    return {
      title: '🌟 Optimización del día',
      message: 'Tu día se ve equilibrado. ¡Mantén ese balance entre productividad y bienestar!',
      action: 'Ver más sugerencias'
    };
  };

  const recommendation = generateWellnessRecommendation();

  //cambio
  const openAddModal = () => setShowModal(true);
  const closeAddModal = () => setShowModal(false);

  const handleAddEvent = () => {
    const newEventObj: CalendarEvent = {
      id: `${Date.now()}`,
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type,
    };

    const suggestion = getSmartSuggestion(newEventObj);
    alert(suggestion);

    setEvents((prevEvents) => [...prevEvents, newEventObj]); // ✅ ahora usamos setEvents

    setNewEvent({ title: '', time: '', type: 'academic' });
    closeAddModal();
  };


  const getSmartSuggestion = (event: CalendarEvent): string => {
    switch (event.type) {
      case 'academic':
        return `📘 Para "${event.title}", intenta estudiar 40 minutos y descansar 10.`;
      case 'wellness':
        return `🧘 Actividad recomendada para equilibrar tu día.`;
      case 'social':
        return `👥 Recuerda que socializar también mejora tu bienestar.`;
      default:
        return '';
    }
  };


  return (
    <div className="calendar-container">
    {showModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Agregar nuevo evento</h3>
          <input
            type="text"
            placeholder="Título"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <input
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
          <select
            value={newEvent.type}
            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent['type'] })}
          >
            <option value="academic">Académico</option>
            <option value="wellness">Bienestar</option>
            <option value="social">Social</option>
          </select>
          <button onClick={handleAddEvent}>Guardar</button>
          <button onClick={closeAddModal}>Cancelar</button>
        </div>
      </div>
    )}
      {/* Header */}
      <div className="calendar-header">
        <CalendarIcon size={24} color="var(--color-primary)" />
        <h1>Calendario Inteligente</h1>
        <button className="add-button" onClick={openAddModal}>
          <Plus size={20} color="var(--color-primary)" />
        </button>
      </div>

      <div className="calendar-content">
        {/* Week View */}
        <div className="week-container">
          <h2 className="section-title">Esta semana</h2>
          <div className="week-scroll">
            <div className="week-days">
              {weekDays.map((day) => (
                <button
                  key={day.date}
                  className={`day-card ${day.isToday ? 'today' : ''} ${selectedDate === day.date ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <span className="day-name">{day.day}</span>
                  <span className="day-date">{new Date(day.date).getDate()}</span>
                  
                  <div className="mental-load-container">
                    <div 
                      className="mental-load-dot"
                      style={{ backgroundColor: getMentalLoadColor(day.mentalLoad) }}
                    />
                    <span className="mental-load-text">
                      {day.mentalLoad >= 7 ? 'Alta' : day.mentalLoad >= 5 ? 'Media' : 'Baja'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="recommendation-card card">
          <h3>{recommendation.title}</h3>
          <p>{recommendation.message}</p>
          <button className="btn btn-primary">
            {recommendation.action}
          </button>
        </div>

        {/* Events for Selected Date */}
        <div className="events-container">
          <h2 className="section-title">
            Eventos del día ({new Date(selectedDate).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })})
          </h2>
          
          {getEventsForDate(selectedDate).length === 0 ? (
            <div className="no-events-container card">
              <p>No hay eventos programados</p>
              <button className="add-event-button" onClick={openAddModal}>
                <Plus size={16} color="var(--color-primary)" />
                <span>Agregar evento</span>
              </button>
            </div>
          ) : (
            <div className="events-list">
              {getEventsForDate(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className="event-card card"
                  style={{ backgroundColor: getEventColor(event.type) }}
                >
                  <div className="event-header">
                    {getEventIcon(event.type)}
                    <span className="event-time">{event.time}</span>
                    {event.stress_level && (
                      <div className="stress-indicator">
                        <span>Estrés: {event.stress_level}/10</span>
                      </div>
                    )}
                  </div>
                  
                  <h4 className="event-title">{event.title}</h4>
                  
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mental Load Prediction */}
        <div className="prediction-card card">
          <h3>📊 Predicción de carga mental</h3>
          <div className="prediction-content">
            <div className="prediction-item">
              <span className="prediction-label">Mañana</span>
              <div className="prediction-bar">
                <div 
                  className="prediction-fill" 
                  style={{ width: '80%', backgroundColor: 'var(--color-warning)' }}
                />
              </div>
              <span className="prediction-value">Alta</span>
            </div>
            
            <div className="prediction-item">
              <span className="prediction-label">Pasado mañana</span>
              <div className="prediction-bar">
                <div 
                  className="prediction-fill" 
                  style={{ width: '40%', backgroundColor: 'var(--color-success)' }}
                />
              </div>
              <span className="prediction-value">Baja</span>
            </div>
          </div>
          
          <p className="prediction-note">
            💡 Sugerencia: Programa actividades de autocuidado después de días intensos.
          </p>
        </div>
      </div>

      <style jsx>{`
        .calendar-container {
          min-height: 100vh;
          background: var(--bg-secondary);
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-6);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
        }

        .calendar-header h1 {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
          margin-left: var(--spacing-3);
        }

        .add-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .add-button:hover {
          background: var(--color-gray-300);
        }

        .calendar-content {
          padding: var(--spacing-6);
          max-width: 1000px;
          margin: 0 auto;
        }

        .week-container {
          margin-bottom: var(--spacing-6);
        }

        .section-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-4);
        }

        .week-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .week-days {
          display: flex;
          gap: var(--spacing-3);
          min-width: max-content;
          padding-bottom: var(--spacing-2);
        }

        .day-card {
          background: var(--bg-primary);
          border: none;
          border-radius: var(--radius-lg);
          padding: var(--spacing-3);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }

        .day-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .day-card.today {
          background: var(--color-primary);
          color: var(--text-inverse);
        }

        .day-card.selected {
          background: var(--color-primary-dark);
          color: var(--text-inverse);
        }

        .day-name {
          font-size: var(--font-size-xs);
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          margin-bottom: var(--spacing-1);
        }

        .day-card.today .day-name,
        .day-card.selected .day-name {
          color: var(--text-inverse);
        }

        .day-date {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--spacing-2);
        }

        .day-card.today .day-date,
        .day-card.selected .day-date {
          color: var(--text-inverse);
        }

        .mental-load-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mental-load-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-bottom: var(--spacing-1);
        }

        .mental-load-text {
          font-size: var(--font-size-xs);
          font-weight: 500;
          color: var(--text-secondary);
        }

        .day-card.today .mental-load-text,
        .day-card.selected .mental-load-text {
          color: var(--text-inverse);
        }

        .recommendation-card {
          margin-bottom: var(--spacing-6);
        }

        .recommendation-card h3 {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-2);
        }

        .recommendation-card p {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: var(--spacing-4);
        }

        .events-container {
          margin-bottom: var(--spacing-6);
        }

        .no-events-container {
          text-align: center;
          padding: var(--spacing-6);
        }

        .no-events-container p {
          font-size: var(--font-size-base);
          color: var(--text-secondary);
          margin-bottom: var(--spacing-4);
        }

        .add-event-button {
          display: inline-flex;
          align-items: center;
          background: var(--bg-tertiary);
          border: none;
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background-color var(--transition-fast);
          gap: var(--spacing-2);
        }

        .add-event-button:hover {
          background: var(--color-gray-300);
        }

        .add-event-button span {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--color-primary);
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .event-card {
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .event-card:hover {
          transform: translateY(-1px);
        }

        .event-header {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-2);
          gap: var(--spacing-2);
        }

        .event-time {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
        }

        .stress-indicator {
          background: rgba(239, 68, 68, 0.1);
          padding: var(--spacing-1) var(--spacing-2);
          border-radius: var(--radius-md);
        }

        .stress-indicator span {
          font-size: var(--font-size-xs);
          font-weight: 500;
          color: var(--color-error);
        }

        .event-title {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-1);
        }

        .event-description {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .prediction-card h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-4);
        }

        .prediction-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-4);
        }

        .prediction-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
        }

        .prediction-label {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text-primary);
          width: 100px;
          flex-shrink: 0;
        }

        .prediction-bar {
          flex: 1;
          height: 8px;
          background: var(--color-gray-200);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .prediction-fill {
          height: 100%;
          border-radius: var(--radius-sm);
          transition: width var(--transition-normal);
        }

        .prediction-value {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--text-primary);
          width: 50px;
          text-align: right;
          flex-shrink: 0;
        }

        .prediction-note {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          line-height: 1.5;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .calendar-content {
            padding: var(--spacing-4);
          }

          .prediction-item {
            flex-direction: column;
            align-items: stretch;
            gap: var(--spacing-2);
          }

          .prediction-label,
          .prediction-value {
            width: auto;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default Calendar;