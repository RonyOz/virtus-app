import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, AlertTriangle, BookOpen, Coffee, Users, Brain } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';
import { motion } from 'framer-motion';

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
 * Modern calendar with mental load prediction
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
        action: 'Programar descansos',
        gradient: 'from-purple-400 to-indigo-500'
      };
    }
    
    if (wellnessData.mood <= 5) {
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
                className={`flex-shrink-0 bg-white rounded-2xl p-4 min-w-[80px] text-center transition-all duration-300 ${
                  day.isToday 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                    : selectedDate === day.date 
                      ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-md' 
                      : 'hover:shadow-md hover:-translate-y-1'
                }`}
                onClick={() => setSelectedDate(day.date)}
              >
                <span className={`text-xs font-medium block mb-1 ${
                  day.isToday || selectedDate === day.date ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {day.day}
                </span>
                <span className={`text-xl font-bold block mb-2 ${
                  day.isToday || selectedDate === day.date ? 'text-white' : 'text-gray-800'
                }`}>
                  {new Date(day.date).getDate()}
                </span>
                
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full mb-1 bg-gradient-to-r ${getMentalLoadColor(day.mentalLoad)}`} />
                  <span className={`text-xs font-medium ${
                    day.isToday || selectedDate === day.date ? 'text-white/80' : 'text-gray-600'
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
            <div className={`w-10 h-10 bg-gradient-to-r ${recommendation.gradient} rounded-xl flex items-center justify-center mr-3`}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{recommendation.title}</h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{recommendation.message}</p>
          <button className={`w-full bg-gradient-to-r ${recommendation.gradient} text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300`}>
            {recommendation.action}
          </button>
        </motion.div>

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
              <button className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
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