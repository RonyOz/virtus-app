import React, { useState } from 'react';
import { Users, Heart, MessageSquare, Plus, Shield, Coffee, Brain, Moon, BookOpen, Smile } from 'lucide-react';

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
  members: number;
}

/**
 * Community Page Component
 * Anonymous community platform with AI moderation
 */
const Community: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  const interests: Interest[] = [
    {
      id: 'alimentacion',
      name: 'Alimentación Saludable',
      icon: <Coffee size={20} color="var(--color-warning)" />,
      color: 'var(--color-warning)',
      members: 234
    },
    {
      id: 'sueño',
      name: 'Mejor Descanso',
      icon: <Moon size={20} color="#1E40AF" />,
      color: '#1E40AF',
      members: 189
    },
    {
      id: 'concentracion',
      name: 'Concentración',
      icon: <Brain size={20} color="#8B5CF6" />,
      color: '#8B5CF6',
      members: 156
    },
    {
      id: 'motivacion',
      name: 'Motivación',
      icon: <Smile size={20} color="var(--color-success)" />,
      color: 'var(--color-success)',
      members: 312
    },
    {
      id: 'ansiedad',
      name: 'Manejo de Ansiedad',
      icon: <Heart size={20} color="var(--color-error)" />,
      color: 'var(--color-error)',
      members: 98
    },
    {
      id: 'general',
      name: 'General',
      icon: <Users size={20} color="var(--color-gray-500)" />,
      color: 'var(--color-gray-500)',
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
   * Filter posts by selected category
   */
  const getFilteredPosts = () => {
    if (selectedCategory === 'general') return communityPosts;
    return communityPosts.filter(post => post.category === selectedCategory);
  };

  /**
   * Get icon for category
   */
  const getCategoryIcon = (category: string) => {
    const interest = interests.find(i => i.id === category);
    return interest?.icon || <Users size={16} color="var(--color-gray-500)" />;
  };

  /**
   * Get color for category
   */
  const getCategoryColor = (category: string) => {
    const interest = interests.find(i => i.id === category);
    return interest?.color || 'var(--color-gray-500)';
  };

  /**
   * Handle like button click
   */
  const handleLike = (postId: string) => {
    alert('¡Gracias! Tu apoyo ayuda a que este consejo llegue a más personas.');
  };

  /**
   * Handle reply button click
   */
  const handleReply = (postId: string) => {
    alert('Responder', 'Esta función estará disponible pronto. ¡Gracias por tu interés en ayudar!');
  };

  /**
   * Submit new post with AI moderation
   */
  const submitPost = () => {
    if (!newPostContent.trim()) return;
    
    alert('✨ IA Moderando\n\nTu mensaje está siendo revisado para asegurar que sea positivo y útil para la comunidad. Se publicará en breve.');
    setNewPostContent('');
    setShowNewPost(false);
  };

  return (
    <div className="community-container">
      {/* Header */}
      <div className="community-header">
        <Users size={24} color="var(--color-primary)" />
        <div className="header-text">
          <h1>Comunidad de Apoyo</h1>
          <p>Comparte y recibe consejos anónimos</p>
        </div>
        <button
          className="add-button"
          onClick={() => setShowNewPost(!showNewPost)}
        >
          <Plus size={20} color="var(--color-primary)" />
        </button>
      </div>

      <div className="community-content">
        {/* New Post Form */}
        {showNewPost && (
          <div className="new-post-container card">
            <h3>Comparte tu consejo anónimo</h3>
            <textarea
              className="new-post-input"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="¿Qué estrategia te ha funcionado? Comparte tu experiencia para ayudar a otros estudiantes..."
              rows={4}
            />
            <div className="new-post-actions">
              <button
                className="cancel-button"
                onClick={() => setShowNewPost(false)}
              >
                Cancelar
              </button>
              <button
                className={`submit-button ${!newPostContent.trim() ? 'disabled' : ''}`}
                onClick={submitPost}
                disabled={!newPostContent.trim()}
              >
                <Shield size={16} />
                <span>Enviar (IA Modera)</span>
              </button>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="categories-container">
          <div className="categories-scroll">
            <div className="categories">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  className={`category-button ${selectedCategory === interest.id ? 'active' : ''}`}
                  style={{
                    backgroundColor: selectedCategory === interest.id ? interest.color : 'var(--bg-tertiary)',
                    color: selectedCategory === interest.id ? 'var(--text-inverse)' : 'var(--text-primary)'
                  }}
                  onClick={() => setSelectedCategory(interest.id)}
                >
                  <div className="category-content">
                    {React.cloneElement(interest.icon as React.ReactElement, {
                      color: selectedCategory === interest.id ? 'var(--text-inverse)' : interest.color
                    })}
                    <span>{interest.name}</span>
                  </div>
                  <span className="category-members">
                    {interest.members}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="posts-container">
          <div className="posts-header">
            <h2>
              {selectedCategory === 'general' ? 'Todos los consejos' : interests.find(i => i.id === selectedCategory)?.name}
            </h2>
            <div className="ai-moderation-badge">
              <Shield size={14} color="var(--color-success)" />
              <span>IA Moderado</span>
            </div>
          </div>

          {getFilteredPosts().map((post) => (
            <div key={post.id} className="post-card card">
              <div className="post-header">
                <div className="post-author">
                  <div 
                    className="category-icon"
                    style={{ backgroundColor: `${getCategoryColor(post.category)}20` }}
                  >
                    {getCategoryIcon(post.category)}
                  </div>
                  <div>
                    <span className="author-name">{post.author}</span>
                    <span className="post-time">{post.timestamp}</span>
                  </div>
                </div>
                {post.isHelpful && (
                  <div className="helpful-badge">
                    <span>✨ Útil</span>
                  </div>
                )}
              </div>

              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">{post.content}</p>

              <div className="post-actions">
                <button
                  className="action-button"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart size={16} color="var(--color-error)" />
                  <span>{post.likes}</span>
                </button>

                <button
                  className="action-button"
                  onClick={() => handleReply(post.id)}
                >
                  <MessageSquare size={16} color="var(--color-gray-500)" />
                  <span>{post.replies}</span>
                </button>

                {post.aiModerated && (
                  <div className="ai-moderation-indicator">
                    <Shield size={12} color="var(--color-success)" />
                    <span>Verificado por IA</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="community-footer card">
            <h3>🤖 Moderación por IA</h3>
            <p>
              Todos los mensajes son revisados por inteligencia artificial para mantener un ambiente positivo y constructivo. Solo se publican consejos útiles y respetuosos.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .community-container {
          min-height: 100vh;
          background: var(--bg-secondary);
        }

        .community-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-6);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
        }

        .header-text {
          flex: 1;
          margin-left: var(--spacing-3);
        }

        .header-text h1 {
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

        .add-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .add-button:hover {
          background: var(--color-gray-300);
        }

        .community-content {
          max-width: 800px;
          margin: 0 auto;
          padding: var(--spacing-6);
        }

        .new-post-container {
          margin-bottom: var(--spacing-6);
        }

        .new-post-container h3 {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-3);
        }

        .new-post-input {
          width: 100%;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: var(--spacing-4);
          font-family: var(--font-family-primary);
          font-size: var(--font-size-base);
          color: var(--text-primary);
          background: var(--bg-primary);
          resize: vertical;
          margin-bottom: var(--spacing-4);
        }

        .new-post-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .new-post-actions {
          display: flex;
          justify-content: space-between;
        }

        .cancel-button {
          background: none;
          border: none;
          padding: var(--spacing-3) var(--spacing-5);
          border-radius: var(--radius-md);
          cursor: pointer;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .submit-button {
          display: flex;
          align-items: center;
          background: var(--color-primary);
          color: var(--text-inverse);
          border: none;
          padding: var(--spacing-3) var(--spacing-5);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          gap: var(--spacing-2);
          transition: background-color var(--transition-fast);
        }

        .submit-button:hover:not(.disabled) {
          background: var(--color-primary-dark);
        }

        .submit-button.disabled {
          background: var(--color-gray-400);
          cursor: not-allowed;
        }

        .categories-container {
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
          margin: 0 -var(--spacing-6) var(--spacing-6);
          padding: var(--spacing-4) var(--spacing-6);
        }

        .categories-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .categories {
          display: flex;
          gap: var(--spacing-3);
          min-width: max-content;
          padding-bottom: var(--spacing-2);
        }

        .category-button {
          background: var(--bg-tertiary);
          border: none;
          border-radius: var(--radius-lg);
          padding: var(--spacing-3);
          min-width: 120px;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .category-button:hover {
          transform: translateY(-1px);
        }

        .category-content {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-1);
          gap: var(--spacing-2);
        }

        .category-content span {
          font-size: var(--font-size-xs);
          font-weight: 500;
        }

        .category-members {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
        }

        .category-button.active .category-members {
          color: var(--text-inverse);
        }

        .posts-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .posts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-4);
        }

        .posts-header h2 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
        }

        .ai-moderation-badge {
          display: flex;
          align-items: center;
          background: var(--color-secondary-light);
          padding: var(--spacing-1) var(--spacing-2);
          border-radius: var(--radius-lg);
          gap: var(--spacing-1);
        }

        .ai-moderation-badge span {
          font-size: var(--font-size-xs);
          font-weight: 500;
          color: #065F46;
        }

        .post-card {
          transition: transform var(--transition-fast);
        }

        .post-card:hover {
          transform: translateY(-1px);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-3);
        }

        .post-author {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
        }

        .category-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .author-name {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--text-primary);
          display: block;
        }

        .post-time {
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
        }

        .helpful-badge {
          background: var(--color-accent-light);
          padding: var(--spacing-1) var(--spacing-2);
          border-radius: var(--radius-md);
        }

        .helpful-badge span {
          font-size: var(--font-size-xs);
          font-weight: 500;
          color: #92400E;
        }

        .post-title {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-2);
        }

        .post-content {
          font-size: var(--font-size-base);
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-4);
        }

        .post-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
        }

        .action-button {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          gap: var(--spacing-1);
          transition: color var(--transition-fast);
        }

        .action-button:hover {
          color: var(--color-primary);
        }

        .action-button span {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text-secondary);
        }

        .ai-moderation-indicator {
          display: flex;
          align-items: center;
          margin-left: auto;
          gap: var(--spacing-1);
        }

        .ai-moderation-indicator span {
          font-size: var(--font-size-xs);
          color: #065F46;
        }

        .community-footer {
          text-align: center;
          margin-top: var(--spacing-5);
        }

        .community-footer h3 {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-2);
        }

        .community-footer p {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .community-content {
            padding: var(--spacing-4);
          }

          .categories-container {
            margin: 0 -var(--spacing-4) var(--spacing-4);
            padding: var(--spacing-3) var(--spacing-4);
          }

          .posts-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-2);
          }

          .post-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-2);
          }
        }
      `}</style>
    </div>
  );
};

export default Community;