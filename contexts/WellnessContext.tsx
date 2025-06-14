import React, { createContext, useContext, useState, useEffect } from 'react';

interface WellnessData {
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  water: number;
  anxiety: number;
  lastUpdated: Date;
}

interface Pet {
  name: string;
  level: number;
  happiness: number;
  health: number;
  lastFed: Date;
}

interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  category: 'academic' | 'wellness' | 'social';
}

interface WellnessContextType {
  wellnessData: WellnessData;
  pet: Pet;
  dailyGoals: DailyGoal[];
  streak: number;
  updateWellnessData: (data: Partial<WellnessData>) => void;
  feedPet: () => void;
  completeGoal: (goalId: string) => void;
  motivationalMessage: string;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

const motivationalMessages = [
  "Cada día es una nueva oportunidad para crecer 🌱",
  "Tu bienestar es una inversión, no un gasto ✨",
  "Pequeños pasos, grandes cambios 🚀",
  "Eres más fuerte de lo que crees 💪",
  "El autocuidado no es egoísta, es necesario 💚",
  "Progreso, no perfección 🌟",
  "Tu salud mental importa tanto como la física 🧠",
  "Celebra cada pequeña victoria 🎉"
];

export function WellnessProvider({ children }: { children: React.ReactNode }) {
  const [wellnessData, setWellnessData] = useState<WellnessData>({
    mood: 7,
    energy: 6,
    stress: 4,
    sleep: 7,
    water: 3,
    anxiety: 3,
    lastUpdated: new Date(),
  });

  const [pet, setPet] = useState<Pet>({
    name: 'Luna',
    level: 5,
    happiness: 80,
    health: 85,
    lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  });

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([
    {
      id: '1',
      title: 'Tomar 8 vasos de agua',
      completed: false,
      category: 'wellness'
    },
    {
      id: '2',
      title: 'Revisar apuntes de cálculo',
      completed: false,
      category: 'academic'
    },
    {
      id: '3',
      title: 'Hacer 5 minutos de meditación',
      completed: false,
      category: 'wellness'
    },
    {
      id: '4',
      title: 'Llamar a un amigo',
      completed: false,
      category: 'social'
    }
  ]);

  const [streak, setStreak] = useState(3);
  const [motivationalMessage] = useState(
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  );

  const updateWellnessData = (data: Partial<WellnessData>) => {
    setWellnessData(prev => ({ 
      ...prev, 
      ...data, 
      lastUpdated: new Date() 
    }));
  };

  const feedPet = () => {
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      health: Math.min(100, prev.health + 5),
      lastFed: new Date(),
    }));
  };

  const completeGoal = (goalId: string) => {
    setDailyGoals(prev => 
      prev.map(goal => 
        goal.id === goalId ? { ...goal, completed: true } : goal
      )
    );
    
    // Reward pet when goal is completed
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 5),
      level: prev.level + 0.1,
    }));
  };

  // Update pet status over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPet(prev => {
        const hoursSinceLastFed = (Date.now() - prev.lastFed.getTime()) / (1000 * 60 * 60);
        const happinessDecay = Math.max(0, prev.happiness - (hoursSinceLastFed * 2));
        const healthDecay = Math.max(0, prev.health - (hoursSinceLastFed * 1));
        
        return {
          ...prev,
          happiness: happinessDecay,
          health: healthDecay,
        };
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <WellnessContext.Provider value={{
      wellnessData,
      pet,
      dailyGoals,
      streak,
      updateWellnessData,
      feedPet,
      completeGoal,
      motivationalMessage
    }}>
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  const context = useContext(WellnessContext);
  if (context === undefined) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
}