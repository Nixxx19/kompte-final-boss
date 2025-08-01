import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Video, VideoOff, RotateCcw, Download } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import PerformanceInsights from '@/components/PerformanceInsights';

const LiveCamera = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showResults, setShowResults] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [searchParams] = useSearchParams();
  const exerciseName = searchParams.get('exercise') || 'Push-ups';

  // Mock player data
  const playerData = {
    name: "Alex Johnson",
    age: 28,
    reps: 25,
    stamina: 82,
    calories: 156,
    correctForm: 87
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording logic here
      setTimeout(() => {
        setIsRecording(false);
        setShowResults(true);
      }, 5000); // Simulate 5-second recording
    }
  };

  const resetSession = () => {
    setShowResults(false);
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/exercise">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Exercise
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{exerciseName} Analysis</h1>
                  <p className="text-sm text-muted-foreground">Live camera analysis</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Upper Half - Camera Feed */}
            <section className="relative">
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl shadow-2xl">
                <div className="relative aspect-video w-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-lg"
                  />
                  
                  {/* Recording Overlay */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-red-500/90 text-white rounded-full backdrop-blur-sm">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Recording</span>
                    </div>
                  )}

                  {/* Camera Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                    <Button
                      onClick={toggleRecording}
                      size="lg"
                      className={`rounded-full w-16 h-16 ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                    >
                      {isRecording ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                    </Button>
                    
                    {showResults && (
                      <Button
                        onClick={resetSession}
                        variant="outline"
                        size="lg"
                        className="rounded-full bg-background/80 backdrop-blur-sm"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </section>

            {/* Lower Half - Results */}
            {showResults && (
              <>
                {/* Results Summary */}
                <section>
                  <Card className="backdrop-blur-xl bg-glass border-glass-border shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Session Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                          <div className="text-sm text-muted-foreground mb-1">Name</div>
                          <div className="text-lg font-bold text-foreground">{playerData.name}</div>
                        </div>
                        
                        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                          <div className="text-sm text-muted-foreground mb-1">Age</div>
                          <div className="text-lg font-bold text-foreground">{playerData.age}</div>
                        </div>
                        
                        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                          <div className="text-sm text-muted-foreground mb-1">Reps</div>
                          <div className="text-lg font-bold text-foreground">{playerData.reps}</div>
                        </div>
                        
                        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                          <div className="text-sm text-muted-foreground mb-1">Stamina</div>
                          <div className="text-lg font-bold text-foreground">{playerData.stamina}%</div>
                        </div>
                        
                        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                          <div className="text-sm text-muted-foreground mb-1">Calories</div>
                          <div className="text-lg font-bold text-foreground">{playerData.calories}</div>
                        </div>
                        
                        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                          <div className="text-sm text-muted-foreground mb-1">Form</div>
                          <div className="text-lg font-bold text-foreground">{playerData.correctForm}%</div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-center">
                        <Button className="gap-2">
                          <Download className="w-4 h-4" />
                          Download Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Performance Endurance Insights */}
                <section>
                  <PerformanceInsights />
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LiveCamera;