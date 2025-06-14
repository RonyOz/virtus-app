import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Zap, Target, Sparkles, MessageCircle, TrendingUp, Coffee, Moon, Smile } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';
import { motion } from 'framer-motion';
import { Pet } from '../components/Pet';

/**
 * Home Page Component
 * Modern mobile-first design with cards and animations
 */
const Home: React.FC = () => {
  const { pet, dailyGoals, streak, motivationalMessage, wellnessData, toggleGoalCompleted } = useWellness();

  const completedGoals = dailyGoals.filter(goal => goal.completed).length;
  const completionPercentage = (completedGoals / dailyGoals.length) * 100;

  const [dailyAnswers, setDailyAnswers] = useState({
    catMood: '',
    sleepQuality: '',
    energyLevel: ''
  });

  const handleAnswer = (questionKey: string, answer: string) => {
    setDailyAnswers(prev => ({ ...prev, [questionKey]: answer }));
  };

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
    if (wellnessData.mood >= 8) return 'from-green-400 to-emerald-500';
    if (wellnessData.mood >= 6) return 'from-yellow-400 to-orange-500';
    if (wellnessData.mood >= 4) return 'from-orange-400 to-red-500';
    return 'from-gray-400 to-gray-500';
  };

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
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative px-4 py-12 safe-area-top">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 mt-8">
              ¡Hola! 👋
            </h1>
            <p className="text-lg opacity-90 mb-4 max-w-md mx-auto">
              {motivationalMessage}
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
              <span className="text-sm font-medium">Racha de {streak} días</span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 mt-6 pb-8 space-y-6"
      >
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <Link
            to="/chatbot"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Chat IA</h3>
              <p className="text-sm text-gray-600 mt-1">Habla conmigo</p>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Mi Estado</h3>
              <p className="text-sm text-gray-600 mt-1">Ver progreso</p>
            </div>
          </Link>
        </motion.div>

        {/* Mood Check */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            ¿Cómo te sientes hoy?
          </h3>
          <div className="flex items-center justify-center mb-4">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getMoodColor()} mr-3`}></div>
            <span className="text-gray-700 font-medium">
              {wellnessData.mood >= 8 ? 'Excelente' :
                wellnessData.mood >= 6 ? 'Bien' :
                  wellnessData.mood >= 4 ? 'Regular' : 'Necesitas apoyo'}
            </span>
          </div>
          <Link
            to="/chatbot"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium text-center block hover:shadow-lg transition-all duration-300"
          >
            Hablar con IA
          </Link>
        </motion.div>

        {/* Pet Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
          <Pet pet={pet} getPetEmoji={getPetEmoji} />

        </motion.div>

        {/* Daily Goals */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Target className="w-5 h-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Objetivos del día</h3>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {completedGoals}/{dailyGoals.length}
            </span>
          </div>

          <div className="space-y-3 mb-4">
          {dailyGoals.slice(0, 3).map((goal) => (
            <button
              key={goal.id}
              onClick={() => {
                if (!goal.completed && typeof toggleGoalCompleted === 'function') {
                  toggleGoalCompleted(goal.id);
                }
              }}
              className="flex items-center w-full text-left focus:outline-none"
              disabled={goal.completed}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                goal.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300'
              }`}>
                {goal.completed && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </div>
              <span className={`flex-1 ${
                goal.completed 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-700'
              }`}>
                {goal.title}
              </span>
            </button>
          ))}
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-center text-sm font-medium text-gray-600">
              {Math.round(completionPercentage)}% completado
            </p>
          </div>
        </motion.div>

        {/* Daily Questions - Improved Cat Mood Picker */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            ¿Qué gato eres hoy? 🐾
          </h3>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Elige tu estado de ánimo según el gato que más te representa.
          </p>
          <div className="flex gap-3 overflow-x-auto p-2 px-1 justify-center">
            {[
              {
                src: 'https://i.pinimg.com/736x/66/6d/a6/666da6bda6c4550f038bc22c082fa047.jpg',
                label: 'Tieso',
                msg: 'A veces el día necesita un cambio 🌀'
              },
              {
                src: 'https://i.pinimg.com/736x/81/5f/cc/815fcc37ca4c4a40f0d58990d6cd0ccc.jpg',
                label: 'Traumado',
                msg: 'Animo Animo Animo 💪'
              },
              {
                src: 'https://i.pinimg.com/736x/28/1a/73/281a731e67a016683e8c5029da8a1ae1.jpg',
                label: 'Cansao',
                msg: 'Descansar también es avanzar 🌙'
              },
              {
                src: 'https://i.pinimg.com/736x/a4/49/ac/a449ac13253c8c72793bcfbe56d9aa2c.jpg',
                label: 'Todo bien',
                msg: 'Día tranquilo y feliz ☀️'
              },
              {
                src: 'https://i.pinimg.com/736x/4e/2e/96/4e2e967861b2f7cfab30795c5518f0dc.jpg',
                label: 'Colapso',
                msg: 'Respira... estás haciendo lo mejor que puedes 🌬️'
              }
            ].map(({ src, label, msg }, i) => (
              <motion.div
                key={i}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-1"
              >
                <img
                  src={src}
                  onClick={() => handleAnswer('catMood', src)}
                  alt={label}
                  className={`w-20 h-20 object-cover rounded-xl border-2 cursor-pointer transition-all duration-300 flex-shrink-0 ${
                    dailyAnswers.catMood === src
                      ? 'border-indigo-500 scale-105 shadow-md'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                />
                <span className="text-xs text-center text-gray-600">{label}</span>
              </motion.div>
            ))}
          </div>

          {dailyAnswers.catMood && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-indigo-50 rounded-xl px-4 py-3 text-center text-sm text-indigo-700 font-medium"
            >
              {
                {
                  'https://i.pinimg.com/736x/66/6d/a6/666da6bda6c4550f038bc22c082fa047.jpg': '¡Ese entusiasmo se contagia! 🐱💪',
                  'https://i.pinimg.com/736x/81/5f/cc/815fcc37ca4c4a40f0d58990d6cd0ccc.jpg': 'Día tranquilo y feliz ☀️',
                  'https://i.pinimg.com/736x/28/1a/73/281a731e67a016683e8c5029da8a1ae1.jpg': 'Descansar también es avanzar 🌙',
                  'https://i.pinimg.com/736x/a4/49/ac/a449ac13253c8c72793bcfbe56d9aa2c.jpg': 'Respira... estás haciendo lo mejor que puedes 🌬️',
                  'https://i.pinimg.com/736x/4e/2e/96/4e2e967861b2f7cfab30795c5518f0dc.jpg': 'A veces el día necesita un cambio 🌀'
                }[dailyAnswers.catMood]
              }
            </motion.div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            ¿Cómo dormiste anoche? 😴
          </h3>
          <div className="flex justify-center gap-3">
            {['Mal', 'Regular', 'Bien', 'Excelente'].map((label) => (
              <button
                key={label}
                onClick={() => handleAnswer('sleepQuality', label)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  dailyAnswers.sleepQuality === label
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ¿Cuánta energía tienes hoy? ⚡
          </h3>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => handleAnswer('energyLevel', String(level))}
                className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-200 ${
                  dailyAnswers.energyLevel === String(level)
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-110'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;