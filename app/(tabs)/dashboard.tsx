import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { Heart, Zap, Shield, Moon, Droplets, Brain, TrendingUp, Calendar, Music } from 'lucide-react-native';
import { useWellness } from '@/contexts/WellnessContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface WellnessMetric {
  key: keyof typeof wellnessData;
  label: string;
  icon: React.ReactNode;
  color: string;
  unit?: string;
}

export default function DashboardScreen() {
  const { wellnessData, updateWellnessData } = useWellness();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metrics: WellnessMetric[] = [
    {
      key: 'mood',
      label: 'Estado de ánimo',
      icon: <Heart size={24} color="#EF4444" />,
      color: '#EF4444',
    },
    {
      key: 'energy',
      label: 'Energía',
      icon: <Zap size={24} color="#F59E0B" />,
      color: '#F59E0B',
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

  const getMetricLevel = (value: number, max: number = 10) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return { level: 'Excelente', color: '#10B981' };
    if (percentage >= 60) return { level: 'Bueno', color: '#F59E0B' };
    if (percentage >= 40) return { level: 'Regular', color: '#EF4444' };
    return { level: 'Necesita atención', color: '#DC2626' };
  };

  const getOverallWellness = () => {
    const positiveMetrics = (wellnessData.mood + wellnessData.energy + wellnessData.sleep) / 3;
    const negativeMetrics = (wellnessData.stress + wellnessData.anxiety) / 2;
    const overall = (positiveMetrics + (10 - negativeMetrics)) / 2;
    return Math.round(overall * 10) / 10;
  };

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

  const updateMetric = (key: keyof typeof wellnessData, value: number) => {
    updateWellnessData({ [key]: value });
  };

  const overallScore = getOverallWellness();
  const recommendation = getRecommendation();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mi Bienestar</Text>
        <Text style={styles.headerSubtitle}>Seguimiento diario de tu estado</Text>
        
        <View style={styles.overallScoreContainer}>
          <Text style={styles.overallScoreLabel}>Puntuación general</Text>
          <Text style={styles.overallScore}>{overallScore}/10</Text>
          <View style={styles.scoreBar}>
            <View 
              style={[
                styles.scoreProgress, 
                { width: `${(overallScore / 10) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Recommendation Card */}
        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <TrendingUp size={20} color="#3B82F6" />
            <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
          </View>
          <Text style={styles.recommendationMessage}>{recommendation.message}</Text>
          <TouchableOpacity style={styles.recommendationButton}>
            <Text style={styles.recommendationButtonText}>{recommendation.action}</Text>
          </TouchableOpacity>
        </View>

        {/* Metrics Grid */}
        <Text style={styles.sectionTitle}>Estado actual</Text>
        <View style={styles.metricsGrid}>
          {metrics.map((metric) => {
            const value = wellnessData[metric.key];
            const maxValue = metric.key === 'water' ? 8 : 10;
            const level = getMetricLevel(value, maxValue);
            
            return (
              <TouchableOpacity
                key={metric.key}
                style={[
                  styles.metricCard,
                  selectedMetric === metric.key && styles.metricCardSelected
                ]}
                onPress={() => setSelectedMetric(selectedMetric === metric.key ? null : metric.key)}
              >
                <View style={styles.metricHeader}>
                  {metric.icon}
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                </View>
                
                <View style={styles.metricValue}>
                  <Text style={styles.metricNumber}>
                    {value}{metric.unit && ` ${metric.unit}`}
                  </Text>
                  <Text style={[styles.metricLevel, { color: level.color }]}>
                    {level.level}
                  </Text>
                </View>
                
                <View style={styles.metricBar}>
                  <View 
                    style={[
                      styles.metricProgress,
                      { 
                        width: `${(value / maxValue) * 100}%`,
                        backgroundColor: metric.color
                      }
                    ]} 
                  />
                </View>

                {selectedMetric === metric.key && (
                  <View style={styles.metricSlider}>
                    <View style={styles.sliderContainer}>
                      {Array.from({ length: maxValue }, (_, i) => (
                        <TouchableOpacity
                          key={i}
                          style={[
                            styles.sliderDot,
                            (i + 1) <= value && { backgroundColor: metric.color }
                          ]}
                          onPress={() => updateMetric(metric.key, i + 1)}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Weekly Trends */}
        <View style={styles.trendsCard}>
          <View style={styles.trendsHeader}>
            <Calendar size={20} color="#6B7280" />
            <Text style={styles.trendsTitle}>Tendencias de la semana</Text>
          </View>
          
          <View style={styles.trendsList}>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Estado de ánimo promedio</Text>
              <Text style={styles.trendValue}>7.2/10 📈</Text>
            </View>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Mejor día de la semana</Text>
              <Text style={styles.trendValue}>Sábado 🌟</Text>
            </View>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Área de mejora</Text>
              <Text style={styles.trendValue}>Hidratación 💧</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.quickActionsTitle}>Acciones rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Music size={20} color="#3B82F6" />
              <Text style={styles.quickActionText}>Música relajante</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Brain size={20} color="#8B5CF6" />
              <Text style={styles.quickActionText}>Meditación 5 min</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#D1FAE5',
    marginBottom: 20,
  },
  overallScoreContainer: {
    alignItems: 'center',
  },
  overallScoreLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#D1FAE5',
    marginBottom: 8,
  },
  overallScore: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  scoreBar: {
    width: 200,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 8,
  },
  recommendationMessage: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  recommendationButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  recommendationButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  metricsGrid: {
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricCardSelected: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  metricValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  metricLevel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  metricBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  metricProgress: {
    height: '100%',
    borderRadius: 3,
  },
  metricSlider: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  trendsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 8,
  },
  trendsList: {
    gap: 12,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  trendValue: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  quickActionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginLeft: 8,
  },
});