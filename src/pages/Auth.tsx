import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChefHat, BookOpen, Award, Users, Calendar, ClipboardList, 
  FileText, BarChart3, Utensils, Clock, Shield, Zap,
  TrendingUp, MapPin, DollarSign, Settings, Star
} from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, displayName, companyName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! Please check your email to verify your account.');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-primary/5 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-20 h-20 bg-accent/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-secondary/5 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 items-start relative z-10">
        {/* Left Side - Features Showcase */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-3">
              <div className="relative">
                <ChefHat className="h-10 w-10 text-primary animate-bounce" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                  Chef AI Pro
                </h1>
                <p className="text-xs text-primary font-medium tracking-wide">Restaurant Excellence Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Transform your restaurant with AI-powered training, seamless operations, and data-driven insights
            </p>
          </div>

          {/* Compact Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="hover-lift border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <CardContent className="p-3 text-center space-y-1">
                <BookOpen className="h-4 w-4 text-primary mx-auto group-hover:animate-pulse" />
                <Badge variant="secondary" className="text-[10px] px-1 py-0">Training</Badge>
                <h3 className="font-semibold text-xs">Interactive Learning</h3>
                <p className="text-[10px] text-muted-foreground">Courses & certifications</p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-accent/20 hover:border-accent/40 transition-all duration-300 group">
              <CardContent className="p-3 text-center space-y-1">
                <Settings className="h-4 w-4 text-accent mx-auto group-hover:animate-spin" />
                <Badge variant="secondary" className="text-[10px] px-1 py-0">Operations</Badge>
                <h3 className="font-semibold text-xs">Full Management</h3>
                <p className="text-[10px] text-muted-foreground">Schedules & workflows</p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-secondary/20 hover:border-secondary/40 transition-all duration-300 group">
              <CardContent className="p-3 text-center space-y-1">
                <FileText className="h-4 w-4 text-secondary mx-auto group-hover:animate-bounce" />
                <Badge variant="secondary" className="text-[10px] px-1 py-0">Documents</Badge>
                <h3 className="font-semibold text-xs">Smart Documents</h3>
                <p className="text-[10px] text-muted-foreground">SOPs & compliance</p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-success/20 hover:border-success/40 transition-all duration-300 group">
              <CardContent className="p-3 text-center space-y-1">
                <TrendingUp className="h-4 w-4 text-success mx-auto group-hover:animate-pulse" />
                <Badge variant="secondary" className="text-[10px] px-1 py-0">Analytics</Badge>
                <h3 className="font-semibold text-xs">Business Insights</h3>
                <p className="text-[10px] text-muted-foreground">Performance metrics</p>
              </CardContent>
            </Card>
          </div>

          {/* Compact Features List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-card hover:bg-accent/10 transition-colors">
              <ClipboardList className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="text-xs font-medium">Digital Checklists</span>
              <Zap className="h-2 w-2 text-accent ml-auto animate-pulse" />
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-card hover:bg-accent/10 transition-colors">
              <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="text-xs font-medium">Staff Scheduling</span>
              <Star className="h-2 w-2 text-warning ml-auto" />
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-card hover:bg-accent/10 transition-colors">
              <Utensils className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="text-xs font-medium">Recipe Management</span>
              <Shield className="h-2 w-2 text-success ml-auto" />
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-card hover:bg-accent/10 transition-colors">
              <BarChart3 className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="text-xs font-medium">Inventory Control</span>
              <DollarSign className="h-2 w-2 text-success ml-auto animate-bounce" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
            <div className="text-center">
              <div className="text-lg font-bold text-primary animate-fade-in">50+</div>
              <div className="text-[10px] text-muted-foreground">Training Modules</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent animate-fade-in delay-200">24/7</div>
              <div className="text-[10px] text-muted-foreground">AI Assistant</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success animate-fade-in delay-400">100%</div>
              <div className="text-[10px] text-muted-foreground">Cloud Sync</div>
            </div>
          </div>
        </div>

        {/* Right Side - Compact Auth Form */}
        <div className="space-y-4 order-1 lg:order-2">
          <Card className="border-primary/20 shadow-elegant hover-lift transition-all duration-500 backdrop-blur-sm bg-card/95">
            <CardHeader className="pb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Users className="h-3 w-3 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-primary bg-clip-text text-transparent">
                  {isLogin ? 'Welcome Back!' : 'Join Chef AI'}
                </CardTitle>
              </div>
              <CardDescription className="text-xs max-w-xs mx-auto">
                {isLogin 
                  ? 'Access your dashboard and optimize operations' 
                  : 'Start your restaurant excellence journey'
                }
              </CardDescription>
              
              {/* Live Demo Badge */}
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 animate-pulse mx-auto mt-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full mr-1 animate-ping"></div>
                <span className="text-[10px]">Live Demo Available</span>
              </Badge>
            </CardHeader>
            
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="companyName" className="text-xs font-medium">Company Name</Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="TBC Restaurant Group"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required={!isLogin}
                        className="h-8 text-sm transition-all focus:scale-[1.02]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="displayName" className="text-xs font-medium">Your Name</Label>
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="Chef Johnson"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required={!isLogin}
                        className="h-8 text-sm transition-all focus:scale-[1.02]"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="chef@restaurant.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-8 text-sm transition-all focus:scale-[1.02]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-8 text-sm transition-all focus:scale-[1.02]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-9 text-sm bg-gradient-primary hover:shadow-elegant transition-all hover:scale-[1.02] disabled:opacity-50" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span className="text-xs">Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {isLogin ? (
                        <>
                          <Shield className="h-3 w-3" />
                          <span>Access Dashboard</span>
                        </>
                      ) : (
                        <>
                          <Star className="h-3 w-3" />
                          <span>Start Free Trial</span>
                        </>
                      )}
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-4">
                <Separator className="my-3" />
                <div className="text-center text-xs">
                  <span className="text-muted-foreground">
                    {isLogin ? "New to Chef AI?" : "Already managing with us?"}
                  </span>
                  <Button
                    type="button"
                    variant="link"
                    className="ml-1 p-0 h-auto text-xs font-medium text-primary hover:text-primary/80"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Start free trial' : 'Sign in'}
                  </Button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-2 w-2 text-success" />
                    <span>SOC 2</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-2 w-2 text-success" />
                    <span>99.9%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-2 w-2 text-success" />
                    <span>10K+ Users</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compact Demo Card */}
          <Card className="border-accent/20 bg-gradient-card">
            <CardContent className="p-3 text-center">
              <h3 className="text-xs font-semibold text-foreground mb-1">Try Demo Mode</h3>
              <p className="text-[10px] text-muted-foreground mb-2">Experience all features</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs border-accent/50 hover:bg-accent/10"
                onClick={() => {
                  toast.success("Demo mode activated! Exploring sample restaurant...");
                  navigate('/');
                }}
              >
                <MapPin className="h-2 w-2 mr-1" />
                Explore Demo
              </Button>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">
              Enterprise-grade security • 
              <Button variant="link" className="p-0 h-auto text-[10px] ml-1">Terms</Button> • 
              <Button variant="link" className="p-0 h-auto text-[10px]">Privacy</Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;