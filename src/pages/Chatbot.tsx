import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Heart, Lightbulb, Coffee, BookOpen } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  category?: 'greeting' | 'mood' | 'academic' | 'wellness' | 'motivation';
}

/**
 * Bot response templates organized by category
 * These can be customized to match brand voice and personality
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
    "Tu energía positiva es contagiosa. ¿Te parece si revisamos tus objetivos del día?"
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
 * AI-powered conversational interface for wellness support
 */
const Chatbot: React.FC = () => {
  const { wellnessData } = useWellness();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "¡Hola! 😊 Soy tu asistente de bienestar. ¿Cómo amaneciste hoy? Puedes contarme sobre tu estado de ánimo, energía, o si necesitas algún consejo.",
      isBot: true,
      timestamp: new Date(),
      category: 'greeting'
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
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        category: response.category as any,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  /**
   * Gets appropriate icon for message category
   */
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'mood':
        return <Heart size={16} color="var(--color-error)" />;
      case 'academic':
        return <BookOpen size={16} color="var(--color-primary)" />;
      case 'wellness':
        return <Coffee size={16} color="var(--color-success)" />;
      case 'motivation':
        return <Lightbulb size={16} color="var(--color-warning)" />;
      default:
        return <Bot size={16} color="var(--color-gray-500)" />;
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
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <Bot size={24} color="var(--color-primary)" />
        <div className="header-text">
          <h2>Asistente IA</h2>
          <p>Aquí para apoyarte 💙</p>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message-container ${message.isBot ? 'bot-message' : 'user-message'}`}
          >
            {message.isBot && (
              <div className="bot-avatar">
                {getCategoryIcon(message.category)}
              </div>
            )}
            
            <div className={`message-bubble ${message.isBot ? 'bot' : 'user'}`}>
              <p>{message.text}</p>
            </div>
            
            {!message.isBot && (
              <div className="user-avatar">
                <User size={16} color="var(--color-primary)" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="message-container bot-message">
            <div className="bot-avatar">
              <Bot size={16} color="var(--color-gray-500)" />
            </div>
            <div className="message-bubble bot">
              <p className="typing-text">Escribiendo...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="quick-actions-container">
          <p className="quick-actions-title">Respuestas rápidas:</p>
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-button"
                onClick={() => setInputText(action.action)}
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="input-container">
        <textarea
          className="text-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Escribe tu mensaje..."
          rows={1}
        />
        <button 
          className={`send-button ${inputText.trim() ? 'active' : ''}`}
          onClick={sendMessage}
          disabled={!inputText.trim()}
        >
          <Send size={20} />
        </button>
      </div>

      <style>{`
        .chatbot-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--bg-secondary);
        }

        .chatbot-header {
          display: flex;
          align-items: center;
          padding: var(--spacing-6);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
        }

        .header-text {
          margin-left: var(--spacing-3);
        }

        .header-text h2 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .header-text p {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-4);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .message-container {
          display: flex;
          align-items: flex-end;
          gap: var(--spacing-2);
        }

        .message-container.bot-message {
          justify-content: flex-start;
        }

        .message-container.user-message {
          justify-content: flex-end;
        }

        .bot-avatar,
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-avatar {
          background: var(--color-primary-light);
        }

        .message-bubble {
          max-width: 70%;
          padding: var(--spacing-3) var(--spacing-4);
          border-radius: var(--radius-xl);
          word-wrap: break-word;
        }

        .message-bubble.bot {
          background: var(--bg-primary);
          color: var(--text-primary);
          border-bottom-left-radius: var(--radius-sm);
        }

        .message-bubble.user {
          background: var(--color-primary);
          color: var(--text-inverse);
          border-bottom-right-radius: var(--radius-sm);
        }

        .message-bubble p {
          margin: 0;
          line-height: 1.5;
        }

        .typing-text {
          color: var(--text-secondary);
          font-style: italic;
        }

        .quick-actions-container {
          padding: var(--spacing-4);
          background: var(--bg-primary);
          border-top: 1px solid var(--border-light);
        }

        .quick-actions-title {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-3);
        }

        .quick-actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-2);
        }

        .quick-action-button {
          background: var(--bg-tertiary);
          border: none;
          padding: var(--spacing-2) var(--spacing-3);
          border-radius: var(--radius-full);
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .quick-action-button:hover {
          background: var(--color-gray-300);
        }

        .input-container {
          display: flex;
          align-items: flex-end;
          padding: var(--spacing-4);
          background: var(--bg-primary);
          border-top: 1px solid var(--border-light);
          gap: var(--spacing-3);
        }

        .text-input {
          flex: 1;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          padding: var(--spacing-3) var(--spacing-4);
          font-family: var(--font-family-primary);
          font-size: var(--font-size-base);
          color: var(--text-primary);
          background: var(--bg-primary);
          resize: none;
          min-height: 44px;
          max-height: 120px;
        }

        .text-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .send-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: var(--bg-tertiary);
          color: var(--text-tertiary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .send-button.active {
          background: var(--color-primary);
          color: var(--text-inverse);
        }

        .send-button:hover.active {
          background: var(--color-primary-dark);
        }

        .send-button:disabled {
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .message-bubble {
            max-width: 85%;
          }
          
          .quick-actions {
            flex-direction: column;
          }
          
          .quick-action-button {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;