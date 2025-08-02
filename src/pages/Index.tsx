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
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
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
        {/* Enhanced Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-all duration-300 group-hover:scale-110">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    KOMPTE AI
                  </h1>
                  <p className="text-xs text-muted-foreground">Performance Analytics</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center gap-8">
                <a href="#" className="nav-link text-sm text-muted-foreground hover:text-foreground">Dashboard</a>
                <Link to="/exercise" className="nav-link text-sm text-muted-foreground hover:text-foreground">Exercise</Link>
                <a href="#" className="nav-link text-sm text-muted-foreground hover:text-foreground">Upload</a>
                <a href="#" className="nav-link text-sm text-muted-foreground hover:text-foreground">Drill</a>
                <a href="#" className="nav-link text-sm text-muted-foreground hover:text-foreground">Analytics</a>
                <Button size="sm" className="btn-premium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <section className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-medium shadow-lg backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  <span className="gradient-text font-semibold">Trusted by Elite Athletes Worldwide</span>
                </div>
                
                <h1 className="text-6xl lg:text-8xl font-bold text-foreground leading-tight tracking-tight">
                  KOMPTE<span className="gradient-text">.</span>
                </h1>
                
                <h2 className="text-3xl lg:text-4xl font-semibold text-foreground opacity-90 tracking-wide">
                  Ready Set <span className="gradient-text">KOMPTE</span>.
                </h2>
                
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
                  Transform your training with professional-grade AI analysis. Upload exercise videos to unlock personalized insights, form corrections, and performance optimization that elite athletes trust.
                </p>
                
                <div className="flex items-center gap-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">10K+</div>
                    <div className="text-sm text-muted-foreground">Athletes</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">1M+</div>
                    <div className="text-sm text-muted-foreground">Analyses</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">95%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-6">
                <Link to="/exercise">
                  <Button size="lg" className="btn-premium group text-lg px-8 py-4">
                    <Play className="w-5 h-5 mr-3" />
                    Start Analysis
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="glass-card hover:bg-secondary/70 text-lg px-8 py-4 group">
                  <Play className="w-5 h-5 mr-3" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            {/* Enhanced Hero Visual */}
            <div className="relative animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-3xl animate-pulse" />
              <Card className="premium-card p-16 shadow-2xl relative float-animation">
                <div className="absolute inset-0 bg-gradient-hero rounded-lg" />
                <div className="relative z-10 text-center">
                  <div className="w-40 h-40 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center pulse-glow shadow-luxury">
                    <Play className="w-20 h-20 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 gradient-text">Experience The Future</h3>
                  <p className="text-muted-foreground text-lg font-medium">Real-time AI analysis with Olympic-level precision</p>
                  <div className="mt-6 flex justify-center">
                    <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                      ✨ AI-Powered Excellence
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              Performance Features
            </div>
            <h3 className="text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight">
              AI-Powered <span className="gradient-text">Excellence</span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
              Revolutionary machine learning algorithms deliver precision analysis that rivals Olympic-level coaching. Transform your performance with insights trusted by professional athletes worldwide.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/25 text-accent text-sm font-medium shadow-lg backdrop-blur-sm">
                <Target className="w-4 h-4" />
                <span className="font-semibold">99.7% Movement Recognition Accuracy</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Exercise Tracking",
                description: "Visualize exercise form and movement zones with precision tracking and real-time feedback.",
                color: "green",
                delay: "0s"
              },
              {
                icon: Zap,
                title: "Performance Analysis", 
                description: "Track form quality and performance trends over time with detailed insights and recommendations.",
                color: "orange",
                delay: "0.1s"
              },
              {
                icon: BarChart3,
                title: "Form Insights",
                description: "Analyze movement timing and execution performance with AI-powered form analysis.",
                color: "blue",
                delay: "0.2s"
              }
            ].map((feature, index) => (
              <Card key={index} className="glass-card p-8 shadow-2xl group hover:shadow-3xl transition-all duration-500 animate-scale-in hover:-translate-y-2" style={{animationDelay: feature.delay}}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className={`p-4 rounded-2xl bg-${feature.color}-500/20 text-${feature.color}-400 w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                    <span className="text-sm font-medium">Learn more</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="glass-card p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Trusted by <span className="gradient-text">Champions</span>
                </h3>
                <p className="text-muted-foreground text-lg">Join thousands of athletes achieving peak performance</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { icon: Users, value: "10K+", label: "Athletes Trained", color: "primary" },
                  { icon: Activity, value: "1M+", label: "Exercises Analyzed", color: "accent" },
                  { icon: TrendingUp, value: "95%", label: "Accuracy Rate", color: "green" },
                  { icon: Trophy, value: "Elite", label: "Performance Level", color: "yellow" }
                ].map((stat, index) => (
                  <div key={index} className="group animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <div className={`p-4 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color === 'accent' ? 'accent' : stat.color}-500/20 text-${stat.color === 'primary' ? 'primary' : stat.color === 'accent' ? 'accent' : stat.color}-400`}>
                        <stat.icon className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Enhanced CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="glass-card p-16 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent" />
            <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium mb-8">
                <Sparkles className="w-5 h-5" />
                Start Your Journey Today
              </div>
              
              <h3 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Ready to Elevate Your <span className="gradient-text">Performance?</span>
              </h3>
              
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                Join the elite athletes who trust KOMPTE AI to unlock their full potential with cutting-edge exercise analysis and personalized insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/exercise">
                  <Button size="lg" className="btn-premium group text-lg px-10 py-5">
                    <Activity className="w-5 h-5 mr-3" />
                    Start Your Analysis
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="glass-card hover:bg-secondary/70 text-lg px-10 py-5">
                  <Play className="w-5 h-5 mr-3" />
                  View Demo
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-muted-foreground">
              <p>&copy; 2024 KOMPTE AI. Crafting Champions Since 2022.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;