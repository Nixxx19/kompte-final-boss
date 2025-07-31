import { useState } from 'react';
import { PlayerDetails, type PlayerDetails as PlayerDetailsType } from '@/components/PlayerDetails';
import { ExerciseSelector, type ExerciseType } from '@/components/ExerciseSelector';
import { ExerciseUpload } from '@/components/ExerciseUpload';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Exercise = () => {
  const [playerDetails, setPlayerDetails] = useState<PlayerDetailsType | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Exercise Analysis</h1>
                    <p className="text-sm text-muted-foreground">AI-powered performance tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Player Details Section */}
            <section>
              <PlayerDetails onDetailsChange={setPlayerDetails} />
            </section>

            {/* Exercise Selection Section */}
            <section>
              <ExerciseSelector 
                onExerciseSelect={setSelectedExercise}
                selectedExercise={selectedExercise}
              />
            </section>

            {/* Upload Section - Only show if exercise is selected */}
            {selectedExercise && (
              <section>
                <ExerciseUpload selectedExercise={selectedExercise} />
              </section>
            )}

            {/* Progress Summary */}
            <section>
              <div className="relative backdrop-blur-xl bg-glass border-glass-border rounded-lg p-6 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5 rounded-lg" />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Session Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                        playerDetails?.name ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'
                      }`}>
                        ✓
                      </div>
                      <p className="text-sm font-medium">Player Details</p>
                      <p className="text-xs text-muted-foreground">
                        {playerDetails?.name ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                        selectedExercise ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'
                      }`}>
                        ✓
                      </div>
                      <p className="text-sm font-medium">Exercise Selection</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedExercise ? selectedExercise.name : 'Pending'}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium bg-muted text-muted-foreground">
                        3
                      </div>
                      <p className="text-sm font-medium">Video Upload</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Exercise;