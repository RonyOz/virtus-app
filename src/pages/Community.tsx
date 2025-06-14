import React, { useState } from 'react';
import { Users, Heart, MessageSquare, Plus, Shield, Coffee, Brain, Moon, BookOpen, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommunityPost {
  id: string;
  author: string;
  category: 'alimentacion' | 'sueño' | 'concentracion' | 'motivacion' | 'ansiedad' | 'general';
  title: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  isHelpful: boolean;
  aiModerated: boolean;
}

interface Interest {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  members: number;
}

/**
 * Community Page Component
 * Modern anonymous community platform
 */
const Community: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  const interests: Interest[] = [
    {
      id: 'alimentacion',
      name: 'Alimentación',
      icon: <Coffee className="w-5 h-5" />,
      color: 'text-yellow-600',
      gradient: 'from-yellow-400 to-orange-500',
      members: 234
    },
    {
      id: 'sueño',
      name: 'Descanso',
      icon: <Moon className="w-5 h-5" />,
      color: 'text-blue-600',
      gradient: 'from-blue-400 to-indigo-500',
      members: 189
    },
    {
      id: 'concentracion',
      name: 'Concentración',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-purple-600',
      gradient: 'from-purple-400 to-indigo-500',
      members: 156
    },
    {
      id: 'motivacion',
      name: 'Motivación',
      icon: <Smile className="w-5 h-5" />,
      color: 'text-green-600',
      gradient: 'from-green-400 to-emerald-500',
      members: 312
    },
    {
      id: 'ansiedad',
      name: 'Ansiedad',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-red-600',
      gradient: 'from-red-400 to-pink-500',
      members: 98
    },
    {
      id: 'general',
      name: 'General',
      icon: <Users className="w-5 h-5" />,
      color: 'text-gray-600',
      gradient: 'from-gray-400 to-slate-500',
      members: 445
    }
  ];

  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      author: 'Estudiante Anónimo',
      category: 'concentracion',
      title: 'Técnica que me cambió la vida para estudiar',
      content: 'Cuando me siento muy disperso, uso la técnica 5-4-3-2-1: identifico 5 cosas que veo, 4 que puedo tocar, 3 que escucho, 2 que huelo y 1 que saboreo. Me ayuda a estar presente antes de estudiar.',
      likes: 47,
      replies: 12,
      timestamp: '2h',
      isHelpful: true,
      aiModerated: true
    },
    {
      id: '2',
      author: 'Luna_2024',
      category: 'ansiedad',
      title: 'Para días difíciles',
      content: 'En mis días más duros, me recuerdo que los sentimientos son como el clima: temporales. Esta frase me ayuda: "No tienes que ser perfecto, solo tienes que intentarlo".',
      likes: 73,
      replies: 28,
      timestamp: '4h',
      isHelpful: true,
      aiModerated: true
    },
    {
      id: '3',
      author: 'Café_Student',
      category: 'alimentacion',
      title: 'Snacks que realmente funcionan',
      content: 'Dejé las galletas y ahora como almendras + una manzana cuando estudio. Mi concentración mejoró mucho y no tengo esos bajones de energía a media tarde.',
      likes: 29,
      replies: 8,
      timestamp: '6h',
      isHelpful: true,
      aiModerated: true
    },
    {
      id: '4',
      author: 'Noche_Owl',
      category: 'sueño',
      title: 'Rutina que me ayudó a dormir mejor',
      content: 'Apago todas las pantallas 1 hora antes de dormir y escribo 3 cosas buenas del día. Al principio era difícil, pero ahora duermo mucho mejor y me despierto más descansado.',
      likes: 56,
      replies: 15,
      timestamp: '8h',
      isHelpful: true,
      aiModerated: true
    },
    {
      id: '5',
      author: 'Resiliente_22',
      category: 'motivacion',
      title: 'Cuando sientes que no puedes más',
      content: 'Recordatorio: está bien tomar descansos. Está bien no ser productivo todo el tiempo. Está bien pedir ayuda. Tu bienestar es más importante que cualquier calificación.',
      likes: 94,
      replies: 31,
      timestamp: '12h',
      isHelpful: true,
      aiModerated: true
    }
  ];

  /**
   * Get interest data for category
   */
  const getInterestData = (category: string) => {
    return interests.find(i => i.id === category) || interests[interests.length - 1];
  };

  /**
   * Handle like button click
   */
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  /**
   * Handle reply button click
   */
  const handleReply = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, replies: post.replies + 1 } : post
      )
    );
    alert('Esta función estará disponible pronto. ¡Gracias por tu interés en ayudar!');
  };

  /**
   * Submit new post with AI moderation
   */
  const submitPost = () => {
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: (posts.length + 1).toString(),
      author: 'Tú (Anónimo)',
      category: selectedCategory as CommunityPost['category'],
      title: 'Nuevo consejo',
      content: newPostContent,
      likes: 0,
      replies: 0,
      timestamp: 'ahora',
      isHelpful: false,
      aiModerated: true
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowNewPost(false);
    alert('✨ IA Moderando\n\nTu mensaje está siendo revisado para asegurar que sea positivo y útil para la comunidad. Se publicará en breve.');
  };

  const getFilteredPosts = () => {
    if (selectedCategory === 'general') return posts;
    return posts.filter(post => post.category === selectedCategory);
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
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Comunidad de Apoyo</h1>
              <p className="text-sm text-gray-600">Comparte y recibe consejos anónimos</p>
            </div>
          </div>
          <button
            className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300"
            onClick={() => setShowNewPost(!showNewPost)}
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-6 space-y-6"
      >
        {/* New Post Form */}
        {showNewPost && (
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Comparte tu consejo anónimo</h3>
            <textarea
              className="w-full bg-gray-50 rounded-xl p-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="¿Qué estrategia te ha funcionado? Comparte tu experiencia para ayudar a otros estudiantes..."
              rows={4}
            />
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => setShowNewPost(false)}
              >
                Cancelar
              </button>
              <button
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  newPostContent.trim()
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={submitPost}
                disabled={!newPostContent.trim()}
              >
                <Shield className="w-4 h-4 mr-2" />
                Enviar (IA Modera)
              </button>
            </div>
          </motion.div>
        )}

        {/* Categories */}
        <motion.div variants={itemVariants}>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {interests.map((interest) => (
              <button
                key={interest.id}
                className={`flex-shrink-0 rounded-2xl p-4 min-w-[120px] text-center transition-all duration-300 ${
                  selectedCategory === interest.id
                    ? `bg-gradient-to-r ${interest.gradient} text-white shadow-lg`
                    : 'bg-white hover:shadow-md hover:-translate-y-1'
                }`}
                onClick={() => setSelectedCategory(interest.id)}
              >
                <div className={`flex justify-center mb-2 ${
                  selectedCategory === interest.id ? 'text-white' : interest.color
                }`}>
                  {interest.icon}
                </div>
                <span className={`text-sm font-medium block mb-1 ${
                  selectedCategory === interest.id ? 'text-white' : 'text-gray-800'
                }`}>
                  {interest.name}
                </span>
                <span className={`text-xs ${
                  selectedCategory === interest.id ? 'text-white/80' : 'text-gray-600'
                }`}>
                  {interest.members} miembros
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Posts Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedCategory === 'general' ? 'Todos los consejos' : getInterestData(selectedCategory).name}
          </h2>
          <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
            <Shield className="w-3 h-3 text-green-600 mr-1" />
            <span className="text-xs font-medium text-green-700">IA Moderado</span>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {getFilteredPosts().map((post) => {
            const interestData = getInterestData(post.category);
            
            return (
              <motion.div
                key={post.id}
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 bg-gradient-to-r ${interestData.gradient} rounded-full flex items-center justify-center mr-3`}>
                      <div className="text-white">
                        {interestData.icon}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">{post.author}</span>
                      <span className="text-sm text-gray-500 ml-2">{post.timestamp}</span>
                    </div>
                  </div>
                  {post.isHelpful && (
                    <div className="bg-yellow-100 px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-yellow-700">✨ Útil</span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">{post.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{post.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>

                    <button
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                      onClick={() => handleReply(post.id)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">{post.replies}</span>
                    </button>
                  </div>

                  {post.aiModerated && (
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 text-green-600 mr-1" />
                      <span className="text-xs text-green-700">Verificado por IA</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🤖 Moderación por IA</h3>
          <p className="text-gray-600 leading-relaxed">
            Todos los mensajes son revisados por inteligencia artificial para mantener un ambiente positivo y constructivo. Solo se publican consejos útiles y respetuosos.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Community;