import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Heart, Lightbulb, Coffee, BookOpen } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';
import { Message } from '../types/chat';
import { sendMessageToGPT } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Bot response templates organized by category
 */
const botResponses = {
  greeting: [
    "¡Hola! 😊 ¿Cómo amaneciste hoy? Me encantaría saber cómo te sientes.",
    "¡Qué gusto verte! ¿Cómo ha estado tu día hasta ahora?",
    "Hola, espero que tengas un día maravilloso. ¿En qué puedo ayudarte hoy?"
  ],
  mood_low: [
    "Entiendo que no te sientes muy bien hoy. Recuerda que es completamente normal tener días difíciles. ¿Te gustaría hablar sobre lo que te está preocupando?",
    "Parece que hoy ha sido un día complicado. Está bien sentirse así. ¿Qué te parece si hacemos un pequeño ejercicio de respiración juntos?",
    "Noto que tu ánimo está bajo. Tu bienestar es importante, y estoy aquí para apoyarte. ¿Hay algo específico que te está afectando?"
  ],
  mood_good: [
    "¡Me alegra saber que te sientes bien! 🌟 Aprovechemos esta energía positiva. ¿Hay algún objetivo que te gustaría trabajar hoy?",
    "¡Excelente! Cuando nos sentimos bien, es el momento perfecto para dar pasos hacia nuestras metas. ¿Qué te gustaría hacer hoy?",
    "Tu energía positiva es contagiosa. ¿Te parece si revisamos tus objetivos del día?ouiohiyhvujyhg"
  ],
  academic: [
    "Para estudiar mejor, te recomiendo la técnica Pomodoro: 25 minutos de estudio intenso + 5 minutos de descanso. ¿Has probado esta técnica?",
    "Si sientes que tienes mucha carga académica, hagamos un plan. ¿Qué materias son las más urgentes?",
    "Recuerda: es mejor estudiar un poco cada día que mucho en una sola sesión. ¿Cómo está tu organización de tiempo?"
  ],
  wellness: [
    "El autocuidado es fundamental. ¿Has tomado suficiente agua hoy? ¿Has hecho algún descanso activo?",
    "Tu bienestar físico y mental van de la mano. ¿Te gustaría que te guíe en un ejercicio de respiración?",
    "¿Sabías que caminar 10 minutos puede mejorar tu estado de ánimo? ¿Cuándo fue la última vez que saliste a tomar aire fresco?"
  ],
  motivation: [
    "Como decía Marco Aurelio: 'Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto, y encontrarás fuerza.'",
    "Cada pequeño paso cuenta. No necesitas ser perfecto, solo necesitas ser constante.",
    "Recuerda: el crecimiento sucede fuera de tu zona de confort, pero siempre a tu propio ritmo."
  ],
  tips: [
    "💡 Tip del día: Cuando te sientas abrumado, haz una lista de 3 cosas que SÍ puedes controlar ahora mismo.",
    "🌱 Dato curioso: Sonreír, incluso cuando no tienes ganas, puede activar las hormonas de la felicidad.",
    "☕ Si necesitas energía, prueba esto: 15 sentadillas + un vaso de agua. Es más efectivo que otra taza de café."
  ]
};

/**
 * Chatbot Page Component
 * Modern chat interface with animations
 */
const Chatbot: React.FC = () => {
  const { wellnessData } = useWellness();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "¡Hola! 😊 Soy tu asistente de bienestar. ¿Cómo te sientes hoy? Estoy aquí para escucharte y apoyarte.",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Analyzes user message and returns appropriate bot response
   */
  const getBotResponse = (userMessage: string): { text: string; category: string } => {
    const message = userMessage.toLowerCase();
    
    // Mood detection
    if (message.includes('triste') || message.includes('mal') || message.includes('deprimido') || message.includes('bajo')) {
      return {
        text: botResponses.mood_low[Math.floor(Math.random() * botResponses.mood_low.length)],
        category: 'mood'
      };
    }
    
    if (message.includes('bien') || message.includes('genial') || message.includes('excelente') || message.includes('feliz')) {
      return {
        text: botResponses.mood_good[Math.floor(Math.random() * botResponses.mood_good.length)],
        category: 'mood'
      };
    }
    
    // Academic help
    if (message.includes('estudio') || message.includes('examen') || message.includes('tarea') || message.includes('académico')) {
      return {
        text: botResponses.academic[Math.floor(Math.random() * botResponses.academic.length)],
        category: 'academic'
      };
    }
    
    // Wellness
    if (message.includes('cansado') || message.includes('estrés') || message.includes('ansiedad') || message.includes('agua')) {
      return {
        text: botResponses.wellness[Math.floor(Math.random() * botResponses.wellness.length)],
        category: 'wellness'
      };
    }
    
    // Motivation
    if (message.includes('motivación') || message.includes('desanimado') || message.includes('ayuda') || message.includes('consejo')) {
      return {
        text: botResponses.motivation[Math.floor(Math.random() * botResponses.motivation.length)],
        category: 'motivation'
      };
    }
    
    // Tips
    if (message.includes('tip') || message.includes('dato') || message.includes('curioso')) {
      return {
        text: botResponses.tips[Math.floor(Math.random() * botResponses.tips.length)],
        category: 'tips'
      };
    }
    
    // Default response
    const allResponses = [
      ...botResponses.motivation,
      ...botResponses.wellness,
      "Cuéntame más sobre eso. ¿Cómo te hace sentir?",
      "Entiendo. ¿Hay algo específico en lo que te gustaría trabajar?",
      "Es interesante lo que me cuentas. ¿Has intentado alguna estrategia para manejarlo?"
    ];
    
    return {
      text: allResponses[Math.floor(Math.random() * allResponses.length)],
      category: 'general'
    };
  };

  /**
   * Sends user message and generates bot response
   */
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await sendMessageToGPT([...messages, userMessage]);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error al obtener respuesta:', error);
      const fallbackResponse = getBotResponse(inputText);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse.text,
        isBot: true,
        timestamp: new Date(),
        category: fallbackResponse.category
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  /**
   * Gets appropriate icon for message category
   */
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'mood':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'academic':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'wellness':
        return <Coffee className="w-4 h-4 text-green-500" />;
      case 'motivation':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bot className="w-4 h-4 text-white" />;
    }
  };

  const quickActions = [
    { text: "¿Cómo estoy hoy?", action: "¿Cómo estoy hoy?" },
    { text: "Necesito motivación", action: "Necesito motivación" },
    { text: "Tips de estudio", action: "Dame tips de estudio" },
    { text: "Me siento ansioso", action: "Me siento ansioso" },
  ];

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handle Enter key press to send message
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 py-4 safe-area-top">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Asistente IA</h2>
            <p className="text-sm text-gray-600">Aquí para apoyarte 💙</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-end max-w-xs lg:max-w-md ${
                message.isBot ? 'flex-row' : 'flex-row-reverse'
              }`}>
                {message.isBot && (
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    {getCategoryIcon(message.category)}
                  </div>
                )}
                
                <div className={`px-4 py-3 rounded-2xl ${
                  message.isBot
                    ? 'bg-white shadow-md rounded-bl-sm'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                
                {!message.isBot && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-end max-w-xs">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white shadow-md px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-4 py-3 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
          <p className="text-sm font-medium text-gray-700 mb-3">Respuestas rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                onClick={() => setInputText(action.action)}
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200/50 px-4 py-4 safe-area-bottom">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              className="w-full bg-gray-100 rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isTyping}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
              inputText.trim() && !isTyping
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;