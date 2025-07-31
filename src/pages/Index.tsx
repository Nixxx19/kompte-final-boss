import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Activity, 
  BarChart3, 
  Target, 
  Zap,
  ArrowRight,
  Play,
  Trophy,
  Users,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">KOMPTE AI</h1>
                  <p className="text-xs text-muted-foreground">Performance Analytics</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
                <Link to="/exercise" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Exercise</Link>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Upload</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Drill</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Analytics</a>
                <Button size="sm" className="bg-primary hover:bg-primary/80">
                  Get Started
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  KOMPTE<span className="text-primary">.</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Crafting Champions Since 2022.
                </p>
                <h2 className="text-2xl font-semibold text-foreground">
                  Ready Set KOMPTE.
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Upload your exercise videos to unlock professional-grade performance insights with AI-powered analysis and visualization.
                </p>
              </div>
              
              <div className="flex gap-4">
                <Link to="/exercise">
                  <Button size="lg" className="bg-primary hover:bg-primary/80 group">
                    <Play className="w-4 h-4 mr-2" />
                    Start Analysis
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="bg-secondary/50 border-border/50 hover:bg-secondary/70">
                  Watch Demo
                </Button>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <Card className="relative backdrop-blur-xl bg-glass border-glass-border p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 rounded-lg" />
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Play className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-foreground font-medium mb-2">See Analytics in Action</p>
                  <p className="text-sm text-muted-foreground">Real-time performance tracking</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Performance Features</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered analytics to track, analyze, and improve your exercise performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="relative backdrop-blur-xl bg-glass border-glass-border p-6 shadow-2xl group hover:shadow-3xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-green-500/20 text-green-400 w-fit mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Exercise Tracking</h4>
                <p className="text-muted-foreground text-sm">
                  Visualize exercise form and movement zones with precision tracking and real-time feedback.
                </p>
              </div>
            </Card>
            
            <Card className="relative backdrop-blur-xl bg-glass border-glass-border p-6 shadow-2xl group hover:shadow-3xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400 w-fit mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Performance Analysis</h4>
                <p className="text-muted-foreground text-sm">
                  Track form quality and performance trends over time with detailed insights and recommendations.
                </p>
              </div>
            </Card>
            
            <Card className="relative backdrop-blur-xl bg-glass border-glass-border p-6 shadow-2xl group hover:shadow-3xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 w-fit mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Form Insights</h4>
                <p className="text-muted-foreground text-sm">
                  Analyze movement timing and execution performance with AI-powered form analysis.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="relative backdrop-blur-xl bg-glass border-glass-border p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 rounded-lg" />
            <div className="relative z-10">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-xl bg-primary/20 text-primary">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">10K+</div>
                  <div className="text-sm text-muted-foreground">Athletes Trained</div>
                </div>
                
                <div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-xl bg-accent/20 text-accent">
                      <Activity className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">1M+</div>
                  <div className="text-sm text-muted-foreground">Exercises Analyzed</div>
                </div>
                
                <div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                
                <div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-xl bg-yellow-500/20 text-yellow-400">
                      <Trophy className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">Elite</div>
                  <div className="text-sm text-muted-foreground">Performance Level</div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="relative backdrop-blur-xl bg-glass border-glass-border p-12 shadow-2xl text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Ready to Elevate Your Performance?
              </h3>
              <p className="text-muted-foreground mb-8">
                Start your journey with AI-powered exercise analysis and unlock your full potential.
              </p>
              <Link to="/exercise">
                <Button size="lg" className="bg-primary hover:bg-primary/80 group">
                  <Activity className="w-4 h-4 mr-2" />
                  Start Your Analysis
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Index;