import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Zap, 
  Dumbbell, 
  Target,
  Clock,
  BarChart3
} from 'lucide-react';

interface ExerciseSelectorProps {
  onExerciseSelect: (exercise: ExerciseType) => void;
  selectedExercise: ExerciseType | null;
}

export interface ExerciseType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  calories: string;
}

const exercises: ExerciseType[] = [
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    icon: <Activity className="w-6 h-6" />,
    description: 'Full body cardio exercise',
    difficulty: 'Easy',
    duration: '30 sec',
    calories: '8-12'
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    icon: <Zap className="w-6 h-6" />,
    description: 'Cardio and leg strength',
    difficulty: 'Medium',
    duration: '30 sec',
    calories: '10-15'
  },
  {
    id: 'push-ups',
    name: 'Push Ups',
    icon: <Dumbbell className="w-6 h-6" />,
    description: 'Upper body strength',
    difficulty: 'Medium',
    duration: '10-15 reps',
    calories: '5-8'
  },
  {
    id: 'squats',
    name: 'Squats',
    icon: <Target className="w-6 h-6" />,
    description: 'Lower body strength',
    difficulty: 'Easy',
    duration: '15-20 reps',
    calories: '6-10'
  }
];

export const ExerciseSelector = ({ onExerciseSelect, selectedExercise }: ExerciseSelectorProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="relative backdrop-blur-xl bg-glass border-glass-border p-6 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5 rounded-lg" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent/20">
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Choose Exercise</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`relative group cursor-pointer transition-all duration-300 ${
                selectedExercise?.id === exercise.id 
                  ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
                  : 'hover:ring-1 hover:ring-accent/50'
              }`}
              onClick={() => onExerciseSelect(exercise)}
            >
              <Card className="h-full backdrop-blur-sm bg-secondary/30 border-border/50 p-4 hover:bg-secondary/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
                    {exercise.icon}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(exercise.difficulty).replace('text-', 'bg-')}`} />
                        <span className={`text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {exercise.duration}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {exercise.calories} cal
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};