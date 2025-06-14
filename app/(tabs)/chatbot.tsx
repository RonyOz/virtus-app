import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Heart, Lightbulb, Coffee, BookOpen } from 'lucide-react-native';
import { useWellness } from '@/contexts/WellnessContext';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  category?: 'greeting' | 'mood' | 'academic' | 'wellness' | 'motivation';
}

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

export default function ChatbotScreen() {
  const { wellnessData, updateWellnessData } = useWellness();
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
  const scrollViewRef = useRef<ScrollView>(null);

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

      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'mood':
        return <Heart size={16} color="#EF4444" />;
      case 'academic':
        return <BookOpen size={16} color="#3B82F6" />;
      case 'wellness':
        return <Coffee size={16} color="#10B981" />;
      case 'motivation':
        return <Lightbulb size={16} color="#F59E0B" />;
      default:
        return <Bot size={16} color="#6B7280" />;
    }
  };

  const quickActions = [
    { text: "¿Cómo estoy hoy?", action: "¿Cómo estoy hoy?" },
    { text: "Necesito motivación", action: "Necesito motivación" },
    { text: "Tips de estudio", action: "Dame tips de estudio" },
    { text: "Me siento ansioso", action: "Me siento ansioso" },
  ];

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Bot size={24} color="#3B82F6" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Asistente IA</Text>
          <Text style={styles.headerSubtitle}>Aquí para apoyarte 💙</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageContainer,
              message.isBot ? styles.botMessageContainer : styles.userMessageContainer
            ]}
          >
            {message.isBot && (
              <View style={styles.botAvatar}>
                {getCategoryIcon(message.category)}
              </View>
            )}
            
            <View style={[
              styles.messageBubble,
              message.isBot ? styles.botMessage : styles.userMessage
            ]}>
              <Text style={[
                styles.messageText,
                message.isBot ? styles.botMessageText : styles.userMessageText
              ]}>
                {message.text}
              </Text>
            </View>
            
            {!message.isBot && (
              <View style={styles.userAvatar}>
                <User size={16} color="#3B82F6" />
              </View>
            )}
          </View>
        ))}
        
        {isTyping && (
          <View style={[styles.messageContainer, styles.botMessageContainer]}>
            <View style={styles.botAvatar}>
              <Bot size={16} color="#6B7280" />
            </View>
            <View style={[styles.messageBubble, styles.botMessage]}>
              <Text style={styles.typingText}>Escribiendo...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Respuestas rápidas:</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
                onPress={() => setInputText(action.action)}
              >
                <Text style={styles.quickActionText}>{action.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#9CA3AF"
          multiline
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]}
          onPress={sendMessage}
        >
          <Send size={20} color={inputText.trim() ? "#FFFFFF" : "#9CA3AF"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botMessageText: {
    color: '#374151',
    fontFamily: 'Inter-Regular',
  },
  userMessageText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  typingText: {
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  quickActionsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quickActionsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  quickActionText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#374151',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
});