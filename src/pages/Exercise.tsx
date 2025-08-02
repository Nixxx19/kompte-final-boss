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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      
      {/* Animated particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{animationDelay: '0s'}} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent/40 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
      </div>
      
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
                <div className="flex items-center gap-3 group">
                  <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">Exercise Analysis</h1>
                    <p className="text-sm text-muted-foreground font-medium">Professional AI-powered performance tracking & insights</p>
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

            {/* Enhanced Progress Summary */}
            <section>
              <div className="premium-card rounded-lg p-8 shadow-luxury">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/8 to-primary/6 rounded-lg" />
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold gradient-text mb-3">Session Progress</h3>
                    <p className="text-muted-foreground font-medium">Track your analysis journey step by step</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center group">
                      <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-lg font-bold transition-all duration-500 shadow-lg ${
                        playerDetails?.name 
                          ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30 scale-110 pulse-glow' 
                          : 'bg-muted/30 text-muted-foreground border-2 border-muted/50'
                      }`}>
                        {playerDetails?.name ? '✓' : '1'}
                      </div>
                      <p className="text-lg font-semibold mb-2">Player Profile</p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {playerDetails?.name ? `Welcome, ${playerDetails.name}` : 'Enter your details'}
                      </p>
                      {playerDetails?.name && (
                        <div className="mt-2 text-xs text-green-400 font-medium">
                          ✨ Profile Complete
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center group">
                      <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-lg font-bold transition-all duration-500 shadow-lg ${
                        selectedExercise 
                          ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30 scale-110 pulse-glow' 
                          : 'bg-muted/30 text-muted-foreground border-2 border-muted/50'
                      }`}>
                        {selectedExercise ? '✓' : '2'}
                      </div>
                      <p className="text-lg font-semibold mb-2">Exercise Type</p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {selectedExercise ? selectedExercise.name : 'Choose your workout'}
                      </p>
                      {selectedExercise && (
                        <div className="mt-2 text-xs text-green-400 font-medium">
                          ✨ {selectedExercise.difficulty} Level
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center group">
                      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-lg font-bold bg-muted/30 text-muted-foreground border-2 border-muted/50 transition-all duration-500 shadow-lg group-hover:scale-105">
                        3
                      </div>
                      <p className="text-lg font-semibold mb-2">AI Analysis</p>
                      <p className="text-sm text-muted-foreground font-medium">Upload & analyze</p>
                      <div className="mt-2 text-xs text-primary font-medium">
                        🚀 Ready to start
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out rounded-full shadow-lg"
                        style={{
                          width: `${(playerDetails?.name ? 33.33 : 0) + (selectedExercise ? 33.33 : 0)}%`
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 font-medium">
                      {Math.round((playerDetails?.name ? 33.33 : 0) + (selectedExercise ? 33.33 : 0))}% Complete
                    </p>
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