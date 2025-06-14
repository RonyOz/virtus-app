export interface WellnessData {
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  water: number;
  anxiety: number;
}

export interface DailyMetric {
  date: string;
  value: number;
}

export interface WeeklyTrend {
  metric: keyof WellnessData;
  data: DailyMetric[];
  average: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface MetricInsight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  icon: string;
  value: number;
  change: number;
}

export interface WellnessGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: keyof WellnessData;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'completed';
} 