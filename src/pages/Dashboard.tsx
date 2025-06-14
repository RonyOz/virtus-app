import React, { useState } from 'react';
import { Heart, Zap, Shield, Moon, Droplets, Brain, TrendingUp, Calendar, Music, Plus } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';
import { motion } from 'framer-motion';

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
        className="px-4 -mt-6 pb-8 space-y-6"
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

        {/* Metrics Grid */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estado actual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => {
              const value = wellnessData[metric.key];
              const maxValue = metric.key === 'water' ? 8 : 10;
              const level = getMetricLevel(value, maxValue);
              const isSelected = selectedMetric === metric.key;
              
              return (
                <motion.div
                  key={metric.key}
                  variants={itemVariants}
                  className={`bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:shadow-xl hover:-translate-y-1'
                  }`}
                  onClick={() => setSelectedMetric(isSelected ? null : metric.key)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`${metric.color} mr-3`}>
                        {metric.icon}
                      </div>
                      <span className="font-semibold text-gray-800">{metric.label}</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${level.color} bg-gray-100`}>
                      {level.level}
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between mb-3">
                    <span className="text-2xl font-bold text-gray-800">
                      {value}{metric.unit && ` ${metric.unit}`}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className={`h-full bg-gradient-to-r ${metric.gradient} rounded-full transition-all duration-500`}
                      style={{ width: `${(value / maxValue) * 100}%` }}
                    />
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        {Array.from({ length: maxValue }, (_, i) => (
                          <button
                            key={i}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                              (i + 1) <= value 
                                ? `bg-gradient-to-r ${metric.gradient} border-transparent` 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateMetric(metric.key, i + 1);
                            }}
                          >
                            <span className={`text-xs font-bold ${
                              (i + 1) <= value ? 'text-white' : 'text-gray-400'
                            }`}>
                              {i + 1}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Weekly Trends */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Tendencias de la semana</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Estado de ánimo promedio</span>
              <span className="font-semibold text-gray-800">7.2/10 📈</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Mejor día de la semana</span>
              <span className="font-semibold text-gray-800">Sábado 🌟</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Área de mejora</span>
              <span className="font-semibold text-gray-800">Hidratación 💧</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
              <Music className="w-5 h-5 mr-2" />
              <span>Música relajante</span>
            </button>
            <button className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
              <Brain className="w-5 h-5 mr-2" />
              <span>Meditación 5 min</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;