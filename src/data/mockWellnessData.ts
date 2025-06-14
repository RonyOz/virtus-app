import { format, subDays } from 'date-fns';
import { WellnessData, WeeklyTrend, MetricInsight, WellnessGoal } from '../types/wellness';

// Generar datos simulados para los últimos 7 días
const generateDailyData = (metric: keyof WellnessData, baseValue: number, variance: number) => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const randomVariance = (Math.random() - 0.5) * variance;
    const value = Math.max(1, Math.min(10, baseValue + randomVariance));
    
    return {
      date: format(date, 'yyyy-MM-dd'),
      value: Number(value.toFixed(1))
    };
  });
};

// Datos semanales simulados para cada métrica
export const weeklyTrends: WeeklyTrend[] = [
  {
    metric: 'mood',
    data: generateDailyData('mood', 7.5, 2),
    average: 7.2,
    trend: 'up',
    change: 0.8
  },
  {
    metric: 'energy',
    data: generateDailyData('energy', 6.8, 2.5),
    average: 6.5,
    trend: 'stable',
    change: 0.2
  },
  {
    metric: 'stress',
    data: generateDailyData('stress', 4.5, 2),
    average: 4.2,
    trend: 'down',
    change: -0.6
  },
  {
    metric: 'sleep',
    data: generateDailyData('sleep', 7.2, 1.5),
    average: 7.0,
    trend: 'up',
    change: 0.4
  },
  {
    metric: 'water',
    data: generateDailyData('water', 5.5, 2),
    average: 5.3,
    trend: 'up',
    change: 0.7
  },
  {
    metric: 'anxiety',
    data: generateDailyData('anxiety', 3.8, 2),
    average: 3.5,
    trend: 'down',
    change: -0.5
  }
];

// Insights simulados
export const metricInsights: MetricInsight[] = [
  {
    title: "Mejora en el estado de ánimo",
    description: "Tu estado de ánimo ha mejorado un 15% esta semana",
    type: "positive",
    icon: "😊",
    value: 7.8,
    change: 15
  },
  {
    title: "Nivel de estrés bajo control",
    description: "Has mantenido niveles de estrés saludables",
    type: "positive",
    icon: "🧘",
    value: 4.2,
    change: -8
  },
  {
    title: "Hidratación mejorable",
    description: "Intenta aumentar tu consumo de agua",
    type: "negative",
    icon: "💧",
    value: 5.3,
    change: -5
  },
  {
    title: "Calidad del sueño estable",
    description: "Mantienes buenos hábitos de sueño",
    type: "neutral",
    icon: "😴",
    value: 7.0,
    change: 2
  }
];

// Objetivos simulados
export const wellnessGoals: WellnessGoal[] = [
  {
    id: "1",
    title: "Aumentar consumo de agua",
    target: 8,
    current: 5.3,
    unit: "vasos",
    category: "water",
    deadline: "2024-04-01",
    status: "at-risk"
  },
  {
    id: "2",
    title: "Mejorar calidad del sueño",
    target: 8,
    current: 7.0,
    unit: "horas",
    category: "sleep",
    deadline: "2024-03-25",
    status: "on-track"
  },
  {
    id: "3",
    title: "Reducir niveles de ansiedad",
    target: 3,
    current: 2.9,
    unit: "nivel",
    category: "anxiety",
    deadline: "2024-04-15",
    status: "on-track"
  }
];

// Datos actuales simulados
export const currentWellnessData: WellnessData = {
  mood: 7.8,
  energy: 6.5,
  stress: 4.2,
  sleep: 7.0,
  water: 5.3,
  anxiety: 3.5
}; 