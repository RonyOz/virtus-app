import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, TriangleAlert as AlertTriangle, BookOpen, Coffee, Users, Brain } from 'lucide-react-native';
import { useWellness } from '@/contexts/WellnessContext';

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

export default function CalendarScreen() {
  const { wellnessData } = useWellness();
  const [selectedDate, setSelectedDate] = useState('2025-01-28');

  // Generate week days
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

  const events: CalendarEvent[] = [
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
  ];

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <BookOpen size={16} color="#3B82F6" />;
      case 'wellness':
        return <Brain size={16} color="#10B981" />;
      case 'social':
        return <Users size={16} color="#F59E0B" />;
      case 'warning':
        return <AlertTriangle size={16} color="#EF4444" />;
      default:
        return <CalendarIcon size={16} color="#6B7280" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'academic':
        return '#DBEAFE';
      case 'wellness':
        return '#D1FAE5';
      case 'social':
        return '#FEF3C7';
      case 'warning':
        return '#FEE2E2';
      default:
        return '#F3F4F6';
    }
  };

  const getMentalLoadColor = (load: number) => {
    if (load >= 7) return '#EF4444';
    if (load >= 5) return '#F59E0B';
    return '#10B981';
  };

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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <CalendarIcon size={24} color="#3B82F6" />
        <Text style={styles.headerTitle}>Calendario Inteligente</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Week View */}
      <View style={styles.weekContainer}>
        <Text style={styles.sectionTitle}>Esta semana</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.weekDays}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day.date}
                style={[
                  styles.dayCard,
                  day.isToday && styles.todayCard,
                  selectedDate === day.date && styles.selectedDayCard
                ]}
                onPress={() => setSelectedDate(day.date)}
              >
                <Text style={[
                  styles.dayName,
                  day.isToday && styles.todayText,
                  selectedDate === day.date && styles.selectedDayText
                ]}>
                  {day.day}
                </Text>
                <Text style={[
                  styles.dayDate,
                  day.isToday && styles.todayText,
                  selectedDate === day.date && styles.selectedDayText
                ]}>
                  {new Date(day.date).getDate()}
                </Text>
                
                {/* Mental Load Indicator */}
                <View style={styles.mentalLoadContainer}>
                  <View 
                    style={[
                      styles.mentalLoadDot,
                      { backgroundColor: getMentalLoadColor(day.mentalLoad) }
                    ]} 
                  />
                  <Text style={styles.mentalLoadText}>
                    {day.mentalLoad >= 7 ? 'Alta' : day.mentalLoad >= 5 ? 'Media' : 'Baja'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* AI Recommendation */}
      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
        <Text style={styles.recommendationMessage}>{recommendation.message}</Text>
        <TouchableOpacity style={styles.recommendationButton}>
          <Text style={styles.recommendationButtonText}>{recommendation.action}</Text>
        </TouchableOpacity>
      </View>

      {/* Events for Selected Date */}
      <View style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>
          Eventos del día ({new Date(selectedDate).toLocaleDateString('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })})
        </Text>
        
        {getEventsForDate(selectedDate).length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>No hay eventos programados</Text>
            <TouchableOpacity style={styles.addEventButton}>
              <Plus size={16} color="#3B82F6" />
              <Text style={styles.addEventText}>Agregar evento</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.eventsList}>
            {getEventsForDate(selectedDate).map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.eventCard,
                  { backgroundColor: getEventColor(event.type) }
                ]}
                onPress={() => Alert.alert(event.title, event.description || 'Sin descripción')}
              >
                <View style={styles.eventHeader}>
                  {getEventIcon(event.type)}
                  <Text style={styles.eventTime}>{event.time}</Text>
                  {event.stress_level && (
                    <View style={styles.stressIndicator}>
                      <Text style={styles.stressText}>Estrés: {event.stress_level}/10</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.eventTitle}>{event.title}</Text>
                
                {event.description && (
                  <Text style={styles.eventDescription}>{event.description}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Mental Load Prediction */}
      <View style={styles.predictionCard}>
        <Text style={styles.predictionTitle}>📊 Predicción de carga mental</Text>
        <View style={styles.predictionContent}>
          <View style={styles.predictionItem}>
            <Text style={styles.predictionLabel}>Mañana</Text>
            <View style={styles.predictionBar}>
              <View style={[styles.predictionFill, { width: '80%', backgroundColor: '#F59E0B' }]} />
            </View>
            <Text style={styles.predictionValue}>Alta</Text>
          </View>
          
          <View style={styles.predictionItem}>
            <Text style={styles.predictionLabel}>Pasado mañana</Text>
            <View style={styles.predictionBar}>
              <View style={[styles.predictionFill, { width: '40%', backgroundColor: '#10B981' }]} />
            </View>
            <Text style={styles.predictionValue}>Baja</Text>
          </View>
        </View>
        
        <Text style={styles.predictionNote}>
          💡 Sugerencia: Programa actividades de autocuidado después de días intensos.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    flex: 1,
    marginLeft: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: 'row',
    gap: 12,
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  todayCard: {
    backgroundColor: '#3B82F6',
  },
  selectedDayCard: {
    backgroundColor: '#1D4ED8',
  },
  dayName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  dayDate: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginVertical: 4,
  },
  todayText: {
    color: '#FFFFFF',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  mentalLoadContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  mentalLoadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  mentalLoadText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  recommendationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  recommendationButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  recommendationButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  eventsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  noEventsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  noEventsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addEventText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  stressIndicator: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  predictionCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  predictionContent: {
    gap: 16,
    marginBottom: 16,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  predictionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    width: 100,
  },
  predictionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  predictionFill: {
    height: '100%',
    borderRadius: 4,
  },
  predictionValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    width: 50,
    textAlign: 'right',
  },
  predictionNote: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});