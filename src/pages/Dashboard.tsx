import React, { useState } from 'react';
import { Heart, Zap, Shield, Moon, Droplets, Brain, TrendingUp, Calendar, Music, Plus, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';
import { motion } from 'framer-motion';
import { WellnessData, WeeklyTrend, MetricInsight, WellnessGoal } from '../types/wellness';
import { currentWellnessData, weeklyTrends, metricInsights, wellnessGoals } from '../data/mockWellnessData';
import LineChart from '../components/charts/LineChart';
import RadarChart from '../components/charts/RadarChart';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface WellnessMetric {
  key: keyof WellnessData;
  label: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  unit?: string;
}

/**
 * Dashboard Page Component
 * Modern wellness tracking with beautiful visualizations
 */
const Dashboard: React.FC = () => {
  const { wellnessData, updateWellnessData } = useWellness();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<WeeklyTrend | null>(null);

  const metrics: WellnessMetric[] = [
    {
      key: 'mood',
      label: 'Estado de ánimo',
      icon: <Heart className="w-6 h-6" />,
      color: 'text-red-500',
      gradient: 'from-red-400 to-pink-500',
    },
    {
      key: 'energy',
      label: 'Energía',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-yellow-500',
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      key: 'stress',
      label: 'Estrés',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-purple-500',
      gradient: 'from-purple-400 to-indigo-500',
    },
    {
      key: 'sleep',
      label: 'Calidad del sueño',
      icon: <Moon className="w-6 h-6" />,
      color: 'text-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      unit: 'hrs',
    },
    {
      key: 'water',
      label: 'Hidratación',
      icon: <Droplets className="w-6 h-6" />,
      color: 'text-cyan-500',
      gradient: 'from-cyan-400 to-blue-500',
      unit: 'vasos',
    },
    {
      key: 'anxiety',
      label: 'Ansiedad',
      icon: <Brain className="w-6 h-6" />,
      color: 'text-red-600',
      gradient: 'from-red-500 to-red-600',
    },
  ];

  /**
   * Determines the level and color based on metric value
   */
  const getMetricLevel = (value: number, max: number = 10) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return { level: 'Excelente', color: 'text-green-600' };
    if (percentage >= 60) return { level: 'Bueno', color: 'text-yellow-600' };
    if (percentage >= 40) return { level: 'Regular', color: 'text-orange-600' };
    return { level: 'Necesita atención', color: 'text-red-600' };
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

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
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
        action: "Ver recomendaciones",
        gradient: "from-blue-400 to-indigo-500"
      };
    }
    
    if (energy <= 4 && sleep <= 5) {
      return {
        title: "😴 Descanso necesario",
        message: "Tu energía y sueño están bajos. Es momento de priorizar el descanso.",
        action: "Tips de sueño",
        gradient: "from-indigo-400 to-purple-500"
      };
    }
    
    if (stress >= 7) {
      return {
        title: "🧘 Manejo del estrés",
        message: "Detectamos niveles altos de estrés. Te sugerimos técnicas de relajación.",
        action: "Ejercicios de respiración",
        gradient: "from-purple-400 to-pink-500"
      };
    }
    
    if (water <= 3) {
      return {
        title: "💧 Hidratación",
        message: "No olvides mantener tu cuerpo hidratado. ¡Tu cerebro lo agradecerá!",
        action: "Recordatorio de agua",
        gradient: "from-cyan-400 to-blue-500"
      };
    }
    
    return {
      title: "🌟 ¡Vas muy bien!",
      message: "Tu bienestar general está en buen estado. ¡Sigue así!",
      action: "Nuevos objetivos",
      gradient: "from-green-400 to-emerald-500"
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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative px-4 py-12 safe-area-top text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-4xl mt-6 font-bold mb-2">Mi Bienestar</h1>
            <p className="text-lg opacity-90 mb-6">Seguimiento diario de tu estado</p>
            
            <div className="inline-flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
              <span className="text-sm font-medium opacity-80 mb-1">Puntuación general</span>
              <div className="text-4xl font-bold mb-2">{overallScore}/10</div>
              <div className="w-32 h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${(overallScore / 10) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-3 sm:px-4 -mt-6 pb-8 space-y-4 sm:space-y-6"
      >
        {/* Recommendation Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl mt-8 p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 bg-gradient-to-r ${recommendation.gradient} rounded-xl flex items-center justify-center mr-3`}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{recommendation.title}</h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{recommendation.message}</p>
          <button className={`w-full bg-gradient-to-r ${recommendation.gradient} text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300`}>
            {recommendation.action}
          </button>
        </motion.div>

        {/* Insights Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {metricInsights.map((insight, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg ${
                insight.type === 'positive' ? 'border-l-4 border-green-500' :
                insight.type === 'negative' ? 'border-l-4 border-red-500' :
                'border-l-4 border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl sm:text-2xl">{insight.icon}</span>
                <span className={`text-xs sm:text-sm font-medium ${
                  insight.change > 0 ? 'text-green-500' :
                  insight.change < 0 ? 'text-red-500' :
                  'text-blue-500'
                }`}>
                  {insight.change > 0 ? '+' : ''}{insight.change}%
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">{insight.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Radar Chart */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Estado General</h2>
          <div className="h-[300px] sm:h-[400px]">
            <RadarChart data={currentWellnessData} />
          </div>
        </motion.div>

        {/* Weekly Trends */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-0">Tendencias Semanales</h2>
            <div className="flex flex-wrap gap-2">
              {metrics.map(metric => (
                <button
                  key={metric.key}
                  onClick={() => {
                    const trend = weeklyTrends.find(t => t.metric === metric.key);
                    setSelectedTrend(trend || null);
                  }}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedTrend?.metric === metric.key
                      ? `bg-gradient-to-r ${metric.gradient} text-white`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          
          {selectedTrend && (
            <div className="h-[250px] sm:h-[300px]">
              <LineChart
                data={selectedTrend.data}
                color={metrics.find(m => m.key === selectedTrend.metric)?.gradient.split(' ')[1] || '#000'}
                title={metrics.find(m => m.key === selectedTrend.metric)?.label || ''}
              />
            </div>
          )}
        </motion.div>

        {/* Goals Progress */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-0">Objetivos de Bienestar</h2>
            <button className="flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Objetivo
            </button>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {wellnessGoals.map(goal => {
              const metric = metrics.find(m => m.key === goal.category);
              const progress = (goal.current / goal.target) * 100;
              
              return (
                <div key={goal.id} className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className={`w-8 h-8 bg-gradient-to-r ${metric?.gradient} rounded-lg flex items-center justify-center mr-3`}>
                        {metric?.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 text-sm sm:text-base">{goal.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Meta: {goal.target} {goal.unit}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                      goal.status === 'on-track' ? 'bg-green-100 text-green-700' :
                      goal.status === 'at-risk' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {goal.status === 'on-track' ? 'En progreso' :
                       goal.status === 'at-risk' ? 'En riesgo' :
                       'Completado'}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.status === 'on-track' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        goal.status === 'at-risk' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                        'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-500">
                    <span>Progreso: {Math.round(progress)}%</span>
                    <span className="mt-1 sm:mt-0">Fecha límite: {format(new Date(goal.deadline), 'dd MMM yyyy', { locale: es })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;