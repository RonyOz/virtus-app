import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Zap, Target, Sparkles, MessageCircle, TrendingUp } from 'lucide-react-native';
import { useWellness } from '@/contexts/WellnessContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { pet, dailyGoals, streak, motivationalMessage, wellnessData } = useWellness();
  
  const completedGoals = dailyGoals.filter(goal => goal.completed).length;
  const completionPercentage = (completedGoals / dailyGoals.length) * 100;

  const getPetEmoji = () => {
    if (pet.happiness > 80) return '🐱✨';
    if (pet.happiness > 60) return '🐱😊';
    if (pet.happiness > 40) return '🐱😐';
    return '🐱😴';
  };

  const getMoodColor = () => {
    if (wellnessData.mood >= 8) return '#10B981';
    if (wellnessData.mood >= 6) return '#F59E0B';
    if (wellnessData.mood >= 4) return '#EF4444';
    return '#6B7280';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Motivational Message */}
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>¡Hola! 👋</Text>
          <Text style={styles.motivationalText}>{motivationalMessage}</Text>
          <View style={styles.streakContainer}>
            <Sparkles size={16} color="#FDE047" />
            <Text style={styles.streakText}>Racha de {streak} días</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/chatbot')}
          >
            <MessageCircle size={24} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Chat IA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/dashboard')}
          >
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.actionButtonText}>Mi Estado</Text>
          </TouchableOpacity>
        </View>

        {/* Pet Section */}
        <View style={styles.petCard}>
          <View style={styles.petHeader}>
            <Text style={styles.petTitle}>Tu mascota: {pet.name}</Text>
            <Text style={styles.petLevel}>Nivel {Math.floor(pet.level)}</Text>
          </View>
          
          <View style={styles.petDisplay}>
            <Text style={styles.petEmoji}>{getPetEmoji()}</Text>
            <View style={styles.petStats}>
              <View style={styles.petStat}>
                <Heart size={16} color="#EF4444" />
                <Text style={styles.petStatText}>Felicidad: {Math.round(pet.happiness)}%</Text>
              </View>
              <View style={styles.petStat}>
                <Zap size={16} color="#10B981" />
                <Text style={styles.petStatText}>Salud: {Math.round(pet.health)}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.petProgressBar}>
            <View 
              style={[
                styles.petProgress, 
                { width: `${pet.happiness}%`, backgroundColor: '#10B981' }
              ]} 
            />
          </View>
        </View>

        {/* Daily Goals */}
        <View style={styles.goalsCard}>
          <View style={styles.goalsHeader}>
            <Target size={20} color="#3B82F6" />
            <Text style={styles.goalsTitle}>Objetivos del día</Text>
            <Text style={styles.goalsProgress}>{completedGoals}/{dailyGoals.length}</Text>
          </View>

          <View style={styles.goalsList}>
            {dailyGoals.slice(0, 3).map((goal) => (
              <View key={goal.id} style={styles.goalItem}>
                <View style={[
                  styles.goalCheckbox,
                  goal.completed && styles.goalCheckboxCompleted
                ]}>
                  {goal.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[
                  styles.goalText,
                  goal.completed && styles.goalTextCompleted
                ]}>
                  {goal.title}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${completionPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(completionPercentage)}% completado</Text>
          </View>
        </View>

        {/* Mood Check */}
        <View style={styles.moodCard}>
          <Text style={styles.moodTitle}>¿Cómo te sientes hoy?</Text>
          <View style={styles.moodDisplay}>
            <View style={[styles.moodIndicator, { backgroundColor: getMoodColor() }]} />
            <Text style={styles.moodText}>
              {wellnessData.mood >= 8 ? 'Excelente' : 
               wellnessData.mood >= 6 ? 'Bien' :
               wellnessData.mood >= 4 ? 'Regular' : 'Necesitas apoyo'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.moodButton}
            onPress={() => router.push('/chatbot')}
          >
            <Text style={styles.moodButtonText}>Hablar con IA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 12,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    color: '#FDE047',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 8,
  },
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  petTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  petLevel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  petDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  petEmoji: {
    fontSize: 48,
    marginRight: 20,
  },
  petStats: {
    flex: 1,
  },
  petStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  petStatText: {
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  petProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  petProgress: {
    height: '100%',
    borderRadius: 4,
  },
  goalsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    flex: 1,
    marginLeft: 8,
  },
  goalsProgress: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  goalsList: {
    marginBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCheckboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  goalText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  goalTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  moodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  moodText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  moodButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  moodButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
});