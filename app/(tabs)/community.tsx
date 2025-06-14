import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { Users, Heart, MessageSquare, Plus, Shield, Coffee, Brain, Moon, BookOpen, Smile } from 'lucide-react-native';

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

export default function CommunityScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  const interests: Interest[] = [
    {
      id: 'alimentacion',
      name: 'Alimentación Saludable',
      icon: <Coffee size={20} color="#F59E0B" />,
      color: '#F59E0B',
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
      icon: <Smile size={20} color="#10B981" />,
      color: '#10B981',
      members: 312
    },
    {
      id: 'ansiedad',
      name: 'Manejo de Ansiedad',
      icon: <Heart size={20} color="#EF4444" />,
      color: '#EF4444',
      members: 98
    },
    {
      id: 'general',
      name: 'General',
      icon: <Users size={20} color="#6B7280" />,
      color: '#6B7280',
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

  const getFilteredPosts = () => {
    if (selectedCategory === 'general') return communityPosts;
    return communityPosts.filter(post => post.category === selectedCategory);
  };

  const getCategoryIcon = (category: string) => {
    const interest = interests.find(i => i.id === category);
    return interest?.icon || <Users size={16} color="#6B7280" />;
  };

  const getCategoryColor = (category: string) => {
    const interest = interests.find(i => i.id === category);
    return interest?.color || '#6B7280';
  };

  const handleLike = (postId: string) => {
    Alert.alert('¡Gracias!', 'Tu apoyo ayuda a que este consejo llegue a más personas.');
  };

  const handleReply = (postId: string) => {
    Alert.alert('Responder', 'Esta función estará disponible pronto. ¡Gracias por tu interés en ayudar!');
  };

  const submitPost = () => {
    if (!newPostContent.trim()) return;
    
    Alert.alert(
      '✨ IA Moderando',
      'Tu mensaje está siendo revisado para asegurar que sea positivo y útil para la comunidad. Se publicará en breve.',
      [
        {
          text: 'Entendido',
          onPress: () => {
            setNewPostContent('');
            setShowNewPost(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Users size={24} color="#3B82F6" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Comunidad de Apoyo</Text>
          <Text style={styles.headerSubtitle}>Comparte y recibe consejos anónimos</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowNewPost(!showNewPost)}
        >
          <Plus size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* New Post Form */}
      {showNewPost && (
        <View style={styles.newPostContainer}>
          <Text style={styles.newPostTitle}>Comparte tu consejo anónimo</Text>
          <TextInput
            style={styles.newPostInput}
            value={newPostContent}
            onChangeText={setNewPostContent}
            placeholder="¿Qué estrategia te ha funcionado? Comparte tu experiencia para ayudar a otros estudiantes..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
          />
          <View style={styles.newPostActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowNewPost(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, !newPostContent.trim() && styles.submitButtonDisabled]}
              onPress={submitPost}
            >
              <Shield size={16} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Enviar (IA Modera)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        <View style={styles.categories}>
          {interests.map((interest) => (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.categoryButton,
                selectedCategory === interest.id && {
                  backgroundColor: interest.color,
                }
              ]}
              onPress={() => setSelectedCategory(interest.id)}
            >
              <View style={styles.categoryContent}>
                {React.cloneElement(interest.icon as React.ReactElement, {
                  color: selectedCategory === interest.id ? '#FFFFFF' : interest.color
                })}
                <Text style={[
                  styles.categoryText,
                  selectedCategory === interest.id && styles.categoryTextSelected
                ]}>
                  {interest.name}
                </Text>
              </View>
              <Text style={[
                styles.categoryMembers,
                selectedCategory === interest.id && styles.categoryMembersSelected
              ]}>
                {interest.members}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Posts */}
      <ScrollView style={styles.postsContainer}>
        <View style={styles.postsHeader}>
          <Text style={styles.postsTitle}>
            {selectedCategory === 'general' ? 'Todos los consejos' : interests.find(i => i.id === selectedCategory)?.name}
          </Text>
          <View style={styles.aiModerationBadge}>
            <Shield size={14} color="#10B981" />
            <Text style={styles.aiModerationText}>IA Moderado</Text>
          </View>
        </View>

        {getFilteredPosts().map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAuthor}>
                <View style={[
                  styles.categoryIcon,
                  { backgroundColor: `${getCategoryColor(post.category)}20` }
                ]}>
                  {getCategoryIcon(post.category)}
                </View>
                <View>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <Text style={styles.postTime}>{post.timestamp}</Text>
                </View>
              </View>
              {post.isHelpful && (
                <View style={styles.helpfulBadge}>
                  <Text style={styles.helpfulText}>✨ Útil</Text>
                </View>
              )}
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(post.id)}
              >
                <Heart size={16} color="#EF4444" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleReply(post.id)}
              >
                <MessageSquare size={16} color="#6B7280" />
                <Text style={styles.actionText}>{post.replies}</Text>
              </TouchableOpacity>

              {post.aiModerated && (
                <View style={styles.aiModerationIndicator}>
                  <Shield size={12} color="#10B981" />
                  <Text style={styles.aiIndicatorText}>Verificado por IA</Text>
                </View>
              )}
            </View>
          </View>
        ))}

        <View style={styles.communityFooter}>
          <Text style={styles.footerTitle}>🤖 Moderación por IA</Text>
          <Text style={styles.footerText}>
            Todos los mensajes son revisados por inteligencia artificial para mantener un ambiente positivo y constructivo. Solo se publican consejos útiles y respetuosos.
          </Text>
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    flex: 1,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPostContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  newPostTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  newPostInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#374151',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  newPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  categoryButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginLeft: 6,
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  categoryMembers: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  categoryMembersSelected: {
    color: '#FFFFFF',
  },
  postsContainer: {
    flex: 1,
    padding: 20,
  },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  postsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  aiModerationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiModerationText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#065F46',
    marginLeft: 4,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  authorName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  postTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  helpfulBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  helpfulText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
  },
  postTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  aiModerationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  aiIndicatorText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#065F46',
    marginLeft: 4,
  },
  communityFooter: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});