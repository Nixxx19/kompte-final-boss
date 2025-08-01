import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Video, VideoOff, RotateCcw, Download, Trophy } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import PerformanceInsights from '@/components/PerformanceInsights';

const LiveCamera = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showResults, setShowResults] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [searchParams] = useSearchParams();
  const exerciseName = searchParams.get('exercise') || 'Push-ups';
  const mode = searchParams.get('mode'); // 'upload' or null for live camera
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

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
    if (mode === 'upload') {
      // Handle uploaded video
      const videoUrl = sessionStorage.getItem('uploadedVideoUrl');
      if (videoUrl) {
        setUploadedVideoUrl(videoUrl);
      }
    } else {
      // Start live camera
      startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode]);

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
    if (mode === 'upload') {
      // For uploaded videos, just show results immediately
      setShowResults(true);
      return;
    }

    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording logic here
      setTimeout(() => {
        setIsRecording(false);
        setShowResults(true);
        // Turn off camera automatically
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      }, 5000); // Simulate 5-second recording
    }
  };

  const resetSession = () => {
    setShowResults(false);
    setIsRecording(false);
    if (mode !== 'upload') {
      // Restart camera for live mode
      startCamera();
    }
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
                  {mode === 'upload' && uploadedVideoUrl ? (
                    <video
                      src={uploadedVideoUrl}
                      controls
                      className="w-full h-full object-cover rounded-lg"
                      onLoadedMetadata={() => {
                        // Auto-play uploaded video
                        const video = document.querySelector('video') as HTMLVideoElement;
                        if (video) video.currentTime = 0;
                      }}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                  
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
                          : mode === 'upload' 
                            ? 'bg-gradient-to-r from-kompte-purple to-kompte-purple/80 hover:from-kompte-purple/90 hover:to-kompte-purple/70' 
                            : 'bg-primary hover:bg-primary/90'
                      }`}
                    >
                      {mode === 'upload' ? (
                        <Video className="w-6 h-6" />
                      ) : (
                        isRecording ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />
                      )}
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
                {/* Premium Results Summary */}
                <section className="animate-fade-in">
                  <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/90 via-card/80 to-card/70 border-0 shadow-2xl glow-primary">
                    <div className="absolute inset-0 bg-gradient-to-br from-kompte-purple/5 via-transparent to-velocity-orange/5"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kompte-purple via-velocity-orange to-accuracy-green"></div>
                    
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-kompte-purple bg-clip-text text-transparent mb-2">
                            Session Results
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {mode === 'upload' ? 'Video Analysis Complete' : 'Live Analysis Complete'}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kompte-purple/20 to-kompte-purple/30 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-kompte-purple" />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative">
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                        <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-kompte-purple/10 to-kompte-purple/5 border border-kompte-purple/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <div className="text-xs uppercase tracking-wider text-kompte-purple font-semibold mb-2">Name</div>
                          <div className="text-xl font-bold text-foreground">{playerData.name}</div>
                        </div>
                        
                        <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-velocity-orange/10 to-velocity-orange/5 border border-velocity-orange/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <div className="text-xs uppercase tracking-wider text-velocity-orange font-semibold mb-2">Age</div>
                          <div className="text-xl font-bold text-foreground">{playerData.age}</div>
                        </div>
                        
                        <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-data-blue/10 to-data-blue/5 border border-data-blue/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <div className="text-xs uppercase tracking-wider text-data-blue font-semibold mb-2">Reps</div>
                          <div className="text-xl font-bold text-foreground">{playerData.reps}</div>
                        </div>
                        
                        <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-accuracy-green/10 to-accuracy-green/5 border border-accuracy-green/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <div className="text-xs uppercase tracking-wider text-accuracy-green font-semibold mb-2">Stamina</div>
                          <div className="text-xl font-bold text-foreground">{playerData.stamina}%</div>
                        </div>
                        
                        <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-kompte-purple/10 to-kompte-purple/5 border border-kompte-purple/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <div className="text-xs uppercase tracking-wider text-kompte-purple font-semibold mb-2">Calories</div>
                          <div className="text-xl font-bold text-foreground">{playerData.calories}</div>
                        </div>
                        
                        <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-velocity-orange/10 to-velocity-orange/5 border border-velocity-orange/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <div className="text-xs uppercase tracking-wider text-velocity-orange font-semibold mb-2">Form</div>
                          <div className="text-xl font-bold text-foreground">{playerData.correctForm}%</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <Button className="gap-2 bg-gradient-to-r from-kompte-purple to-velocity-orange hover:from-kompte-purple/90 hover:to-velocity-orange/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <Download className="w-5 h-5" />
                          Download Premium Report
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