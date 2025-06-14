import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, AlertTriangle, BookOpen, Coffee, Users, Brain } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';
import { motion } from 'framer-motion';
import { generateRecommendation } from '../services/generateRecommendation';

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

interface NewEvent {
  title: string;
  date: string;
  time: string;
  type: 'academic' | 'wellness' | 'social' | 'warning';
}

/**
 * Calendar Page Component
 * Modern calendar with mental load prediction
 */
const Calendar: React.FC = () => {
  const { wellnessData } = useWellness();
  const [selectedDate, setSelectedDate] = useState('2025-01-28');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendationText, setRecommendationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    date: '',
    time: '',
    type: 'academic'
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [mainRecommendation, setMainRecommendation] = useState({
    title: '🌟 Optimización del día',
    message: 'Tu día se ve equilibrado. ¡Mantén ese balance entre productividad y bienestar!',
    action: 'Ver más sugerencias',
    gradient: 'from-blue-400 to-indigo-500'
  });
  const [isMainButtonLoading, setIsMainButtonLoading] = useState(false);

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

  /**
   * Generate wellness recommendation based on current state and event data
   */
  const generateWellnessRecommendation = (eventData?: CalendarEvent) => {
    const todayEvents = eventData ? [eventData] : getEventsForDate(selectedDate);
    const academicEvents = todayEvents.filter(e => e.type === 'academic').length;
    const stressLevel = wellnessData.stress;
    const mood = wellnessData.mood;

    if (eventData?.type === 'academic' && stressLevel >= 6) {
      return {
        title: '📚 Recomendación para evento académico',
        message: 'Este evento académico coincide con un nivel de estrés elevado. Te sugerimos programar un descanso de 15 minutos antes y después del evento.',
        action: 'Programar descansos',
        gradient: 'from-purple-400 to-indigo-500'
      };
    }

    if (eventData?.type === 'wellness') {
      return {
        title: '🧘 Recomendación de bienestar',
        message: 'Excelente elección incluir una actividad de bienestar. Esto ayudará a balancear tu carga mental.',
        action: 'Ver más sugerencias',
        gradient: 'from-green-400 to-emerald-500'
      };
    }

    if (eventData?.type === 'social' && mood <= 5) {
      return {
        title: '👥 Recomendación social',
        message: 'Buena decisión programar una actividad social cuando tu estado de ánimo está bajo. La interacción social puede ayudar a mejorarlo.',
        action: 'Agregar más eventos sociales',
        gradient: 'from-yellow-400 to-orange-500'
      };
    }

    if (academicEvents >= 2 && stressLevel >= 6) {
      return {
        title: '🧘 Recomendación de bienestar',
        message: 'Tienes un día académicamente intenso. Te sugerimos incluir momentos de respiración profunda entre actividades.',
        action: 'Programar descansos',
        gradient: 'from-purple-400 to-indigo-500'
      };
    }

    if (mood <= 5) {
      return {
        title: '💚 Apoyo emocional',
        message: 'Tu estado de ánimo está bajo. ¿Qué te parece programar una actividad que disfrutes?',
        action: 'Agregar actividad placentera',
        gradient: 'from-green-400 to-emerald-500'
      };
    }

    return {
      title: '🌟 Optimización del día',
      message: 'Tu día se ve equilibrado. ¡Mantén ese balance entre productividad y bienestar!',
      action: 'Ver más sugerencias',
      gradient: 'from-blue-400 to-indigo-500'
    };
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.type) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    setRecommendationText('Generando recomendación personalizada...');
    setShowRecommendation(true);

    try {
      // Create new event object
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        type: newEvent.type,
        stress_level: wellnessData.stress,
        description: `Evento creado con estado de ánimo: ${wellnessData.mood}/10`
      };

      // Add to events list
      setEvents(prevEvents => [...prevEvents, event]);

      // Generate recommendation using the service
      const recommendation = await generateRecommendation(
        event.title,
        event.type,
        wellnessData.mood,
        wellnessData.stress
      );

      if (recommendation.includes('error') || recommendation.includes('Error')) {
        throw new Error(recommendation);
      }

      setRecommendationText(recommendation);
      setIsModalOpen(false);

      // Reset form
      setNewEvent({
        title: '',
        date: '',
        time: '',
        type: 'academic'
      });
    } catch (error) {
      console.error('Error al generar recomendación:', error);
      setRecommendationText('Lo siento, hubo un error al generar la recomendación. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoreSuggestions = async () => {
    setIsLoading(true);
    setRecommendationText('Generando más sugerencias...');

    try {
      const recommendation = await generateRecommendation(
        'Sugerencias adicionales',
        'wellness',
        wellnessData.mood,
        wellnessData.stress
      );

      if (recommendation.includes('error') || recommendation.includes('Error')) {
        throw new Error(recommendation);
      }

      setRecommendationText(recommendation);
    } catch (error) {
      console.error('Error al generar sugerencias adicionales:', error);
      setRecommendationText('Lo siento, hubo un error al generar sugerencias adicionales. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMainRecommendationClick = async () => {
    setIsMainButtonLoading(true);
    try {
      const recommendation = await generateRecommendation(
        'Recomendación general',
        'wellness',
        wellnessData.mood,
        wellnessData.stress
      );

      if (recommendation.includes('error') || recommendation.includes('Error')) {
        throw new Error(recommendation);
      }

      setMainRecommendation({
        title: '🌟 Recomendación personalizada',
        message: recommendation,
        action: 'Ver más sugerencias',
        gradient: 'from-blue-400 to-indigo-500'
      });
    } catch (error) {
      console.error('Error al generar recomendación principal:', error);
      setMainRecommendation(prev => ({
        ...prev,
        message: 'Lo siento, hubo un error al generar la recomendación. Por favor intenta de nuevo.'
      }));
    } finally {
      setIsMainButtonLoading(false);
    }
  };

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
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'wellness':
        return <Brain className="w-4 h-4 text-green-600" />;
      case 'social':
        return <Users className="w-4 h-4 text-yellow-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  /**
   * Get background gradient for event type
   */
  const getEventGradient = (type: string) => {
    switch (type) {
      case 'academic':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'wellness':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'social':
        return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 'warning':
        return 'from-red-50 to-pink-50 border-red-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  /**
   * Get color for mental load indicator
   */
  const getMentalLoadColor = (load: number) => {
    if (load >= 7) return 'from-red-400 to-red-500';
    if (load >= 5) return 'from-yellow-400 to-orange-500';
    return 'from-green-400 to-emerald-500';
  };

  const recommendation = generateWellnessRecommendation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Calendario Inteligente</h1>
              <p className="text-sm text-gray-600">Planifica tu bienestar</p>
            </div>
          </div>
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-6 space-y-6"
      >
        {/* Week View */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Esta semana</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {weekDays.map((day) => (
              <button
                key={day.date}
                className={`flex-shrink-0 bg-white rounded-2xl p-4 min-w-[80px] text-center transition-all duration-300 ${day.isToday
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : selectedDate === day.date
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-md'
                    : 'hover:shadow-md hover:-translate-y-1'
                  }`}
                onClick={() => setSelectedDate(day.date)}
              >
                <span className={`text-xs font-medium block mb-1 ${day.isToday || selectedDate === day.date ? 'text-white/80' : 'text-gray-500'
                  }`}>
                  {day.day}
                </span>
                <span className={`text-xl font-bold block mb-2 ${day.isToday || selectedDate === day.date ? 'text-white' : 'text-gray-800'
                  }`}>
                  {new Date(day.date).getDate()}
                </span>

                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full mb-1 bg-gradient-to-r ${getMentalLoadColor(day.mentalLoad)}`} />
                  <span className={`text-xs font-medium ${day.isToday || selectedDate === day.date ? 'text-white/80' : 'text-gray-600'
                    }`}>
                    {day.mentalLoad >= 7 ? 'Alta' : day.mentalLoad >= 5 ? 'Media' : 'Baja'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* AI Recommendation */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 bg-gradient-to-r ${mainRecommendation.gradient} rounded-xl flex items-center justify-center mr-3`}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {isMainButtonLoading ? 'Generando recomendación...' : mainRecommendation.title}
            </h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {isMainButtonLoading ? 'Cargando...' : mainRecommendation.message}
          </p>
          <button 
            onClick={handleMainRecommendationClick}
            disabled={isMainButtonLoading}
            className={`w-full bg-gradient-to-r ${mainRecommendation.gradient} text-white py-3 rounded-xl font-medium 
              transition-all duration-300 
              ${isMainButtonLoading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              }`}
          >
            {isMainButtonLoading ? 'Generando...' : mainRecommendation.action}
          </button>
        </motion.div>

        {/* Este es el modal que abre el boton de agregar evento */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Agregar nuevo evento</h3>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-lg px-3 py-2 text-sm" 
                    placeholder="Título del evento"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input 
                      type="date" 
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input 
                      type="time" 
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select 
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as NewEvent['type'] }))}
                  >
                    <option value="academic">Académico</option>
                    <option value="wellness">Bienestar</option>
                    <option value="social">Social</option>
                    <option value="warning">Advertencia</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl font-medium hover:shadow-md transition">
                  Guardar evento
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de recomendación */}
        {showRecommendation && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative">
              <button
                onClick={() => setShowRecommendation(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {isLoading ? 'Generando recomendación...' : 'Recomendación personalizada'}
                </h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {recommendationText}
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowRecommendation(false)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  Entendido
                </button>
                <button 
                  onClick={handleMoreSuggestions}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Generando...' : 'Ver más sugerencias'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events for Selected Date */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Eventos del día ({new Date(selectedDate).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })})
          </h2>

          {getEventsForDate(selectedDate).length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">No hay eventos programados</p>
              <button className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar evento
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {getEventsForDate(selectedDate).map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className={`bg-gradient-to-r ${getEventGradient(event.type)} rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {getEventIcon(event.type)}
                      <span className="ml-2 text-sm font-medium text-gray-600">{event.time}</span>
                    </div>
                    {event.stress_level && (
                      <div className="bg-red-100 px-2 py-1 rounded-full">
                        <span className="text-xs font-medium text-red-700">
                          Estrés: {event.stress_level}/10
                        </span>
                      </div>
                    )}
                  </div>

                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h4>

                  {event.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Mental Load Prediction */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Predicción de carga mental</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Mañana</span>
              <div className="flex items-center flex-1 mx-4">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full w-4/5" />
                </div>
              </div>
              <span className="text-sm font-semibold text-orange-600">Alta</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Pasado mañana</span>
              <div className="flex items-center flex-1 mx-4">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full w-2/5" />
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">Baja</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800 leading-relaxed">
              💡 <strong>Sugerencia:</strong> Programa actividades de autocuidado después de días intensos.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Calendar;