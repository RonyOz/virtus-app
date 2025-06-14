import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';
import { Message } from '../types/chat';
import { sendMessageToGPT } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';

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
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?",
        isBot: true,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
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
                    <Bot className="w-4 h-4 text-white" />
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