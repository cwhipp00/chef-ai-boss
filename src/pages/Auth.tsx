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
        const { error } = await signUp(email, password, displayName);
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
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-secondary/5 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Features Showcase */}
        <div className="space-y-8 order-2 lg:order-1">
          {/* Header */}
          <div className="text-center lg:text-left space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="relative">
                <ChefHat className="h-12 w-12 text-primary animate-bounce" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground bg-gradient-primary bg-clip-text text-transparent">
                  RestaurantOS
                </h1>
                <p className="text-sm text-primary font-medium">Complete Management Platform</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
              Transform your restaurant with AI-powered training, seamless operations, and data-driven insights
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Training & Education */}
              <Card className="hover-lift border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary group-hover:animate-pulse" />
                    <Badge variant="secondary" className="text-xs">Training</Badge>
                  </div>
                  <h3 className="font-semibold text-sm">Interactive Learning</h3>
                  <p className="text-xs text-muted-foreground">Courses, certifications & expert instructors</p>
                </CardContent>
              </Card>

              {/* Operations Management */}
              <Card className="hover-lift border-accent/20 hover:border-accent/40 transition-all duration-300 group">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-accent group-hover:animate-spin" />
                    <Badge variant="secondary" className="text-xs">Operations</Badge>
                  </div>
                  <h3 className="font-semibold text-sm">Full Management</h3>
                  <p className="text-xs text-muted-foreground">Schedules, inventory & workflows</p>
                </CardContent>
              </Card>

              {/* Documentation */}
              <Card className="hover-lift border-secondary/20 hover:border-secondary/40 transition-all duration-300 group">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-secondary group-hover:animate-bounce" />
                    <Badge variant="secondary" className="text-xs">Documents</Badge>
                  </div>
                  <h3 className="font-semibold text-sm">Smart Documents</h3>
                  <p className="text-xs text-muted-foreground">SOPs, policies & compliance</p>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card className="hover-lift border-success/20 hover:border-success/40 transition-all duration-300 group">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success group-hover:animate-pulse" />
                    <Badge variant="secondary" className="text-xs">Analytics</Badge>
                  </div>
                  <h3 className="font-semibold text-sm">Business Insights</h3>
                  <p className="text-xs text-muted-foreground">Performance metrics & reports</p>
                </CardContent>
              </Card>
            </div>

            {/* Key Features List */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card hover:bg-accent/10 transition-colors">
                <ClipboardList className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">Digital Checklists & Task Management</span>
                <Zap className="h-3 w-3 text-accent ml-auto animate-pulse" />
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card hover:bg-accent/10 transition-colors">
                <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">Staff Scheduling & Time Tracking</span>
                <Star className="h-3 w-3 text-warning ml-auto" />
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card hover:bg-accent/10 transition-colors">
                <Utensils className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">Recipe Management & Prep Lists</span>
                <Shield className="h-3 w-3 text-success ml-auto" />
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card hover:bg-accent/10 transition-colors">
                <BarChart3 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">Inventory Control & Cost Management</span>
                <DollarSign className="h-3 w-3 text-success ml-auto animate-bounce" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary animate-fade-in">50+</div>
                <div className="text-xs text-muted-foreground">Training Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent animate-fade-in delay-200">24/7</div>
                <div className="text-xs text-muted-foreground">AI Assistant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success animate-fade-in delay-400">100%</div>
                <div className="text-xs text-muted-foreground">Cloud Sync</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="space-y-6 order-1 lg:order-2">
          <Card className="border-primary/20 shadow-elegant hover-lift transition-all duration-500 backdrop-blur-sm bg-card/95">
            <CardHeader className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
                  {isLogin ? 'Welcome Back, Chef!' : 'Join the Kitchen Revolution'}
                </CardTitle>
              </div>
              <CardDescription className="text-center max-w-sm mx-auto">
                {isLogin 
                  ? 'Access your restaurant management dashboard and continue optimizing operations' 
                  : 'Start your journey to restaurant excellence with AI-powered tools and expert training'
                }
              </CardDescription>
              
              {/* Live Demo Badge */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20 animate-pulse">
                  <div className="w-2 h-2 bg-success rounded-full mr-1 animate-ping"></div>
                  Live Demo Available
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Chef Johnson"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required={!isLogin}
                      className="transition-all focus:scale-[1.02] focus:shadow-md"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="chef@restaurant.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all focus:scale-[1.02] focus:shadow-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="transition-all focus:scale-[1.02] focus:shadow-md"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base bg-gradient-primary hover:shadow-elegant transition-all hover:scale-[1.02] disabled:opacity-50" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isLogin ? (
                        <>
                          <Shield className="h-4 w-4" />
                          Access Dashboard
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4" />
                          Start Free Trial
                        </>
                      )}
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    {isLogin ? "New to RestaurantOS?" : "Already managing with us?"}
                  </span>
                  <Button
                    type="button"
                    variant="link"
                    className="ml-1 p-0 h-auto font-medium text-primary hover:text-primary/80"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Start free trial' : 'Sign in to dashboard'}
                  </Button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-success" />
                    <span>SOC 2 Compliant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-success" />
                    <span>99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-success" />
                    <span>10K+ Restaurants</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Demo */}
          <Card className="border-accent/20 bg-gradient-card">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Try Demo Mode</h3>
                <p className="text-xs text-muted-foreground">Experience all features without signing up</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-accent/50 hover:bg-accent/10"
                  onClick={() => {
                    toast.success("Demo mode activated! Exploring sample restaurant...");
                    navigate('/');
                  }}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Explore Demo
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Protected by enterprise-grade security. <br />
              <Button variant="link" className="p-0 h-auto text-xs">Terms</Button> • <Button variant="link" className="p-0 h-auto text-xs">Privacy</Button> • <Button variant="link" className="p-0 h-auto text-xs">Support</Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;